import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { UsersRepository } from 'src/users/users.repository';
import { Token } from '../refreshtoken.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
  ) {}

  async generateRefreshToken(email: string): Promise<string> {
    const refreshToken = this.jwtService.sign({}, { expiresIn: '1d' });

    const tokenDoc = new this.tokenModel({
      email,
      refreshToken,
    });

    await tokenDoc.save();
    return refreshToken;
  }

  async kakaoLogin(accesstoken: string) {
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    const headerUserInfo = {
      Authorization: `Bearer ${accesstoken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    const responseUserInfo = await axios({
      method: 'GET',
      url: kakaoUserInfoUrl,
      headers: headerUserInfo,
    });
    //console.log('-=-=-=-=-=-=-=-=-=-=-=-=-', responseUserInfo);

    if (responseUserInfo.status === 200) {
      const email = responseUserInfo.data.kakao_account.email;
      const name = responseUserInfo.data.properties.nickname;
      const profileImage = responseUserInfo.data.properties.profile_image;
      const socialId = responseUserInfo.data.id;
      const socialOption = 'kakao';
      const message = '';
      const backgroundImage = '';
      const nickname = '';
      const kakaoUser = {
        email,
        name,
        profileImage,
        socialId,
        socialOption,
        message,
        backgroundImage,
        nickname,
      };
      let token = '';
      //let refreshToken = '';
      const payload = { email: email, socialId: socialId };
      console.log('============', payload);

      const user = await this.usersRepository.existsByEmail(email);
      if (!user) {
        await this.usersRepository.create(kakaoUser);
        token = this.jwtService.sign(payload, { expiresIn: '1h' });
        //console.log('++++++++++++++++++++++++++++++', token);
        //console.log('-=-=-=-=-=-=-=-====================', email);
        //refreshToken = await this.generateRefreshToken(email);
      } else {
        const info = await this.usersRepository.findUserByEmail(email);
        const jwtPayload = {
          email: info.email,
          socialId: info.socialId,
          userId: info.id,
        };
        token = this.jwtService.sign(jwtPayload, { expiresIn: '1h' });
        //refreshToken = await this.generateRefreshToken(email);
      }
      return token;
    }
  }

  async naverLogin(code: string, state: string): Promise<any> {
    const naverTokenUrl = 'https://nid.naver.com/oauth2.0/token';
    const naverClientKey = process.env.NAVER_CLIENT_ID;
    const naverSecretKey = process.env.NAVER_CLIENT_SECRET;
    const naverUserInfoUrl = 'https://openapi.naver.com/v1/nid/me';

    try {
      const naverAccessToken = await axios.get(naverTokenUrl, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        params: {
          grant_type: 'authorization_code',
          client_id: naverClientKey,
          client_secret: naverSecretKey,
          code: code,
          state: state,
        },
      });
      console.log('accessToken', naverAccessToken.data.access_token);
      if (naverAccessToken.status === 200) {
        const getNaverUserInfo = await axios.get(naverUserInfoUrl, {
          headers: {
            Authorization: `Bearer ${naverAccessToken.data.access_token}`,
          },
        });
        const email = getNaverUserInfo.data.response.email;
        const name = getNaverUserInfo.data.response.name;
        const profileImage = getNaverUserInfo.data.response.profile_image;
        const socialId = getNaverUserInfo.data.response.id;
        const socialOption = 'NAVER';
        const message = '';
        const backgroundImage = '';
        const nickname = '';
        const naverUser = {
          email,
          name,
          profileImage,
          socialId,
          socialOption,
          message,
          backgroundImage,
          nickname,
        };
        let token = '';
        const payload = { email: email, socialId: socialId };

        const user = await this.usersRepository.existsByEmail(email);
        if (!user) {
          await this.usersRepository.create(naverUser);
          token = this.jwtService.sign(payload, { expiresIn: '1h' });
        } else {
          const info = await this.usersRepository.findUserByEmail(email);
          const jwtPayload = {
            email: info.email,
            socialId: info.socialId,
            userId: info.id,
          };
          token = this.jwtService.sign(jwtPayload, { expiresIn: '1h' });
        }
        return token;
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('네이버 로그인 실패');
    }
  }
}
