import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from '../users.schema';

export class readonlyUsersDto extends PickType(Users, [
  'email',
  'nickname',
  'profileImage',
] as const) {
  @ApiProperty({
    example: 'email@email.com',
    description: 'email',
  })
  email: string;
}
