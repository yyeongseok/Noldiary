import { ApiProperty, PickType } from '@nestjs/swagger';
import { Diary } from '../diary.schema';

export class diaryResponseDto extends PickType(Diary, [
  'author',
  'title',
  'departure',
  'destination',
  'departureDate',
  'arrivalDate',
  'thumbnailImageUrl',
  'contents',
  'public',
  'bookmark',
  //'invitedemail',
] as const) {
  @ApiProperty({
    example: '글쓴이',
    description: '글쓴이',
  })
  author: string;
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
  @ApiProperty({
    example: '다이어리 공개or비공개',
    description: '다이어리 공개or비공개',
  })
  public: boolean;
  @ApiProperty({
    example: '다이어리 관심',
    description: '다이어리 관심',
  })
  bookmark: boolean;
}
