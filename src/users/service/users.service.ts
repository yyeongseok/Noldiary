import { HttpException, Injectable } from '@nestjs/common';
import { usersRequestDto } from '../dto/users.request.dto';
import { UsersRepository } from '../users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
}
// async signUp(body: usersRequestDto) {
//   const { email, nickname, profileImage, socialId } = body;
//   const isUserExist = await this.UserModel.exists({ email });

//   if (isUserExist) {
//     throw new HttpException('해당 유저는 이미 존재합니다', 403);
//   }

//   const user = await this.UserModel.create({
//     email,
//     nickname,
//     profileImage,
//     socialId,
//   });

//   return user.readOnlyData;
