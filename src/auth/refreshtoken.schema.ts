import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Document } from 'mongoose';

const options: SchemaOptions = {
  collection: 'users',
  timestamps: true,
  versionKey: false,
};

@Schema(options)
export class Token extends Document {
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
  refreshToken: string;

  readonly readonlyData: {
    email: string;
    token: string;
  };
}

export const tokenSchema = SchemaFactory.createForClass(Token);

tokenSchema.virtual('readonlyData').get(function (this: Token) {
  return {
    email: this.email,
    refreshToken: this.refreshToken,
  };
});
