import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}
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

    if (responseUserInfo.status === 200) {
      const email = responseUserInfo.data.kakao_account.email;
      const nickname = responseUserInfo.data.properties.nickname;
      const profileImage = responseUserInfo.data.properties.profile_image;
      const socialId = responseUserInfo.data.id;
      const socialOption = 'kakao';
      const kakaoUser = {
        email,
        nickname,
        profileImage,
        socialId,
        socialOption,
      };
      let token = '';
      const payload = { email: email, socialId: socialId };

      const user = await this.usersRepository.existsByEmail(email);
      if (!user) {
        await this.usersRepository.create(kakaoUser);
        token = this.jwtService.sign(payload);
      } else {
        const info = await this.usersRepository.findUserByEmail(email);
        const jwtPayload = {
          email: info.email,
          socialId: info.socialId,
          userId: info.id,
        };
        token = this.jwtService.sign(jwtPayload);
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
        const nickname = getNaverUserInfo.data.response.name;
        const profileImage = getNaverUserInfo.data.response.profile_image;
        const socialId = getNaverUserInfo.data.response.id;
        const socialOption = 'NAVER';
        const naverUser = {
          email,
          nickname,
          profileImage,
          socialId,
          socialOption,
        };
        let token = '';
        const payload = { email: email, socialId: socialId };

        const user = await this.usersRepository.existsByEmail(email);
        if (!user) {
          await this.usersRepository.create(naverUser);
          token = this.jwtService.sign(payload);
        } else {
          const info = await this.usersRepository.findUserByEmail(email);
          const jwtPayload = {
            email: info.email,
            socialId: info.socialId,
            userId: info.id,
          };
          token = this.jwtService.sign(jwtPayload);
        }
        return token;
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('네이버 로그인 실패');
    }
  }
}
