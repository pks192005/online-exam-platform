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
  Query,
  BadRequestException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import csv from 'csv-parser';
import { Readable } from 'stream';

@Controller('questions')
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN, UserRole.FREE)
  async create(@Body() createQuestionDto: CreateQuestionDto, @Request() req) {
    if (req.user.role === UserRole.FREE) {
      const count = await this.questionsService.countFreeQuestions(req.user.userId);
      if (count >= 5) {
        throw new BadRequestException('Free users can only create up to 5 questions');
      }
      createQuestionDto.isFree = true;
    }
    return this.questionsService.create(createQuestionDto, req.user.userId);
  }

  @Post('bulk-upload')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  async bulkUpload(@UploadedFile() file: Express.Multer.File, @Request() req) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const questions: CreateQuestionDto[] = [];
    const stream = Readable.from(file.buffer);

    return new Promise((resolve, reject) => {
      stream
        .pipe(csv())
        .on('data', (row) => {
          try {
            const question: CreateQuestionDto = {
              text: row.text,
              type: row.type,
              subject: row.subject,
              topic: row.topic || undefined,
              points: parseInt(row.points) || 1,
              correctAnswer: row.correctAnswer || undefined,
              options: row.options ? JSON.parse(row.options) : [],
            };
            questions.push(question);
          } catch (error) {
            console.error('Error parsing row:', error);
          }
        })
        .on('end', async () => {
          try {
            const created = await this.questionsService.bulkCreate(questions, req.user.userId);
            resolve({ message: `Successfully uploaded ${created.length} questions`, count: created.length });
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Request() req, @Query('isFree') isFree?: string) {
    const isFreeQuery = isFree === 'true';
    return this.questionsService.findAll(req.user.userId, req.user.role, isFreeQuery);
  }

  @Get('subject/:subject')
  findBySubject(@Param('subject') subject: string, @Query('isFree') isFree?: string) {
    const isFreeQuery = isFree === 'true';
    return this.questionsService.findBySubject(subject, isFreeQuery);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string, @Query('isFree') isFree?: string) {
    const isFreeQuery = isFree === 'true';
    return this.questionsService.findOne(id, isFreeQuery);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateQuestionDto: UpdateQuestionDto, @Request() req) {
    return this.questionsService.update(id, updateQuestionDto, req.user.userId, req.user.role);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  remove(@Param('id') id: string, @Request() req) {
    return this.questionsService.delete(id, req.user.userId, req.user.role);
  }
}
