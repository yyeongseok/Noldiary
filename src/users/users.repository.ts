import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diary } from 'src/diary/diary.schema';
import { usersRequestDto } from './dto/users.request.dto';
import { usersUpdateDto } from './dto/users.update.dto';
import { Users } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(Users.name) private readonly UserModel: Model<Users>,
    @InjectModel(Diary.name) private readonly DiaryModel: Model<Diary>,
  ) {}

  async existsByEmail(email: string): Promise<boolean> {
    const result = await this.UserModel.exists({ email });
    if (result) {
      return true;
    } else {
      return false;
    }
  }

  async create(user: usersRequestDto): Promise<Users> {
    return await this.UserModel.create(user);
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    const user = await this.UserModel.findOne({ email });
    return user;
  }

  async findUserBySocialId(socialId: string): Promise<Users | null> {
    const user = await this.UserModel.findOne({ socialId });
    return user;
  }

  async getUserAndDiary(email: string) {
    const result = await this.UserModel.findOne({ email }).populate({
      path: 'diary',
      model: this.DiaryModel,
    });
    return result;
  }
  async findUserByEmailAndUpdateImg(email: string, filename: string) {
    const user = await this.UserModel.findOne({ email });
    user.profileImage = filename;
    const newUser = await user.save();
    console.log(newUser);
    return newUser.readonlyData;
  }
  async findUserByEmailAndUpdateInfo(
    email: string,
    updateData: usersUpdateDto,
  ) {
    try {
      const user = await this.UserModel.findOne({ email });
      if (!user) {
        throw new NotFoundException('유저가 없습니다');
      }
      const { nickname, profileImage, backgroundImage, message } = updateData;

      user.nickname = nickname || user.nickname;
      user.profileImage = profileImage || user.profileImage;
      user.backgroundImage = backgroundImage || user.backgroundImage;
      user.message = message || user.message;

      const updateUser = await user.save();

      return updateUser;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
