import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
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
  contents: string;

  @Prop({
    required: false,
  })
  //@IsString()
  //@IsNotEmpty()
  thumbnailImageUrl: string;

  @Prop({
    default: false,
  })
  @IsBoolean()
  @IsNotEmpty()
  public: boolean;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departure: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  destination: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  departureDate: Date;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  arrivalDate: Date;

  @Prop({
    default: false,
  })
  @IsBoolean()
  bookmark: boolean;

  @Prop({
    required: false,
  })
  @IsString()
  invitedemail: string;

  readonly readonlyData: {
    author: string;
    title: string;
    content: string;
    thumbnailImageUrl: string;
    public: boolean;
    departure: string;
    destination: string;
    departureDate: Date;
    arrivalDate: Date;
    bookmark: boolean;
    invitedemail: string;
  };
}

export const diarySchema = SchemaFactory.createForClass(Diary);

diarySchema.virtual('readonlyData').get(function (this: Diary) {
  return {
    author: this.author,
    title: this.title,
    content: this.contents,
    thumbnailImageUrl: this.thumbnailImageUrl,
    public: this.public,
    departure: this.departure,
    destination: this.destination,
    departureDate: this.departureDate,
    arrivalDate: this.arrivalDate,
    bookmark: this.bookmark,
    invitedemail: this.invitedemail,
  };
});
