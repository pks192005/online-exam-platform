import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Patch,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/create-submission.dto';
import { GradeAnswerDto } from './dto/grade-submission.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('submissions')
export class SubmissionsController {
  constructor(private readonly submissionsService: SubmissionsService) {}

  @Post('start/:examId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STUDENT)
  startExam(@Param('examId') examId: string, @Request() req) {
    return this.submissionsService.startExam(examId, req.user.userId);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.STUDENT)
  submit(@Body() createSubmissionDto: CreateSubmissionDto, @Request() req) {
    return this.submissionsService.submitExam(createSubmissionDto, req.user.userId);
  }

  @Patch(':id/grade')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  gradeEssay(@Param('id') id: string, @Body() gradeAnswerDto: GradeAnswerDto, @Request() req) {
    return this.submissionsService.gradeEssayAnswer(id, gradeAnswerDto, req.user.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req) {
    return this.submissionsService.findAll(req.user.userId, req.user.role);
  }

  @Get('exam/:examId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  findByExam(@Param('examId') examId: string, @Request() req) {
    return this.submissionsService.findByExam(examId, req.user.userId, req.user.role);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Request() req) {
    return this.submissionsService.findOne(id, req.user.userId, req.user.role);
  }
}
