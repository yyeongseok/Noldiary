import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { UsersRepository } from 'src/users/users.repository';
import { tourFavoriteDto } from '../dto/tour.create.dto';
import { Tours } from '../tour.schema';

@Injectable()
export class TourService {
  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Tours.name) private readonly TourModel: Model<Tours>,
    private readonly usersRepository: UsersRepository,
  ) {}
  async getInfoSearchTourApi(keyword: string, pageNum: number) {
    try {
      const result = await axios.get(
        'http://apis.data.go.kr/B551011/KorService1/searchKeyword1',
        {
          params: {
            serviceKey: this.configService.get('TOUR_SECRET_KEY'),
            MobileApp: 'APPTETS',
            MobileOS: 'ETC',
            pageNo: pageNum,
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
      const content = arr.map(
        ({ title, firstimage, contentid, contenttypeid }) => ({
          title,
          firstimage,
          contentid,
          contenttypeid,
        }),
      );
      const totalCount = data.response.body.totalCount;
      return { content, totalCount };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async getDetailCommonInfo(contentId: number, contentTypeId: number) {
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
            contentTypeId: contentTypeId,
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
        ({
          title,
          firstimage,
          overview,
          contentid,
          mapx,
          mapy,
          addr1,
          contenttypeid,
        }) => ({
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
          ({ saleitem, infocentershopping, opentime, restdateshopping }) => ({
            saleitem,
            infocentershopping,
            opentime,
            restdateshopping,
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
      if (contentTypeId === 32) return [];
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
      const content = itemArr.map(
        ({ title, firstimage, contentid, contentTypeid }) => ({
          title,
          firstimage,
          contentid,
          contentTypeid,
        }),
      );
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
        ({ title, contentid, firstimage, contenttypeid }) => ({
          title,
          contentid,
          firstimage,
          contenttypeid,
        }),
      );
      return content;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  async tourFavorite(User: string, tourData: tourFavoriteDto) {
    try {
      const validateAuthor = await this.usersRepository.findUserByEmail(User);

      const { contenttypeid, contentid, title, mapx, mapy, firstimage, addr1 } =
        tourData;

      const newfavorite = new this.TourModel({
        user: validateAuthor.email,
        contenttypeid,
        contentid,
        title,
        mapx,
        mapy,
        firstimage,
        addr1,
      });
      return await newfavorite.save();
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getTourFavorite(User: string, contentid: number) {
    try {
      const validateUser = await this.usersRepository.findUserByEmail(User);
      const user = validateUser.email;

      if (!user) {
        throw new UnauthorizedException('잘못된 접근입니다.');
      }
      const getTourFavorite = await this.TourModel.findOne(
        { user, contentid },
        { _id: 0 },
        { updateAt: 0 },
      ).sort({ CreatedAt: -1 });

      if (getTourFavorite === null) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async getTourFavoriteDetail(User: string, contentid: number) {
    try {
      const validateUser = await this.usersRepository.findUserByEmail(User);
      const user = validateUser.email;

      if (!user) {
        throw new UnauthorizedException('잘못된 접근입니다.');
      }

      const getTourFavoriteDetail = await this.TourModel.find(
        { user, contentid },
        { title: 1, mapx: 1, mapy: 1, firstimage: 1, addr1: 1, _id: 0 },
        { updatedAt: 0 },
      ).sort({ CreatedAt: -1 });

      return getTourFavoriteDetail;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}

// 즐겨찾기 포스트할때 불리언 디폴트로 true
