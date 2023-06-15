import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controller/users.controller';
import { Users, userSchema } from './users.schema';
import { UsersService } from './service/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from './users.repository';
import { Diary, diarySchema } from 'src/diary/diary.schema';
import { AwsService } from 'src/aws/aws.service';
import { DiaryModule } from 'src/diary/diary.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: userSchema },
      { name: Diary.name, schema: diarySchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AwsService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
