import { ApiProperty, PickType } from '@nestjs/swagger';
import { Tours } from '../tour.schema';

export class tourFavoriteDto extends PickType(Tours, [
  'contenttypeid',
  'contentid',
  'title',
  'mapx',
  'mapy',
  'firstimage',
  'addr1',
] as const) {
  @ApiProperty({
    example: 12,
    description: '콘텐트타입아이디',
  })
  contenttypeid: number;

  @ApiProperty({
    example: 2561700,
    description: '콘텐트아이디',
  })
  contentid: number;

  @ApiProperty({
    example: '즐겨찾기 관광지 이름',
    description: '관광지 이름',
  })
  title: string;

  @ApiProperty({
    example: 1226.8287823667,
    description: '지도 x좌표값',
  })
  mapx: number;

  @ApiProperty({
    example: 35.1384854339,
    description: '지도 y좌표값',
  })
  mapy: number;

  @ApiProperty({
    example: 'imageFile',
    description: '대표이미지',
  })
  firstimage: string;

  @ApiProperty({
    example: '00시 00동',
    description: '주소',
  })
  addr1: string;
}
