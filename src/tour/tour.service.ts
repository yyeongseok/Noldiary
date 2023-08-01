import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TourService {
  constructor(private readonly configService: ConfigService) {}
  async getInfoSearchTourApi(keyword: string) {
    try {
      const result = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/searchKeyword1',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            pageNo: 1,
            numOfRows: 12,
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
      const search = arr.map(
        ({ title, firstimage, contentid, contentTypeId }) => ({
          title,
          firstimage,
          contentid,
          contentTypeId,
        }),
      );
      return search[0];
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
        // eslint-disable-next-line prettier/prettier
        ({ title, firstimage, overview, contentid, mapx, mapy, addr1, contenttypeid }) => ({
          title,
          firstimage,
          overview,
          contentid,
          mapx,
          mapy,
          addr1,
          contenttypeid,
        }),
      );
      return common[0];
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
      const arr: Array<any> = introductionData.item;
      if (contentTypeId === 25) {
        const introduction = arr.map(({ distance, taketime }) => ({
          distance,
          taketime,
        }));
        return introduction[0];
      } else if (contentTypeId === 12) {
        const introduction = arr.map(
          ({ infocenter, restdate, usetime, parking }) => ({
            infocenter,
            restdate,
            usetime,
            parking,
          }),
        );
        return introduction[0]; // contentTypeId === 12, contentid === 2472824
      } else if (contentTypeId === 14) {
        const introduction = arr.map(
          ({
            infocenterculture,
            restdateculture,
            usetimeculture,
            parkingculture,
          }) => ({
            infocenterculture,
            restdateculture,
            usetimeculture,
            parkingculture,
          }),
        );
        return introduction[0]; // contentTypeId === 14, contentid === 231975
      } else if (contentTypeId === 15) {
        const introduction = arr.map(
          ({
            sponsor1,
            sponsor1tel,
            eventstartdate,
            eventenddate,
            eventplace,
          }) => ({
            sponsor1,
            sponsor1tel,
            eventstartdate,
            eventenddate,
            eventplace,
          }),
        );
        return introduction[0]; // contentTypeId === 15, contentid === 2667017
      } else if (contentTypeId === 28) {
        const introduction = arr.map(
          ({
            infocenterleports,
            restdateleports,
            usetimeleports,
            parkingleports,
          }) => ({
            infocenterleports,
            restdateleports,
            usetimeleports,
            parkingleports,
          }),
        );
        return introduction[0]; // contentTypeId === 28, contentid === 2560413
      } else if (contentTypeId === 32) {
        const introduction = arr.map(
          ({
            infocenterlodging,
            accomcountlodging,
            parkinglodging,
            reservationlodging,
          }) => ({
            infocenterlodging,
            accomcountlodging,
            parkinglodging,
            reservationlodging,
          }),
        );
        return introduction[0]; // contentTypeId === 32, contentid === 2903046
      } else if (contentTypeId === 38) {
        const introduction = arr.map(
          ({ saleitem, fairday, infocentershopping, opentime }) => ({
            saleitem,
            fairday,
            infocentershopping,
            opentime,
          }),
        );
        return introduction[0]; // contentTypeId === 38, contentid === 132786
      } else if (contentTypeId === 39) {
        const introduction = arr.map(
          ({ infocenterfood, restdatefood, opentimefood, parkingfood }) => ({
            infocenterfood,
            restdatefood,
            opentimefood,
            parkingfood,
          }),
        );
        return introduction[0]; // contentTypeId === 39, contentid === 2640274
      }
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
      if (detailData === '') return [];
      const arr: Array<any> = detailData.item;
      const detail = arr.map(({ serialnum, infoname, infotext }) => ({
        serialnum,
        infoname,
        infotext,
      }));
      return detail[0];
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
      return image[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getCourseInfo(cat2Id: string, pageNum: number) {
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
  async getInfoByCategory(cat3Id: string, pageNum: number) {
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
      const content = arr.map(
        ({ title, contentid, firstimage, contentTypeId }) => ({
          title,
          contentid,
          firstimage,
          contentTypeId,
        }),
      );
      return content[0];
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

// * 1.소개 정보
// * 1-1 각 ContentTypeId 별로 소개 정보 최대한 공통 정보만 리스폰스 하기
// * 1-2 관광코스 (ContentTypeId)는 소개정보 내용이 많이 다르니깐 별도의 서비스 로직 구성

// *2.즐겨찾기
// * 2-1 저장
// *로그인*한 유저가 즐겨찾기 버튼을 눌렀을때, contentid, contentTypeId, firstimage, title, address, mapx, mapy를 데이터 베에스에 저장하고
// *해당 정보를 맵 api에 mapx, mapy 를 통해서 지도에 띄우는 기능
// * 2-2 불러오기
// * 저장된 정보(mapx, mapy)로 지도에 핀마크 띄우기
// * 핀 마크를 눌렀을때 디테일 정보로 넘어갈수 있게 만들기
