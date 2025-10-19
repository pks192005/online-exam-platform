import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamStatus } from './schemas/exam.schema';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class ExamsService {
  constructor(@InjectModel(Exam.name) private examModel: Model<Exam>) {}

  async create(createExamDto: CreateExamDto, userId: string): Promise<Exam> {
    const exam = new this.examModel({
      ...createExamDto,
      createdBy: userId,
      status: ExamStatus.DRAFT,
    });
    return exam.save();
  }

  async findAll(userId: string, userRole: UserRole): Promise<Exam[]> {
    if (userRole === UserRole.ADMIN) {
      return this.examModel.find().populate('createdBy', 'firstName lastName email').exec();
    }
    
    if (userRole === UserRole.TEACHER) {
      return this.examModel.find({ createdBy: userId }).populate('createdBy', 'firstName lastName email').exec();
    }
    
    if (userRole === UserRole.STUDENT) {
      return this.examModel.find({
        assignedStudents: userId,
        status: { $in: [ExamStatus.PUBLISHED, ExamStatus.ACTIVE] },
      }).populate('createdBy', 'firstName lastName email').exec();
    }

    return [];
  }

  async findOne(id: string, userId: string, userRole: UserRole): Promise<Exam> {
    const exam = await this.examModel.findById(id)
      .populate('createdBy', 'firstName lastName email')
      .populate('questions.questionId')
      .exec();

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole === UserRole.STUDENT) {
      if (!exam.assignedStudents.includes(userId as any) || 
          ![ExamStatus.PUBLISHED, ExamStatus.ACTIVE].includes(exam.status)) {
        throw new ForbiddenException('You do not have access to this exam');
      }
    } else if (userRole === UserRole.TEACHER) {
      if (exam.createdBy.toString() !== userId) {
        throw new ForbiddenException('You can only view your own exams');
      }
    }

    return exam;
  }

  async update(id: string, updateExamDto: UpdateExamDto, userId: string, userRole: UserRole): Promise<Exam> {
    const exam = await this.examModel.findById(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole !== UserRole.ADMIN && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own exams');
    }

    if (exam.status !== ExamStatus.DRAFT && userRole !== UserRole.ADMIN) {
      throw new BadRequestException('Cannot update published exams');
    }

    const updatedExam = await this.examModel.findByIdAndUpdate(
      id,
      { $set: updateExamDto },
      { new: true },
    ).exec();

    if (!updatedExam) {
      throw new NotFoundException('Exam not found');
    }

    return updatedExam;
  }

  async delete(id: string, userId: string, userRole: UserRole): Promise<void> {
    const exam = await this.examModel.findById(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole !== UserRole.ADMIN && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own exams');
    }

    await this.examModel.findByIdAndDelete(id).exec();
  }

  async publish(id: string, userId: string, userRole: UserRole): Promise<Exam> {
    const exam = await this.examModel.findById(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole !== UserRole.ADMIN && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only publish your own exams');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new BadRequestException('Only draft exams can be published');
    }

    if (!exam.questions || exam.questions.length === 0) {
      throw new BadRequestException('Cannot publish exam without questions');
    }

    exam.status = ExamStatus.PUBLISHED;
    return exam.save();
  }

  async activate(id: string, userId: string, userRole: UserRole): Promise<Exam> {
    const exam = await this.examModel.findById(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole !== UserRole.ADMIN && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only activate your own exams');
    }

    if (exam.status !== ExamStatus.PUBLISHED) {
      throw new BadRequestException('Only published exams can be activated');
    }

    exam.status = ExamStatus.ACTIVE;
    return exam.save();
  }

  async archive(id: string, userId: string, userRole: UserRole): Promise<Exam> {
    const exam = await this.examModel.findById(id);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole !== UserRole.ADMIN && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only archive your own exams');
    }

    exam.status = ExamStatus.ARCHIVED;
    return exam.save();
  }

  async addQuestion(examId: string, questionId: string, userId: string, userRole: UserRole): Promise<Exam> {
    const exam = await this.examModel.findById(examId);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole !== UserRole.ADMIN && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only modify your own exams');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new BadRequestException('Cannot modify published exams');
    }

    const order = exam.questions.length + 1;
    exam.questions.push({ questionId: questionId as any, order });
    return exam.save();
  }

  async removeQuestion(examId: string, questionId: string, userId: string, userRole: UserRole): Promise<Exam> {
    const exam = await this.examModel.findById(examId);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    if (userRole !== UserRole.ADMIN && exam.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only modify your own exams');
    }

    if (exam.status !== ExamStatus.DRAFT) {
      throw new BadRequestException('Cannot modify published exams');
    }

    exam.questions = exam.questions.filter(q => q.questionId.toString() !== questionId);
    return exam.save();
  }
}
