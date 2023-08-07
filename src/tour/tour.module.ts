import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';
import { TourController } from './controller/tour.controller';
import { Tours, tourSchema } from './tour.schema';
import { TourService } from './service/tour.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forFeature([{ name: Tours.name, schema: tourSchema }]),
    UsersModule,
  ],
  controllers: [TourController],
  providers: [TourService],
})
export class TourModule {}
