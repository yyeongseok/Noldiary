import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';
//import { JwtKakaoStrategy } from '../jwt/jwt.kakao.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    //private readonly jwtKakaoStrategy: JwtKakaoStrategy,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @Post('/login/kakao')
  async kakaologin(@Body() body: any, @Response() res): Promise<any> {
    try {
      const { code, domain } = body;
      if (!code || !domain) {
        throw new BadRequestException('카카오 정보가 (코드,도메인)없습니다.');
      }
      const kakao = await this.authService.OAuthLogin({ code, domain });

      console.log(`kakaoUserInfo : ${JSON.stringify(kakao)}`);

      if (!kakao.id) {
        throw new BadRequestException('카카오 아이디가 없습니다.');
      }

      res.send({
        user: kakao,
        message: 'success',
      });
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('카카오 정보가 없습니다.');
    }
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @Post('/login/naver')
  async naverLogin() {
    return this.naverLogin;
  }
}
