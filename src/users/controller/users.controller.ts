import {
  Body,
  Controller,
  Get,
  Patch,
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
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getCurrentUser(@CurrentUser() Users) {
    return Users.readonlyData;
  }
  @ApiResponse({
    status: 500,
    description: 'Server Error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: readonlyUsersDto,
  })
  @ApiOperation({ summary: 'S3에 이미지 업로드 하기' })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(jwtAuthGuard)
  @Post('/upload')
  async updateProfileImage(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return await this.awsService.uploadFileToS3('users', file);
  }

  @ApiOperation({ summary: '키값을 통해 유저프로필 S3 url로 변경하기 ' })
  @UseGuards(jwtAuthGuard)
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
