import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { Users, userSchema } from '../users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
//import { JwtKakaoStrategy } from './jwt/jwt.kakao.strategy';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';
import { jwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Users.name, schema: userSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt', session: false }),
    JwtModule.register({
      secret: process.env.KEY,
      signOptions: { expiresIn: '1day' },
    }),
  ],
  providers: [AuthService, JwtService, UsersRepository, jwtStrategy],
  controllers: [AuthController],
  exports: [JwtService],
})
export class AuthModule {}
