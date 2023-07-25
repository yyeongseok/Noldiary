import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TourController } from './tour.controller';
import { TourService } from './tour.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [TourController],
  providers: [TourService],
})
export class TourModule {}
