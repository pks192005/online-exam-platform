import { IsString, IsArray, IsOptional, ValidateNested, IsNumber, IsBoolean, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

class ExamQuestionDto {
  @IsString()
  questionId: string;

  @IsNumber()
  order: number;
}

class ExamSettingsDto {
  @IsNumber()
  duration: number;

  @IsNumber()
  passingScore: number;

  @IsBoolean()
  @IsOptional()
  shuffleQuestions?: boolean;

  @IsBoolean()
  @IsOptional()
  allowReview?: boolean;

  @IsBoolean()
  @IsOptional()
  showCorrectAnswers?: boolean;
}

export class CreateExamDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  topic?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamQuestionDto)
  @IsOptional()
  questions?: ExamQuestionDto[];

  @ValidateNested()
  @Type(() => ExamSettingsDto)
  settings: ExamSettingsDto;

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
