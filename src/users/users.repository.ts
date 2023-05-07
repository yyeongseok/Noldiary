import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Diary } from 'src/diary/diary.schema';
import { usersRequestDto } from './dto/users.request.dto';
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
}

// const result = await this.catModel
//       .find()
//       .populate({ path: 'comments', model: this.commentsModel });
//     // populate 다른 document랑 이어주는 역활을 한다.
//     return result;
