import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiOperation } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorater/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { successInterceptor } from 'src/common/interceptor/success.interceptor';
import { diaryCreateDto } from '../dto/diary.create.dto';
import { DiaryService } from '../service/diary.service';
import { S3Service } from 'src/s3/s3.service';
import * as path from 'path';

@Controller('diary')
@UseInterceptors(successInterceptor)
@UseFilters(HttpExceptionFilter)
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  @ApiOperation({ summary: '여행 일기 작성' })
  @UseGuards(jwtAuthGuard)
  @Post('/create')
  async createDiary(@CurrentUser() User, @Body() body: diaryCreateDto) {
    return this.diaryService.createDiary(User, body);
  }
  @ApiOperation({ summary: '회원별 여행 일기 조회' })
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getUserAndDiary(@CurrentUser() User) {
    return this.diaryService.getDiary(User.email);
  }
  @ApiOperation({ summary: '여행일기 상세 조회' })
  @UseGuards(jwtAuthGuard)
  @Get('/:id')
  async getDiaryById(@Param('id') id: string) {
    return this.diaryService.getDiaryById(id);
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

  @ApiOperation({ summary: 'S3 presigned Url' })
  @Post('/create/presigned')
  async generatePresignedUrl(
    @Body('file') file: string,
  ): Promise<{ url: string }> {
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME');

    const objectKey = `image/${Date.now()}_${file}`;

    const contentType = 'image/*';
    const expirationSeconds = 3600;

    const signedUrl = await this.s3Service.generatePresignedUrl(
      bucketName,
      objectKey,
      contentType,
      expirationSeconds,
    );

    return { url: signedUrl };
  }
}
