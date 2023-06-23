import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './controller/users.controller';
import { Users, userSchema } from './users.schema';
import { UsersService } from './service/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersRepository } from './users.repository';
import { Diary, diarySchema } from 'src/diary/diary.schema';
import { AwsService } from 'src/aws/aws.service';
import { DiaryModule } from 'src/diary/diary.module';
import { S3Service } from 'src/s3/s3.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: userSchema },
      { name: Diary.name, schema: diarySchema },
    ]),
    AuthModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, AwsService, S3Service],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
