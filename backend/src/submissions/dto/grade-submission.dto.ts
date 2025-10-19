import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GradeAnswerDto {
  @IsString()
  questionId: string;

  @IsNumber()
  pointsAwarded: number;

  @IsString()
  @IsOptional()
  feedback?: string;
}
