import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { Users } from 'src/users/users.schema';

const options: SchemaOptions = {
  collection: 'diary',
  timestamps: true,
};

@Schema(options)
export class Diary extends Document {
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
  author: Users['nickname'];

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  thumbnailImageUrl: string;

  readonly readonlyData: {
    author: string;
    title: string;
    content: string;
    thumbnailImageUrl: string;
  };
}

export const diarySchema = SchemaFactory.createForClass(Diary);

diarySchema.virtual('readonlyData').get(function (this: Diary) {
  return {
    author: this.author,
    title: this.title,
    content: this.content,
    thumbnailImageUrl: this.thumbnailImageUrl,
  };
});
