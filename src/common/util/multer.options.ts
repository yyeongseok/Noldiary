import * as fs from 'fs';
import * as path from 'path';
import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const createFolder = (folder: string) => {
  try {
    console.log('create a root uploads Folder');

    fs.mkdirSync(path.join(__dirname, '..', 'upload'));
    //mkdirSync -> 폴더를 만드는 명령어/ path.join(__dirname, -> 현재 폴더위치/ .. -> 부모폴더/ uploads -> 파일을 만든다.
    // -> 현재 폴더 위치에서 부모폴더 가서 uploads 파일을 만든다.
  } catch (error) {
    console.log('The folder already exists');
  }

  try {
    console.log(`create a ${folder} uploads folder`);

    fs.mkdirSync(path.join(__dirname, '..', `upload/${folder}`));
  } catch (error) {
    console.log(`The ${folder} already exists`);
  }
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder);

  return multer.diskStorage({
    destination(req, file, callback) {
      //* 어디에 저장되는지 경로

      const folderName = path.join(__dirname, '..', `upload/${folder}`);

      callback(null, folderName);
    },

    filename(req, file, callback) {
      //* 어떤 이름으로 저장할지

      const ext = path.extname(file.originalname);

      const filename = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;

      callback(null, filename);
    },
  });
};

export const MulterOption = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
  };

  return result;
};
