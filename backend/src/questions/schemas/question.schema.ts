import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  FILL_IN_BLANK = 'fill_in_blank',
  ESSAY = 'essay',
}

export class QuestionOption {
  @Prop({ required: true })
  text: string;

  @Prop({ default: false })
  isCorrect: boolean;
}

@Schema({ timestamps: true })
export class Question extends Document {
  @Prop({ required: true })
  text: string;

  @Prop({ type: String, enum: QuestionType, required: true })
  type: QuestionType;

  @Prop({ type: [QuestionOption], default: [] })
  options: QuestionOption[];

  @Prop()
  correctAnswer?: string;

  @Prop({ default: 1 })
  points: number;

  @Prop({ required: true })
  subject: string;

  @Prop()
  topic?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: false })
  isFree: boolean;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
