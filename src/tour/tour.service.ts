import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TourService {
  constructor(private readonly configService: ConfigService) {}
  async getInfoTourApi(keyword: string) {
    try {
      const result = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/searchKeyword1',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            pageNo: 1,
            numOfRows: 10,
            contentTypeId: 25,
            _type: 'json',
            keyword: keyword,
            listYN: 'Y',
            arrange: 'A',
          },
        },
      );
      const { data } = result;
      const searchData = data.response.body.items;
      const arr: Array<any> = searchData.item;
      const search = arr.map(({ title, firstimage, contentid }) => ({
        title,
        firstimage,
        contentid,
      }));
      return search;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getDetailCommonInfo(contentId: number) {
    try {
      const commonInfo = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/detailCommon1',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            contentId: contentId,
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            _type: 'json',
            pageNo: 1,
            defaultYN: 'Y',
            firstImageYN: 'Y',
            areacodeYN: 'Y',
            catcodeYN: 'Y',
            addrinfoYN: 'Y',
            mapinfoYN: 'Y',
            overviewYN: 'Y',
          },
        },
      );
      const { data } = commonInfo;
      const commonData = data.response.body.items;
      if (commonData === '') return [];
      const arr: Array<any> = commonData.item;
      const common = arr.map(
        ({ title, firstimage, overview, contentid, mapx, mapy }) => ({
          title,
          firstimage,
          overview,
          contentid,
          mapx,
          mapy,
        }),
      );
      return common;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getDetailIntroInfo(contentId: number, contentTypeId: number) {
    try {
      const introductionInfo = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/detailIntro1?',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            contentId: contentId,
            contentTypeId: contentTypeId,
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            _type: 'json',
          },
        },
      );
      const { data } = introductionInfo;
      const introductionData = data.response.body.items;
      if (introductionData === '') return [];
      const arr = introductionData.item[0];
      const introduction = Object.entries(arr).map(([infoTitle, infoText]) => ({
        infoTitle,
        infoText,
      }));
      return introduction;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getDetailCourseInfo(contentId: number, contentTypeId: number) {
    try {
      const courseInfo = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/detailInfo1',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            contentId: contentId,
            contentTypeId: contentTypeId,
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            _type: 'json',
          },
        },
      );
      const { data } = courseInfo;
      const courseData = data.response.body.items;
      if (courseData === '') return [];
      const arr: Array<any> = courseData.item;
      const course = arr.map(
        ({ subnum, subname, subdetailoverview, subdetailimg }) => ({
          subnum,
          subname,
          subdetailoverview,
          subdetailimg,
        }),
      );
      return course;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getDetailInfo(contentId: number, contentTypeId: number) {
    try {
      const detailInfo = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/detailInfo1?',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            contentId: contentId,
            contentTypeId: contentTypeId,
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            _type: 'json',
          },
        },
      );
      const { data } = detailInfo;
      const detailData = data.response.body.items;
      const arr: Array<any> = detailData.item;
      const detail = arr.map(({ serialnum, infoname, infotext }) => ({
        serialnum,
        infoname,
        infotext,
      }));
      return detail;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getDetailImage(contentId: number) {
    try {
      const imageInfo = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/detailImage1?',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            contentId: contentId,
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            _type: 'json',
            imageYN: 'Y',
            subImageYN: 'Y',
            numOfRows: 12,
          },
        },
      );

      const { data } = imageInfo;
      const imageData = data.response.body.items;
      if (imageData === '') return [];
      const arr: Array<any> = imageData.item;
      const image = arr.map(({ contentid, originimgurl, imgname }) => ({
        contentid,
        originimgurl,
        imgname,
      }));
      return image;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getMainInfo(cat2Id: string, pageNum: number) {
    try {
      const result = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/areaBasedList1',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            pageNo: pageNum,
            numOfRows: 12,
            contentTypeId: 25,
            _type: 'json',
            listYN: 'Y',
            arrange: 'A',
            cat1: 'C01',
            cat2: cat2Id,
          },
        },
      );
      const { data } = result;
      const one = data.response.body.items;
      const itemArr: Array<any> = one.item;
      const content = itemArr.map(({ title, firstimage, contentid }) => ({
        title,
        firstimage,
        contentid,
      }));
      const totalCount = data.response.body.totalCount;

      return { content, totalCount };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getInfoByCategory(
    contentTypeId: number,
    cat3Id: string,
    pageNum: number,
  ) {
    try {
      const result = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/areaBasedList1',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            pageNo: pageNum,
            numOfRows: 12,
            contentTypeId: contentTypeId,
            _type: 'json',
            listYN: 'Y',
            arrange: 'A',
            cat1: cat3Id.slice(0, 3),
            cat2: cat3Id.slice(0, 5),
            cat3: cat3Id,
          },
        },
      );
      const { data } = result;
      const one = data.response.body.items;
      const arr: Array<any> = one.item;
      const content = arr.map(({ title, contentid, firstimage }) => ({
        title,
        contentid,
        firstimage,
      }));
      return content;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
