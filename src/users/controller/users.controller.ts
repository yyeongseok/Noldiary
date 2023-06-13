import {
  Body,
  Controller,
  Get,
  Post,
  Response,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { AwsService } from 'src/aws/aws.service';
import { CurrentUser } from 'src/common/decorater/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { successInterceptor } from 'src/common/interceptor/success.interceptor';
import { readonlyUsersDto } from '../dto/users.response.dto';
import { Users } from '../users.schema';

@Controller('users')
@UseInterceptors(successInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly awsService: AwsService) {}

  @ApiOperation({ summary: '현재 회원 정보 조회' })
  @ApiResponse({ type: readonlyUsersDto })
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getCurrentUser(@CurrentUser() Users) {
    return Users.readonlyData;
  }
  //이름, 프로필 이미지,닉네임(수정하는거),자기상태메세지(빈값가능),작성한 일기 갯수(넘버),공유일기 갯수(넘버)
  //백그라운 이미지 조회, 업데이트
  //이미지 업로드 하고 키값을 바로 프론트로 리턴하지 않고 키값으로 s3 url 받아서 데이터 베이스에 저장하기

  @ApiOperation({ summary: 'S3에 이미지 업로드 하기' })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(jwtAuthGuard)
  @Post('/upload')
  async updateProfileImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.awsService.uploadFileToS3('users', file);
  }

  @ApiOperation({ summary: '키값을 통해 유저프로필 S3 url로 변경하기 ' })
  //@UseGuards(jwtAuthGuard)
  @Post('key')
  async getImageUrl(
    @Body('key') key: string,
    @Response() res,
    @CurrentUser() users: Users,
  ) {
    const newUserProfile = await this.awsService.getAwsS3FileUrl(users, key);

    res.status(200).json({ newUserProfile: newUserProfile });
  }
}
