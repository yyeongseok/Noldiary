import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
//import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  collection: 'users',
  timestamps: true,
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
  @IsNumber()
  @IsNotEmpty()
  socialId: number;

  @Prop({
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  socialOption: string;

  readonly readOnlyData: {
    id: string;
    nickname: string;
    email: string;
    profileImage: string;
  };
}

export const userSchema = SchemaFactory.createForClass(Users);

userSchema.virtual('readOnlyData').get(function (this: Users) {
  return {
    id: this.id,
    nickname: this.nickname,
    email: this.email,
    profileImage: this.profileImage,
  };
});
