import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorater/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { successInterceptor } from 'src/common/interceptor/success.interceptor';
import { diaryCreateDto } from '../dto/diary.create.dto';
import { DiaryService } from '../service/diary.service';

@Controller('diary')
@UseInterceptors(successInterceptor)
@UseFilters(HttpExceptionFilter)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @ApiOperation({ summary: '여행 일기 작성' })
  @UseGuards(jwtAuthGuard)
  @Post('/create')
  async createDiary(@CurrentUser() User, @Body() body: diaryCreateDto) {
    return this.diaryService.createDiary(User.email, body);
  }
  @ApiOperation({ summary: '여행 일기 조회' })
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getUserAndDiary(@CurrentUser() User) {
    return this.diaryService.getDiary(User.email);
  }
  @ApiOperation({ summary: '여행 일기 업데이트' })
  @UseGuards(jwtAuthGuard)
  @Patch('')
  async updateDiary() {
    return 'updateDiary';
  }

  @ApiOperation({ summary: '여행 일기 삭제' })
  @UseGuards(jwtAuthGuard)
  @Delete('/delete')
  async deleteDiary() {
    return 'deleteDiary';
  }
}
