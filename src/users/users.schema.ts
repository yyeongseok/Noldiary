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
  nickname: string;

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

  readonly readonlyData: {
    id: string;
    nickname: string;
    email: string;
    profileImage: string;
    socialOption: string;
    diary: Diary;
  };

  readonly diary: Diary[];
}

export const _userSchema = SchemaFactory.createForClass(Users);

_userSchema.virtual('readonlyData').get(function (this: Users) {
  return {
    id: this.id,
    nickname: this.nickname,
    email: this.email,
    profileImage: this.profileImage,
    socialOption: this.socialOption,
    diary: this.diary,
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
