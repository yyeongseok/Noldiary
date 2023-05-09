import { HttpException, Injectable } from '@nestjs/common';
import { usersRequestDto } from '../dto/users.request.dto';
import { UsersRepository } from '../users.repository';
import { Users } from '../users.schema';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
}
