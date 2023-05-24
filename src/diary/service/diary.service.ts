import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from 'src/users/users.repository';
import { Diary } from '../diary.schema';
import { diaryCreateDto } from '../dto/diary.create.dto';

@Injectable()
export class DiaryService {
  constructor(
    @InjectModel(Diary.name) private readonly diaryModel: Model<Diary>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createDiary(User: string, diaryData: diaryCreateDto) {
    try {
      const validateAuthor = await this.usersRepository.findUserByEmail(User);

      const {
        title,
        content,
        thumbnailImageUrl,
        departure,
        arrival,
        departureDate,
        arriveDate,
      } = diaryData;

      const newDiary = new this.diaryModel({
        author: validateAuthor.email,
        title,
        content,
        thumbnailImageUrl,
        departure,
        arrival,
        departureDate,
        arriveDate,
      });
      return await newDiary.save();
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDiary(User: string) {
    try {
      const validateUser = await this.usersRepository.getUserAndDiary(User);
      const author = validateUser.email;
      console.log(author);
      const getDiary = await this.diaryModel.find({ author });

      return getDiary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDiaryById(_id: string) {
    try {
      console.log(_id);
      const getDiary = await this.diaryModel.findOne({ _id });

      return getDiary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
