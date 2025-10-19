import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('exams')
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  create(@Body() createExamDto: CreateExamDto, @Request() req) {
    return this.examsService.create(createExamDto, req.user.userId);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req) {
    return this.examsService.findAll(req.user.userId, req.user.role);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Request() req) {
    return this.examsService.findOne(id, req.user.userId, req.user.role);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateExamDto: UpdateExamDto, @Request() req) {
    return this.examsService.update(id, updateExamDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.examsService.delete(id, req.user.userId, req.user.role);
  }

  @Post(':id/publish')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  publish(@Param('id') id: string, @Request() req) {
    return this.examsService.publish(id, req.user.userId, req.user.role);
  }

  @Post(':id/activate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  activate(@Param('id') id: string, @Request() req) {
    return this.examsService.activate(id, req.user.userId, req.user.role);
  }

  @Post(':id/archive')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  archive(@Param('id') id: string, @Request() req) {
    return this.examsService.archive(id, req.user.userId, req.user.role);
  }

  @Post(':id/questions/:questionId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  addQuestion(@Param('id') id: string, @Param('questionId') questionId: string, @Request() req) {
    return this.examsService.addQuestion(id, questionId, req.user.userId, req.user.role);
  }

  @Delete(':id/questions/:questionId')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  removeQuestion(@Param('id') id: string, @Param('questionId') questionId: string, @Request() req) {
    return this.examsService.removeQuestion(id, questionId, req.user.userId, req.user.role);
  }
}
