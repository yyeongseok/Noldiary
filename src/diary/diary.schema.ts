import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { Document, Types } from 'mongoose';
import { Users } from 'src/users/users.schema';

const options: SchemaOptions = {
  collection: 'diary',
  timestamps: true,
  versionKey: false,
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
  title: string;

  @Prop({
    required: true,
  })
  @IsString()
  contents: string;

  @Prop({
    required: true,
  })
  @IsString()
  thumbnailImage: string;

  @Prop({
    required: true,
  })
  @IsBoolean()
  isPublic: boolean;

  @Prop({
    required: true,
  })
  @IsString()
  departure: string;

  @Prop({
    required: true,
  })
  @IsString()
  destination: string;

  @Prop({
    required: true,
  })
  @IsString()
  departureDate: string;

  @Prop({
    required: true,
  })
  @IsString()
  arrivalDate: string;

  @Prop({
    required: true,
  })
  @IsBoolean()
  bookmark: boolean;

  // @Prop({
  //   required: false,
  // })
  // @IsString()
  // invitedemail: string;

  readonly readonlyData: {
    author: string;
    title: string;
    content: string;
    thumbnailImage: string;
    isPublic: boolean;
    departure: string;
    destination: string;
    departureDate: Date;
    arrivalDate: Date;
    bookmark: boolean;
    //invitedemail: string;
  };
}

export const diarySchema = SchemaFactory.createForClass(Diary);

diarySchema.virtual('readonlyData').get(function (this: Diary) {
  return {
    author: this.author,
    title: this.title,
    content: this.contents,
    thumbnailImage: this.thumbnailImage,
    public: this.isPublic,
    departure: this.departure,
    destination: this.destination,
    departureDate: this.departureDate,
    arrivalDate: this.arrivalDate,
    bookmark: this.bookmark,
    //invitedemail: this.invitedemail,
  };
});
