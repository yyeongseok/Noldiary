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
import { ConfigService } from '@nestjs/config';
import { ApiOperation } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorater/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { successInterceptor } from 'src/common/interceptor/success.interceptor';
import { diaryCreateDto } from '../dto/diary.create.dto';
import { DiaryService } from '../service/diary.service';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Controller('diary')
@UseInterceptors(successInterceptor)
@UseFilters(HttpExceptionFilter)
export class DiaryController {
  constructor(
    private readonly diaryService: DiaryService,
    private readonly configService: ConfigService,
  ) {}

  @ApiOperation({ summary: '여행 일기 작성' })
  @UseGuards(jwtAuthGuard)
  @Post('/create')
  async createDiary(@CurrentUser() User, @Body() body: diaryCreateDto) {
    return this.diaryService.createDiary(User, body);
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

  @Post('/create/presigned')
  async presigned(
    @Body('filename') filename: string,
    //@Body('type') type: string,
  ) {
    const client = new S3Client({
      region: this.configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY'), // process.env.AWS_S3_ACCESS_KEY
        secretAccessKey: this.configService.get('AWS_S3_SECRET_KEY'),
      },
    });
    //const type = 'image/jpeg';
    const date = new Date();
    date.setMinutes(date.getMinutes() + 1);
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
      Key: filename,
      ContentType: 'image/jpeg',
      Expires: date,
    });
    return await getSignedUrl(client, command);
  }
}
