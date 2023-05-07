import { PickType } from '@nestjs/swagger';
import { Diary } from '../diary.schema';

export class diaryCreateDto extends PickType(Diary, [
  'title',
  'content',
  'thumbnailImageUrl',
] as const) {}
