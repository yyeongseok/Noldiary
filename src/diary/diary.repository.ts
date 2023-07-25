import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Users } from 'src/users/users.schema';
import { Diary } from './diary.schema';
import { diaryCreateDto } from './dto/diary.create.dto';
import { diaryUpdateDto } from './dto/diary.update.dto';

@Injectable()
export class DiaryRepository {
  constructor(
    @InjectModel(Users.name) private readonly UserModel: Model<Users>,
    @InjectModel(Diary.name) private readonly DiaryModel: Model<Diary>,
  ) {}

  async getDiaryByEmail(author: string) {
    return await this.DiaryModel.find({ author });
  }

  async getDiaryById(_id: string) {
    return await this.DiaryModel.findById(_id);
  }

  async updateDiary(_id: string, diaryUpdateData: diaryUpdateDto) {
    return await this.DiaryModel.findByIdAndUpdate(_id, diaryUpdateData);
  }

  async create(newDiary: diaryCreateDto) {
    return await this.DiaryModel.create(newDiary);
  }
}
