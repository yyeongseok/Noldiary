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
import { usersUpdateDto } from '../dto/users.update.dto';
import { UsersService } from '../service/users.service';
import { Users } from '../users.schema';

@Controller('users')
@UseInterceptors(successInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(
    private readonly awsService: AwsService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: '현재 회원 정보 조회' })
  @ApiResponse({ type: readonlyUsersDto })
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getCurrentUser(@CurrentUser() user) {
    const getUserInfo = await this.usersService.getUserInfo(user.email);
    return getUserInfo;
  }

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
  async getImageUrl(@Body('key') key: string, @CurrentUser() user: Users) {
    const newUserProfile = await this.awsService.getAwsS3FileUrl(user, key);

    return newUserProfile;
  }
  @ApiOperation({ summary: '회원정보 변경' })
  @UseGuards(jwtAuthGuard)
  @Patch('')
  async updateUserInfo(
    @CurrentUser() user: Users,
    @Body('body') body: usersUpdateDto,
  ) {
    const updateUserInfo = await this.usersService.updateUserInfo(
      user.email,
      body,
    );
    return updateUserInfo;
  }
}
