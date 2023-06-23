import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../users.schema';

export class usersUpdateDto extends PickType(Users, [
  'nickname',
  'profileImage',
  'backgroundImage',
] as const) {
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
  @ApiProperty({
    example: 'imageUrl',
    description: 'imageUrl',
  })
  backgroundImage: string;
}
