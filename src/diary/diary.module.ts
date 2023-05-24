import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AwsService } from 'src/aws/aws.service';
import { S3Service } from 'src/s3/s3.service';
import { UsersModule } from 'src/users/users.module';
import { DiaryController } from './controller/diary.controller';
import { Diary, diarySchema } from './diary.schema';
import { DiaryService } from './service/diary.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Diary.name, schema: diarySchema }]),
    UsersModule,
  ],
  controllers: [DiaryController],
  providers: [DiaryService, AwsService, S3Service],
})
export class DiaryModule {}
