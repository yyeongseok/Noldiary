import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import axios from 'axios';
import qs from 'qs';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async OAuthLogin(options: { code: string; domain: string }): Promise<any> {
    const { code, domain } = options;
    const kakaoKey = process.env.KAKAO_CLIENT_ID;
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    console.log(kakaoTokenUrl);
    const body = {
      grant_type: 'authorization_code',
      client_id: kakaoKey,
      redirect_uri: `${domain}/kakao-callback`,
      code,
    };

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response = await axios({
        method: 'POST',
        url: kakaoTokenUrl,
        timeout: 30000,
        headers,
        data: qs.stringify(body),
      });

      if (response.status === 200) {
        console.log(`kakaoToken : ${JSON.stringify(response.data)}`);

        // Token 을 가져왔을 경우 사용자 정보 조회
        const headerUserInfo = {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
          Authorization: 'Bearer ' + response.data.access_token,
        };
        console.log(`url : ${kakaoTokenUrl}`);
        console.log(`headers : ${JSON.stringify(headerUserInfo)}`);

        const responseUserInfo = await axios({
          method: 'GET',
          url: kakaoUserInfoUrl,
          timeout: 30000,
          headers: headerUserInfo,
        });

        console.log(`responseUserInfo.status : ${responseUserInfo.status}`);

        if (responseUserInfo.status === 200) {
          console.log(
            `kakaoUserInfo : ${JSON.stringify(responseUserInfo.data)}`,
          );
          //const { result } = responseUserInfo;
          const email = responseUserInfo.data.email;
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
          const payload = { email: email, sub: socialId };

          const user = await this.usersRepository.existsByEmail(email);
          if (!user) {
            await this.usersRepository.create(kakaoUser);
          } else {
            const info = await this.usersRepository.findUserByEmail(email);
            const jwtPayload = { email: info.email, sub: info.socialId };
            this.jwtService.sign(jwtPayload);
          }
          return {
            token: this.jwtService.sign(payload),
          };
        } else {
          throw new UnauthorizedException();
        }
      } else {
        throw new UnauthorizedException();
      }
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
  }
}
