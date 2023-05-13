import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsService } from 'src/aws/aws.service';
import { UsersModule } from 'src/users/users.module';
import { DiaryController } from './controller/diary.controller';
import { Diary, diarySchema } from './diary.schema';
import { DiaryService } from './service/diary.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Diary.name, schema: diarySchema }]),
    UsersModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, AwsService],
})
export class DiaryModule {}
