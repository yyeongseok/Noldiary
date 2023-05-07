import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
  providers: [DiaryService],
})
export class DiaryModule {}
