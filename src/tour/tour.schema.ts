import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { diarySchema } from 'src/diary/diary.schema';
import { Users } from 'src/users/users.schema';

const options: SchemaOptions = {
  collection: 'tours',
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class Tours extends Document {
  @ApiProperty({
    description: '작성한 유저 ID',
    required: true,
  })
  @Prop({
    type: Types.ObjectId,
    required: true,
    ref: 'users',
  })
  @IsNotEmpty()
  user: Users['nickname'];

  @ApiProperty({
    description: '즐겨찾기 contentTypeId',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  contenttypeid: string;

  @ApiProperty({
    description: '즐겨찾기 contentId',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNumber()
  contentid: number;

  @ApiProperty({
    description: '즐겨찾기 contentId',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: '즐겨찾기 mapx',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNumber()
  mapx: number;

  @ApiProperty({
    description: '즐겨찾기 mapy',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsNumber()
  mapy: number;

  @ApiProperty({
    description: '즐겨찾기 firstImage',
    required: true,
  })
  @Prop({
    required: true,
  })
  @IsString()
  firstimage: string;

  @ApiProperty({
    description: '즐겨찾기 addr1',
    required: true,
  })
  @Prop({
    required: false,
  })
  @IsString()
  addr1: string;

  readonly readonlyData: {
    user: string;
    contentTypeId: number;
    contentId: number;
    title: string;
    mapx: number;
    mapy: number;
    firstImage: string;
    addr1: string;
  };
}

export const tourSchema = SchemaFactory.createForClass(Tours);

diarySchema.virtual('readonlyData').get(function (this: Tours) {
  return {
    user: this.user,
    contenttypeid: this.contenttypeid,
    contentid: this.contentid,
    title: this.title,
    mapx: this.mapx,
    mapy: this.mapy,
    firstImage: this.firstimage,
    addr1: this.addr1,
  };
});
