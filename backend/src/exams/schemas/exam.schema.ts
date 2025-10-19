import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ExamStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ACTIVE = 'active',
  ARCHIVED = 'archived',
}

export class ExamQuestion {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop({ required: true })
  order: number;
}

export class ExamSettings {
  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  passingScore: number;

  @Prop({ default: false })
  shuffleQuestions: boolean;

  @Prop({ default: true })
  allowReview: boolean;

  @Prop({ default: false })
  showCorrectAnswers: boolean;
}

@Schema({ timestamps: true })
export class Exam extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  subject: string;

  @Prop()
  topic?: string;

  @Prop({ type: [ExamQuestion], default: [] })
  questions: ExamQuestion[];

  @Prop({ type: ExamSettings, required: true })
  settings: ExamSettings;

  @Prop({ type: String, enum: ExamStatus, default: ExamStatus.DRAFT })
  status: ExamStatus;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  assignedStudents: Types.ObjectId[];

  @Prop()
  startDate?: Date;

  @Prop()
  endDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: 0 })
  totalPoints: number;
}

export const ExamSchema = SchemaFactory.createForClass(Exam);
