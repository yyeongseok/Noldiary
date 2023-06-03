import { ApiProperty, PickType } from '@nestjs/swagger';
import { Diary } from '../diary.schema';

export class diaryCreateDto extends PickType(Diary, [
  'title',
  'departure',
  'destination',
  'departureDate',
  'arrivalDate',
  'thumbnailImageUrl',
  'contents',
  //'invitedemail',
] as const) {
  @ApiProperty({
    example: '제목',
    description: '제목',
  })
  title: string;
  @ApiProperty({
    example: '출발장소',
    description: '출발장소',
  })
  departure: string;
  @ApiProperty({
    example: '도착장소',
    description: '도착장소',
  })
  destination: string;
  @ApiProperty({
    example: '출발날짜',
    description: '출발날짜',
  })
  departureDate: Date;
  @ApiProperty({
    example: '도착날짜',
    description: '도착날짜',
  })
  arrivalDate: Date;
  @ApiProperty({
    example: '썸네일 이미지',
    description: '썸네일 이미지',
  })
  thumbnailImageUrl: string;
  @ApiProperty({
    example: '내용 컨텐츠',
    description: '내용 컨텐츠',
  })
  contents: string;
}
