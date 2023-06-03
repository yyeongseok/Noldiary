import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../users.schema';

export class readonlyUsersDto extends PickType(Users, [
  'email',
  'nickname',
  'profileImage',
] as const) {
  @ApiProperty({
    example: 'test@email.com',
    description: 'email',
  })
  email: string;
  @ApiProperty({
    example: 'User 이름',
    description: 'User 이름',
  })
  nickname: string;
  @ApiProperty({
    example: 'imageUrl',
    description: 'imageUrl',
  })
  profileImage: string;
}
