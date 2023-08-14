import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  Response,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { ApiOperation } from '@nestjs/swagger';
import { Model } from 'mongoose';
import { Token } from '../refreshtoken.schema';
import { AuthService } from '../service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @Post('/login/kakao')
  async kakaotoken(@Request() req, @Response() res): Promise<any> {
    try {
      const accesstoken = req.headers.authorization;
      if (!accesstoken) {
        throw new BadRequestException('카카오 정보가 없습니다.');
      }
      const kakaoAccessToken = await this.authService.kakaoLogin(accesstoken);

      console.log(`kakaoUserInfo: ${JSON.stringify(kakaoAccessToken)}`);

      res.status(201).json({ accessToken: kakaoAccessToken, expiresIn: 3600 });
    } catch (error) {
      throw new UnauthorizedException(error.message);
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

  @ApiOperation({ summary: '리프레쉬 토큰' })
  @Post('/refresh')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    const dbToken = await this.tokenModel.findOne({ refreshToken });

    if (!dbToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const payload = { email: dbToken.email };
    const newAccessToken = this.jwtService.sign(payload, {
      expiresIn: '1h',
    });

    return { accessToken: newAccessToken };
  }
}
