import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
  Response,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { log } from 'console';
import { TourService } from './tour.service';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @ApiOperation({ summary: '여행지 정보 가져오기' })
  @Get('/search')
  async findinfo(@Query('keyword') keyword: string, @Response() res: any) {
    const content = await this.tourService.getInfoTourApi(keyword);

    res.status(200).json({ content });
  }

  @ApiOperation({ summary: '여행지 추천 코스' })
  @Get('/main/:cat2Id/:pageNo')
  async mainInfo(
    @Param('cat2Id') cat2Id: string,
    @Param('pageNo') pageNo: number,
    @Response() res: any,
  ) {
    const content = await this.tourService.getMainInfo(cat2Id, pageNo);
    res.status(200).json({ ...content });
  }

  @ApiOperation({ summary: '여행지 디테일' })
  @Get('/main/:contentId')
  async detailInfo(
    @Param('contentId') contentId: number,
    @Response() res: any,
  ) {
    const common = await this.tourService.getDetailCommonInfo(contentId);
    const introduction = await this.tourService.getDetailIntroInfo(contentId);
    //const course = await this.tourService.getDetailCourseInfo(contentId);

    const detailInfo = { common, introduction }; //course };
    res.status(200).json({ detailInfo });
  }

  @ApiOperation({ summary: '소분류별 여행지 조회' })
  @Get('/category/:contentTypeId/:cat3Id/:pageNum')
  async maincategory(
    @Param('contentTypeId') contentTypeId: number,
    @Param('cat3Id') cat3Id: string,
    @Param('pageNum') pageNum: number,
    @Response() res: any,
  ) {
    const content = await this.tourService.getInfoByCategory(
      contentTypeId,
      cat3Id,
      pageNum,
    );
    res.status(200).json({ content });
  }
}
