import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class usersRequestDto {
  @IsString()
  @IsNotEmpty()
  nickname: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  profileImage: string;

  @IsNumber()
  @IsNotEmpty()
  socialId: string;
}
