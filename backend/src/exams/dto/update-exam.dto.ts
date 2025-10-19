import { IsString, IsArray, IsOptional, ValidateNested, IsEnum, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ExamStatus } from '../schemas/exam.schema';

class ExamQuestionDto {
  @IsString()
  questionId: string;

  @IsString()
  order: number;
}

export class UpdateExamDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  subject?: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamQuestionDto)
  @IsOptional()
  questions?: ExamQuestionDto[];

  @IsEnum(ExamStatus)
  @IsOptional()
  status?: ExamStatus;

  @IsArray()
  @IsOptional()
  assignedStudents?: string[];

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}
