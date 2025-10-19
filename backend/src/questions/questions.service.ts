import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Question } from './schemas/question.schema';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class QuestionsService {
  private freeQuestionModel: Model<Question>;

  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>,
    @InjectConnection() private connection: Connection,
  ) {
    this.freeQuestionModel = this.connection.useDb('exam-management-free').model(Question.name, this.questionModel.schema);
  }

  async create(createQuestionDto: CreateQuestionDto, userId: string): Promise<Question> {
    const model = createQuestionDto.isFree ? this.freeQuestionModel : this.questionModel;
    const question = new model({
      ...createQuestionDto,
      createdBy: userId,
    });
    return question.save();
  }

  async findAll(userId: string, userRole: UserRole, isFree: boolean = false): Promise<Question[]> {
    const model = isFree ? this.freeQuestionModel : this.questionModel;
    
    if (userRole === UserRole.ADMIN) {
      return model.find().populate('createdBy', 'firstName lastName email').exec();
    }
    
    return model.find({ createdBy: userId }).populate('createdBy', 'firstName lastName email').exec();
  }

  async findBySubject(subject: string, isFree: boolean = false): Promise<Question[]> {
    const model = isFree ? this.freeQuestionModel : this.questionModel;
    return model.find({ subject }).limit(isFree ? 5 : 0).exec();
  }

  async findOne(id: string, isFree: boolean = false): Promise<Question> {
    const model = isFree ? this.freeQuestionModel : this.questionModel;
    const question = await model.findById(id).populate('createdBy', 'firstName lastName email').exec();
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
  }

  async update(id: string, updateQuestionDto: UpdateQuestionDto, userId: string, userRole: UserRole): Promise<Question> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (userRole !== UserRole.ADMIN && question.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only update your own questions');
    }

    const updatedQuestion = await this.questionModel.findByIdAndUpdate(
      id,
      { $set: updateQuestionDto },
      { new: true },
    ).exec();

    return updatedQuestion;
  }

  async delete(id: string, userId: string, userRole: UserRole): Promise<void> {
    const question = await this.questionModel.findById(id);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    if (userRole !== UserRole.ADMIN && question.createdBy.toString() !== userId) {
      throw new ForbiddenException('You can only delete your own questions');
    }

    await this.questionModel.findByIdAndDelete(id).exec();
  }

  async countFreeQuestions(userId: string): Promise<number> {
    return this.freeQuestionModel.countDocuments({ createdBy: userId }).exec();
  }

  async bulkCreate(questions: CreateQuestionDto[], userId: string): Promise<any[]> {
    const questionsWithUser = questions.map(q => ({
      ...q,
      createdBy: userId,
    }));
    return this.questionModel.insertMany(questionsWithUser) as any;
  }
}
