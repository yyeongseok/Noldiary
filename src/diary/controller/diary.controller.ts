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
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorater/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { successInterceptor } from 'src/common/interceptor/success.interceptor';
import { diaryCreateDto } from '../dto/diary.create.dto';
import { DiaryService } from '../service/diary.service';
import { S3Service } from 'src/s3/s3.service';
import { diaryUpdateDto } from '../dto/diary.update.dto';

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
  @ApiBody({ type: diaryCreateDto })
  @ApiCreatedResponse({
    description: '생성',
    schema: { example: { success: 'created' } },
  })
  @UseGuards(jwtAuthGuard)
  @Post('')
  async createDiary(@CurrentUser() User, @Body() body: diaryCreateDto) {
    return this.diaryService.createDiary(User.email, body);
  }

  @ApiOperation({ summary: '회원별 여행 일기 조회' })
  @ApiResponse({
    description: '조회',
    schema: { example: { success: 'success' } },
  })
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getUserAndDiary(@CurrentUser() User) {
    return this.diaryService.getDiary(User.email);
  }

  @ApiOperation({ summary: '여행일기 상세 조회' })
  @ApiParam({
    description: '다이어리ID',
    name: '다이어리ID',
  })
  @UseGuards(jwtAuthGuard)
  @Get('/:id')
  async getDiaryById(@Param('id') id: string) {
    return this.diaryService.getDiaryById(id);
  }

  @ApiOperation({ summary: '여행 일기 업데이트' })
  @ApiParam({
    description: '다이어리ID',
    name: '다이어리ID',
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: { description: '변경된 다이어리 정보' },
    },
  })
  @UseGuards(jwtAuthGuard)
  @Patch('/:id')
  async updateDiary(
    @Param('id') id: string,
    @Body() body: diaryUpdateDto,
    @CurrentUser() User,
  ) {
    const update = await this.diaryService.updateDiary(id, body, User.email);

    const updateDiary = await this.diaryService.getDiaryById(id);
    return updateDiary;
  }

  @ApiOperation({ summary: '이메일 초대하기' })
  @UseGuards(jwtAuthGuard)
  @Patch('')
  async inviteEmail() {
    return 'inviteEmail';
  }
  @ApiOperation({ summary: '여행 일기 삭제' })
  //@UseGuards(jwtAuthGuard)
  @Delete('/:id')
  async deleteDiary(@Param('id') id: string): Promise<void> {
    return this.diaryService.deleteDiary(id);
  }

  @ApiOperation({ summary: 'S3 presigned Url' })
  //@UseGuards(jwtAuthGuard)
  @Post('/presigned')
  async generatePresignedUrl(
    @Body('fileName') fileName: string,
  ): Promise<{ url: string }> {
    console.log(fileName);
    const bucketName = this.configService.get('AWS_S3_BUCKET_NAME');
    const objectKey = `image/${Date.now()}_image`;
    const expirationSeconds = 3600;
    const signedUrl = await this.s3Service.generatePresignedUrl(
      bucketName,
      objectKey,
      expirationSeconds,
    );
    return { url: signedUrl };
  }
}
