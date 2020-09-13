import L from '../../common/logger';
import fs from 'fs';
import s, { cat } from 'shelljs';

interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface FileSaved {
  file_name: string;
  saved: boolean;
  err?: any;
}

export class BMFAudioService {
  public async listFiles(): Promise<string[]> {
    L.info('fetch all files');
    await this.checkRecordsFolder();
    return s.ls('-A', ['records/']);
  }

  public saveFile(file: FileUpload): Promise<FileSaved> {
    return new Promise(async (resolve, reject) => {
      await this.checkRecordsFolder();
      console.log('file => ', file);
      const { originalname, filename } = file;

      try {
        L.info(`Save the file ${originalname}`);
        s.cp(`records/${filename}`, `records/${Date.now()}_${originalname}`);
        s.rm('-rf', `records/${filename}`);
        resolve({ file_name: originalname, saved: true });
      } catch (err) {
        L.info(`Save the file ${originalname} ERROR: `, JSON.stringify(err));
        reject({ file_name: originalname, saved: false, err });
      }
    });
  }

  private async checkRecordsFolder(): Promise<boolean> {
    const exist = fs.existsSync('records');
    return new Promise((resolve) => {
      if (!exist) {
        s.mkdir('records');
      }
      resolve(true);
    });
  }
}

export default new BMFAudioService();
