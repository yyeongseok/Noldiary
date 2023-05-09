import {
  Controller,
  Get,
  Patch,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorater/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { successInterceptor } from 'src/common/interceptor/success.interceptor';
import { MulterOption } from 'src/common/utils/multer.options';
import { UsersService } from '../service/users.service';
import { Users } from '../users.schema';

@Controller('users')
@UseInterceptors(successInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '현재 회원 정보 조회' })
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getCurrentUser(@CurrentUser() Users) {
    return Users.readonlyData;
  }
  @ApiOperation({ summary: '회원 프로필 사진 업데이트' })
  @UseInterceptors(FileInterceptor('image', MulterOption('users')))
  @UseGuards(jwtAuthGuard)
  @Post('/upload')
  async updateProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() users: Users,
  ) {
    console.log(file);
    return await this.usersService.updateProfileImage(users, file);
  }

  @Get('')
  async signUp() {
    return 'signUp';
  }
}
