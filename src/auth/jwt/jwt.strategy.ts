import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from 'src/users/users.repository';
import { payload } from './jwt.payload';

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }

  async validate(payload: payload) {
    const user = await this.usersRepository.findUserBySocialId(
      payload.socialId,
    );

    if (user) {
      return user; //request.user
    } else {
      throw new UnauthorizedException('접근 오류');
    }
  }
}
