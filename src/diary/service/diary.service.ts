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
      const getDiary = await this.diaryModel
        .find({ author }, { updatedAt: 0 })
        .sort({ createdAt: -1 });

      return getDiary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDiaryById(_id: string) {
    try {
      const getDiary = await this.diaryModel.findById(
        { _id },
        { updatedAt: 0 },
      );

      return getDiary;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getDiaryByKeyword(User: string, keyword: string, filter: string) {
    try {
      const validateUser = await this.usersRepository.getUserAndDiary(User);
      const author = validateUser.email;
      const regex = new RegExp(keyword, 'i');
      const findKeyword = {
        author,
        $or: [{ title: regex }, { contents: regex }],
      };
      const bookmark = { bookmark: true };

      if (filter === 'latest') {
        const find = await this.diaryModel
          .find(findKeyword)
          .sort({ createdAt: -1 });
        return find;
      } else if (filter === 'oldest') {
        const find = await this.diaryModel
          .find(findKeyword)
          .sort({ createdAt: 1 });
        return find;
      } else if (filter === 'bookmark') {
        const find = await this.diaryModel
          .find({ $and: [findKeyword, bookmark] })
          .sort({ createdAt: -1 });
        return find;
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateDiary(
    _id: string,
    diaryUpdateData: Partial<diaryUpdateDto>,
    User: string,
  ) {
    try {
      const diary = await this.diaryModel.findById(_id);

      if (diary.author === User) {
        const {
          title,
          departure,
          destination,
          departureDate,
          arrivalDate,
          thumbnailImage,
          contents,
          bookmark,
          isPublic,
        } = diaryUpdateData;
        diary.title = title || diary.title;
        diary.departure = departure || diary.departure;
        diary.destination = destination || diary.destination;
        diary.departureDate = departureDate || diary.departureDate;
        diary.arrivalDate = arrivalDate || diary.arrivalDate;
        diary.thumbnailImage = thumbnailImage || diary.thumbnailImage;
        diary.contents = contents || diary.contents;
        if (bookmark !== undefined) diary.bookmark = bookmark;
        if (isPublic !== undefined) diary.isPublic = isPublic;

        const updateDiary = await diary.save();

        const updatedDiary = await this.diaryModel.findById(_id);
        console.log(updatedDiary);
        return updatedDiary;
      } else {
        throw new UnauthorizedException('접근 권한이 없습니다');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteDiary(_id: string) {
    try {
      const result = await this.diaryModel.deleteOne({ _id });

      if (result.deletedCount !== 1) {
        throw new BadRequestException(`해당 일기 ${_id}를 찾을수 없습니다.`);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async bookMarkUpdate(_id: string, User: string) {
    try {
      const validateUser = await this.usersRepository.getUserAndDiary(User);
      if (!validateUser) {
        throw new UnauthorizedException('접근 권한이 없습니다');
      }
      const findDiary = await this.diaryModel.findById(_id);
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
      throw new BadRequestException(error.message);
    }
  }

  async isPublicUpdate(_id: string, User: string) {
    try {
      const validateUser = await this.usersRepository.getUserAndDiary(User);
      if (!validateUser) {
        throw new UnauthorizedException('접근 권한이 없습니다');
      }
      const findDiary = await this.diaryModel.findById(_id);
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
