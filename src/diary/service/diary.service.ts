import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
        thumbnailImage,
        departure,
        destination,
        departureDate,
        arrivalDate,
        //invitedemail,
        bookmark,
        isPublic,
      } = diaryData;

      const newDiary = new this.diaryModel({
        author: validateAuthor.email,
        title,
        contents,
        thumbnailImage,
        departure,
        destination,
        departureDate,
        arrivalDate,
        //invitedemail,
        bookmark,
        isPublic,
      });
      return await newDiary.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getDiary(User: string) {
    try {
      const validateUser = await this.usersRepository.getUserAndDiary(User);
      const author = validateUser.email;

      if (!author) {
        throw new UnauthorizedException('잘못된 접근입니다');
      }
      const getDiary = await this.diaryModel.find({ author }, { updatedAt: 0 });

      return getDiary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDiaryById(_id: string) {
    try {
      console.log(_id);
      const getDiary = await this.diaryModel.findById(
        { _id },
        { updatedAt: 0 },
      );

      return getDiary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDiaryByKeyword(User: string, keyword: string) {
    try {
      const validateUser = await this.usersRepository.getUserAndDiary(User);
      const author = validateUser.email;

      const regex = new RegExp(keyword, 'i');

      const find = await this.diaryModel.find({
        author,
        $or: [{ title: regex }, { contents: regex }],
      });

      return find;
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

      if (findDiary.author === User) {
        const updateDiary = await this.diaryModel.findByIdAndUpdate(
          _id,
          diaryUpdateData,
        );
        return updateDiary;
      } else {
        throw new UnauthorizedException('접근 권한이 없습니다');
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

  async bookMarkUpdate(_id: string) {
    try {
      const findDiary = await this.diaryModel.findById(_id);
      console.log(findDiary);

      if (!findDiary) {
        throw new BadRequestException(`해당 일기${_id}를 찾을 수 없습니다.`);
      }
      if (findDiary.bookmark === true) {
        findDiary.bookmark = false;
      } else if (findDiary.bookmark === false) {
        findDiary.bookmark = true;
      }

      return await findDiary.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async isPublicUpdate(_id: string) {
    try {
      const findDiary = await this.diaryModel.findById(_id);
      console.log(findDiary);

      if (!findDiary) {
        throw new BadRequestException(`해당 일기${_id}를 찾을 수 없습니다.`);
      }
      if (findDiary.isPublic === true) {
        findDiary.isPublic = false;
      } else if (findDiary.isPublic === false) {
        findDiary.isPublic = true;
      }

      return await findDiary.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }
  // async inviteEmail(_id: string, email: string) {
  //   try {
  //     const inviteEmail = await this.diaryModel.findById(_id);
  //     inviteEmail.invitedemail = email;

  //     return await inviteEmail.save();
  //   } catch (error) {
  //     throw new BadRequestException(error.message);
  //   }
  // }
}
