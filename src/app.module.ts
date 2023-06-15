import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './common/logger/logger.middleware';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import * as Mongoose from 'mongoose';
import { HttpModule } from '@nestjs/axios';
import { DiaryModule } from './diary/diary.module';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { S3Service } from './s3/s3.service';
import { AwsService } from './aws/aws.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      //디비 연결하기 및 설정하기
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }),
    MulterModule.register({
      dest: './upload',
      storage: memoryStorage(),
    }),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    UsersModule,
    AuthModule,
    DiaryModule,
  ],
  controllers: [AppController],
  providers: [AppService, S3Service, AwsService],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev' ? true : false;

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    Mongoose.set('debug', this.isDev);
  }
}
