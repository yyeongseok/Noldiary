import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'dud@gmail.com',
    description: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  @Column()
  email: string;

  @Column()
  nick_name: string;

  @Column()
  social_id: number;

  @Column()
  social_status_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
