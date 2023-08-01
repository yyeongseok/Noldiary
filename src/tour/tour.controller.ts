/* eslint-disable prettier/prettier */
import { Controller, Get, Param, Query, Response } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TourService } from './tour.service';

@Controller('tour')
export class TourController {
  constructor(private readonly tourService: TourService) {}

  @ApiOperation({ summary: '여행지 정보 가져오기' })
  @Get('/search')
  async findinfo(@Query('keyword') keyword: string, @Response() res: any) {
    const content = await this.tourService.getInfoSearchTourApi(keyword);

    res.status(200).json({ content });
  }

  @ApiOperation({ summary: '여행지 추천 코스' })
  @Get('/main/:cat2Id/:pageNo')
  async mainInfo(
    @Param('cat2Id') cat2Id: string,
    @Param('pageNo') pageNo: number,
    @Response() res: any,
  ) {
    const content = await this.tourService.getCourseInfo(cat2Id, pageNo);
    res.status(200).json({ ...content });
  }

  @ApiOperation({ summary: '여행지 디테일' })
  @Get('/main/detail/:contentTypeId/:contentId')
  async detailInfo(
    @Param('contentTypeId') contentTypeId: number,
    @Param('contentId') contentId: number,
    @Response() res: any,
  ) {
    try {
      const common = await this.tourService.getDetailCommonInfo(contentId);

      const introduction = await this.tourService.getDetailIntroInfo(contentId,contentTypeId);
      
      const course = await this.tourService.getDetailCourseInfo(contentId,contentTypeId,);
      
      const routine = await this.tourService.getDetailInfo(contentId,contentTypeId,);
      
      const image = await this.tourService.getDetailImage(contentId);
      if (contentTypeId === 25) {
        const detailInfo = { common, introduction, course };
        return res.status(200).json({ ...detailInfo });
      } else {
        const detailInfo = { common, introduction, routine, image };
        return res.status(200).json({ ...detailInfo });
      }
    } catch (error) {
      console.log(error);
    }
  }
  @ApiOperation({ summary: '소분류별 여행지 조회' })
  @Get('/category/:cat3Id/:pageNum')
  async mainCategory(
    @Param('cat3Id') cat3Id: string,
    @Param('pageNum') pageNum: number,
    @Response() res: any,
  ) {
    const content = await this.tourService.getInfoByCategory(cat3Id, pageNum);
    res.status(200).json({ content });
  }
}
