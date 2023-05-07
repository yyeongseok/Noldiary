import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { Users, userSchema } from '../users/users.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';
import { jwtStrategy } from './jwt/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { Diary, diarySchema } from 'src/diary/diary.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([
      { name: Users.name, schema: userSchema },
      { name: Diary.name, schema: diarySchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, UsersRepository, jwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
