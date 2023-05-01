import {
  BadRequestException,
  Controller,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    //private readonly jwtKakaoStrategy: JwtKakaoStrategy,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @Post('/login/kakao')
  async kakaotoken(@Request() req, @Response() res): Promise<any> {
    try {
      const accesstoken = req.headers.authorization;
      console.log(accesstoken);
      if (!accesstoken) {
        throw new BadRequestException('카카오 정보가 없습니다.');
      }
      const kakaoAccessToken = await this.authService.kakaoLogin(accesstoken);

      console.log(`kakaoUserInfo: ${JSON.stringify(kakaoAccessToken)}`);

      res.status(201).json({ accessToken: kakaoAccessToken });
    } catch (error) {
      throw new UnauthorizedException('카카오 로그인 실패하였습니다');
    }
  }

  @ApiOperation({ summary: '네이버 로그인' })
  @Post('/login/naver')
  async naverLogin(@Request() req, @Response() res): Promise<any> {
    try {
      const code: string = req.query.code;
      const state: string = req.query.state;
      console.log(code);
      console.log(state);
      if (!code || !state) {
        throw new BadRequestException('네이버 정보가 없습니다.');
      }

      const naverAccessToken = await this.authService.naverLogin(code, state);

      console.log(`naverUserInfo: ${JSON.stringify(naverAccessToken)}`);

      res.status(201).json({ accessToken: naverAccessToken });
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('네이버 로그인 실패하였습니다.');
    }
  }
}
