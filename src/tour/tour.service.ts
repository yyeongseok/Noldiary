import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TourService {
  constructor(private readonly configService: ConfigService) {}

  async getInfoTourApi(keyword: string) {
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
    const arr = searchData.item;
    const search = arr.map(({ title, firstimage, contentid }) => ({
      title,
      firstimage,
      contentid,
    }));
    return search;
  }
  async getDetailCommonInfo(contentId: number) {
    //console.log(contentId);
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
    const arr = commonData.item;
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
  }
  async getDetailIntroInfo(contentId: number) {
    const introductionInfo = await axios.get(
      'http://apis.data.go.kr/B551011/KorService1/detailIntro1?',
      {
        params: {
          serviceKey: this.configService.get('TOUR_SECRET_KEY'),
          contentId: contentId,
          contentTypeId: 12,
          MobileApp: 'APPTETS',
          MobileOS: 'ETC',
          _type: 'json',
        },
      },
    );
    const { data } = introductionInfo;
    const introductionData = data.response.body.items;
    const arr = introductionData.item;
    const introduction = arr.map(({ distance, taketime, parking }) => ({
      distance,
      taketime,
      parking,
    }));
    return introduction;
  }
  //   async getDetailCourseInfo(contentId: number) {
  //     const courseInfo = await axios.get(
  //       'http://apis.data.go.kr/B551011/KorService1/detailInfo1',
  //       {
  //         params: {
  //           serviceKey: this.configService.get('TOUR_SECRET_KEY'),
  //           contentId: contentId,
  //           contentTypeId: 12,
  //           MobileApp: 'APPTETS',
  //           MobileOS: 'ETC',
  //           _type: 'json',
  //         },
  //       },
  //     );
  //     const { data } = courseInfo;
  //     const courseData = data.response.body.items;
  //     const arr = courseData.item;
  //     const course = arr.map(
  //       ({ subnum, subname, subdetailoverview, subdetailimg }) => ({
  //         subnum,
  //         subname,
  //         subdetailoverview,
  //         subdetailimg,
  //       }),
  //     );
  //     return course;
  //   }
  async getMainInfo(cat2Id: string, pageNum: number) {
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
    // const numOfRows = data.response.body.numOfRows;
    // const pageNo = data.response.body.pageNo;
    const totalCount = data.response.body.totalCount;

    // const mainPageInfo = { numOfRows, pageNo, totalCount };
    return { content, totalCount };
  }
  async getInfoByCategory(
    contentTypeId: number,
    cat3Id: string,
    pageNum: number,
  ) {
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
    const arr = one.item;
    const content = arr.map(({ title, contentid, firstimage }) => ({
      title,
      contentid,
      firstimage,
    }));
    return content;
  }
}
