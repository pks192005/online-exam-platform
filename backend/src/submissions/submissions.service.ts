import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Submission, SubmissionStatus } from './schemas/submission.schema';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { GradeAnswerDto } from './dto/grade-submission.dto';
import { Exam } from '../exams/schemas/exam.schema';
import { Question, QuestionType } from '../questions/schemas/question.schema';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectModel(Submission.name) private submissionModel: Model<Submission>,
    @InjectModel(Exam.name) private examModel: Model<Exam>,
    @InjectModel(Question.name) private questionModel: Model<Question>,
  ) {}

  async startExam(examId: string, studentId: string): Promise<Submission> {
    const exam = await this.examModel.findById(examId);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const existingSubmission = await this.submissionModel.findOne({
      examId,
      studentId,
      status: SubmissionStatus.IN_PROGRESS,
    });

    if (existingSubmission) {
      return existingSubmission;
    }

    const submission = new this.submissionModel({
      examId,
      studentId,
      status: SubmissionStatus.IN_PROGRESS,
      startedAt: new Date(),
      answers: [],
    });

    return submission.save();
  }

  async submitExam(createSubmissionDto: CreateSubmissionDto, studentId: string): Promise<Submission> {
    const exam = await this.examModel.findById(createSubmissionDto.examId).populate('questions.questionId');
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    let submission = await this.submissionModel.findOne({
      examId: createSubmissionDto.examId,
      studentId,
      status: SubmissionStatus.IN_PROGRESS,
    });

    if (!submission) {
      submission = new this.submissionModel({
        examId: createSubmissionDto.examId,
        studentId,
        startedAt: new Date(),
      });
    }

    const gradedAnswers = await this.autoGradeAnswers(createSubmissionDto.answers, exam);
    
    submission.answers = gradedAnswers;
    submission.status = SubmissionStatus.SUBMITTED;
    submission.submittedAt = new Date();
    submission.timeSpent = submission.startedAt 
      ? (new Date().getTime() - submission.startedAt.getTime()) / 1000 
      : 0;

    const totalScore = gradedAnswers.reduce((sum, answer) => sum + answer.pointsAwarded, 0);
    const maxScore = exam.totalPoints || gradedAnswers.reduce((sum, answer) => sum + (answer.pointsAwarded || 1), 0);
    const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;

    submission.totalScore = totalScore;
    submission.maxScore = maxScore;
    submission.percentage = percentage;
    submission.passed = percentage >= exam.settings.passingScore;

    const hasEssayQuestions = gradedAnswers.some(a => {
      const question = exam.questions.find(q => q.questionId.toString() === a.questionId.toString());
      return question && (question.questionId as any).type === QuestionType.ESSAY;
    });

    if (!hasEssayQuestions) {
      submission.status = SubmissionStatus.GRADED;
      submission.gradedAt = new Date();
    }

    return submission.save();
  }

  private async autoGradeAnswers(answers: any[], exam: Exam): Promise<any[]> {
    const gradedAnswers = [];

    for (const answer of answers) {
      const question = await this.questionModel.findById(answer.questionId);
      if (!question) continue;

      const gradedAnswer: any = {
        questionId: answer.questionId,
        answer: answer.answer,
        selectedOptions: answer.selectedOptions || [],
        isCorrect: false,
        pointsAwarded: 0,
      };

      if (question.type === QuestionType.MULTIPLE_CHOICE) {
        const correctOptions = question.options
          .filter(opt => opt.isCorrect)
          .map(opt => opt.text);
        
        const selectedCorrect = answer.selectedOptions?.filter(opt => correctOptions.includes(opt)) || [];
        const selectedIncorrect = answer.selectedOptions?.filter(opt => !correctOptions.includes(opt)) || [];
        
        if (selectedCorrect.length === correctOptions.length && selectedIncorrect.length === 0) {
          gradedAnswer.isCorrect = true;
          gradedAnswer.pointsAwarded = question.points;
        }
      } else if (question.type === QuestionType.TRUE_FALSE) {
        if (answer.answer?.toLowerCase() === question.correctAnswer?.toLowerCase()) {
          gradedAnswer.isCorrect = true;
          gradedAnswer.pointsAwarded = question.points;
        }
      } else if (question.type === QuestionType.FILL_IN_BLANK) {
        if (answer.answer?.trim().toLowerCase() === question.correctAnswer?.trim().toLowerCase()) {
          gradedAnswer.isCorrect = true;
          gradedAnswer.pointsAwarded = question.points;
        }
      } else if (question.type === QuestionType.ESSAY) {
        gradedAnswer.pointsAwarded = 0;
      }

      gradedAnswers.push(gradedAnswer);
    }

    return gradedAnswers;
  }

  async gradeEssayAnswer(submissionId: string, gradeAnswerDto: GradeAnswerDto, graderId: string): Promise<Submission> {
    const submission = await this.submissionModel.findById(submissionId);
    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    const answerIndex = submission.answers.findIndex(
      a => a.questionId.toString() === gradeAnswerDto.questionId
    );

    if (answerIndex === -1) {
      throw new NotFoundException('Answer not found');
    }

    submission.answers[answerIndex].pointsAwarded = gradeAnswerDto.pointsAwarded;
    submission.answers[answerIndex].feedback = gradeAnswerDto.feedback;

    const totalScore = submission.answers.reduce((sum, answer) => sum + answer.pointsAwarded, 0);
    submission.totalScore = totalScore;
    submission.percentage = (totalScore / submission.maxScore) * 100;

    const exam = await this.examModel.findById(submission.examId);
    submission.passed = submission.percentage >= exam.settings.passingScore;

    submission.status = SubmissionStatus.GRADED;
    submission.gradedAt = new Date();
    submission.gradedBy = graderId as any;

    return submission.save();
  }

  async findAll(userId: string, userRole: UserRole): Promise<Submission[]> {
    if (userRole === UserRole.ADMIN) {
      return this.submissionModel.find()
        .populate('examId')
        .populate('studentId', 'firstName lastName email')
        .exec();
    }

    if (userRole === UserRole.TEACHER) {
      const exams = await this.examModel.find({ createdBy: userId }).select('_id');
      const examIds = exams.map(e => e._id);
      return this.submissionModel.find({ examId: { $in: examIds } })
        .populate('examId')
        .populate('studentId', 'firstName lastName email')
        .exec();
    }

    if (userRole === UserRole.STUDENT) {
      return this.submissionModel.find({ studentId: userId })
        .populate('examId')
        .exec();
    }

    return [];
  }

  async findOne(id: string, userId: string, userRole: UserRole): Promise<Submission> {
    const submission = await this.submissionModel.findById(id)
      .populate('examId')
      .populate('studentId', 'firstName lastName email')
      .exec();

    if (!submission) {
      throw new NotFoundException('Submission not found');
    }

    if (userRole === UserRole.STUDENT && submission.studentId.toString() !== userId) {
      throw new ForbiddenException('You can only view your own submissions');
    }

    if (userRole === UserRole.TEACHER) {
      const exam = await this.examModel.findById(submission.examId);
      if (exam.createdBy.toString() !== userId) {
        throw new ForbiddenException('You can only view submissions for your own exams');
      }
    }

    return submission;
  }

  async findByExam(examId: string, userId: string, userRole: UserRole): Promise<Submission[]> {
    const exam = await this.examModel.findById(examId);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole === UserRole.TEACHER && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only view submissions for your own exams');
    }

    return this.submissionModel.find({ examId })
      .populate('studentId', 'firstName lastName email')
      .exec();
  }
}
