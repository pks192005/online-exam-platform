import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export class Answer {
  @Prop({ type: Types.ObjectId, ref: 'Question', required: true })
  questionId: Types.ObjectId;

  @Prop()
  answer?: string;

  @Prop({ type: [String], default: [] })
  selectedOptions: string[];

  @Prop({ default: false })
  isCorrect: boolean;

  @Prop({ default: 0 })
  pointsAwarded: number;

  @Prop()
  feedback?: string;
}

export enum SubmissionStatus {
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  GRADED = 'graded',
}

@Schema({ timestamps: true })
export class Submission extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Exam', required: true })
  examId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  studentId: Types.ObjectId;

  @Prop({ type: [Answer], default: [] })
  answers: Answer[];

  @Prop({ type: String, enum: SubmissionStatus, default: SubmissionStatus.IN_PROGRESS })
  status: SubmissionStatus;

  @Prop()
  startedAt?: Date;

  @Prop()
  submittedAt?: Date;

  @Prop()
  gradedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  gradedBy?: Types.ObjectId;

  @Prop({ default: 0 })
  totalScore: number;

  @Prop({ default: 0 })
  maxScore: number;

  @Prop({ default: 0 })
  percentage: number;

  @Prop({ default: false })
  passed: boolean;

  @Prop()
  timeSpent?: number;
}

export const SubmissionSchema = SchemaFactory.createForClass(Submission);
