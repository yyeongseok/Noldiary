import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';
import { Diary } from 'src/diary/diary.schema';

const options: SchemaOptions = {
  collection: 'users',
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class Users extends Document {
  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  profileImage: string;

  @Prop({
    required: true,
    unique: true,
  })
  @IsNotEmpty()
  socialId: string;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  socialOption: string;

  @Prop({
    required: false,
    //default: 'test',
  })
  @IsString()
  message: string;

  @Prop({
    required: false,
    //default: 'test',
  })
  @IsString()
  backgroundImgUrl: string;

  @Prop({
    required: false,
  })
  @IsString()
  nickname: string;

  readonly readonlyData: {
    name: string;
    profileImage: string;
    message: string;
    backgroundImaUrl: string;
    nickname: string;
  };

  readonly diary: Diary[];
}

export const _userSchema = SchemaFactory.createForClass(Users);

_userSchema.virtual('readonlyData').get(function (this: Users) {
  return {
    name: this.name,
    profileImage: this.profileImage,
    message: this.message,
    backgroundImgUrl: this.backgroundImgUrl,
    nickname: this.nickname,
  };
});

_userSchema.virtual('diary', {
  ref: 'diary',
  localField: '_id',
  foreignField: 'info',
});
_userSchema.set('toObject', { virtuals: true });
_userSchema.set('toJSON', { virtuals: true });

export const userSchema = _userSchema;
