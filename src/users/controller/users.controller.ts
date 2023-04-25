import {
  Controller,
  Get,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorater/user.decorator';
import { HttpExceptionFilter } from 'src/common/exception/http-exception.filter';
import { successInterceptor } from 'src/common/interceptor/success.interceptor';
import { readonlyUsersDto } from '../dto/users.response.dto';
import { UsersService } from '../service/users.service';

@Controller('users')
@UseInterceptors(successInterceptor)
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '현재 회원 정보 조회' })
  @UseGuards(jwtAuthGuard)
  @Get('')
  async getCurrentUser(@CurrentUser() Users) {
    return Users;
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
  @Patch()
  async updateProfileImage() {
    return 'updateProfileImage';
  }

  @Post('')
  async signUp() {
    return 'signUp';
  }
}
