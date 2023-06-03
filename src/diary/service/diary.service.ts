import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersRepository } from 'src/users/users.repository';
import { Diary } from '../diary.schema';
import { diaryCreateDto } from '../dto/diary.create.dto';
import { diaryUpdateDto } from '../dto/diary.update.dto';

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
        contents,
        //thumbnailImageUrl,
        departure,
        destination,
        departureDate,
        arrivalDate,
        //invitedemail,
      } = diaryData;

      const newDiary = new this.diaryModel({
        author: validateAuthor.email,
        title,
        contents,
        //thumbnailImageUrl,
        departure,
        destination,
        departureDate,
        arrivalDate,
        //invitedemail,
      });
      return await newDiary.save();
    } catch (error) {
      console.log(error.message);
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

  async updateDiary(
    _id: string,
    diaryUpdateData: diaryUpdateDto,
    User: string,
  ) {
    try {
      const findDiary = await this.diaryModel.findById(_id);

      if (findDiary.author === User || findDiary.invitedemail === User) {
        const updateDiary = await this.diaryModel.findByIdAndUpdate(
          _id,
          diaryUpdateData,
        );
        return updateDiary;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteDiary(_id: string) {
    try {
      console.log(_id);
      const result = await this.diaryModel.deleteOne({ _id });

      console.log(result);

      if (result.deletedCount !== 1) {
        throw new BadRequestException(`해당 일기 ${_id}를 찾을수 없습니다.`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
