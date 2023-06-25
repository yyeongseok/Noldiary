import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diary } from 'src/diary/diary.schema';
import { usersRequestDto } from '../dto/users.request.dto';
import { usersUpdateDto } from '../dto/users.update.dto';
import { UsersRepository } from '../users.repository';
import { Users } from '../users.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Diary.name) private readonly diaryModel: Model<Diary>,
    private readonly usersRepository: UsersRepository,
  ) {}

  async updateProfileImage(users: Users, file: Express.Multer.File) {
    const filename = `users/${file.filename}`;

    console.log(filename);

    const newUserProfile =
      await this.usersRepository.findUserByEmailAndUpdateImg(
        users.email,
        filename,
      );
    console.log(newUserProfile);
    return newUserProfile;
  }

  async getUser(User: string) {
    const getUser = await this.usersRepository.findUserByEmail(User);
    return getUser;
  }

  async getUserInfo(User: string) {
    const getUser = await this.usersRepository.findUserByEmail(User);
    const userResult = getUser.readonlyData;
    const author = getUser.email;
    const totalMyDiary = await this.diaryModel.countDocuments({ author });
    const totalSharedDiary = await this.diaryModel.countDocuments({
      author: author,
      isPublic: true,
    });
    return { ...userResult, totalMyDiary, totalSharedDiary };
  }

  async updateUserInfo(user: string, updateData: usersUpdateDto) {
    const newUserInfo = await this.usersRepository.findUserByEmailAndUpdateInfo(
      user,
      updateData,
    );

    return newUserInfo;
  }
}
