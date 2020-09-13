import L from '../../common/logger';
import fs from 'fs';
import s from 'shelljs';
import archiver from 'archiver';

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

  public async createZIP(): Promise<any> {
    if (fs.existsSync('records/all_records.zip')) {
      L.info(`Remove old ZIP`);
      s.rm('-rf', `records/all_records.zip`);
    }

    const zip = archiver('zip', { zlib: { level: 9 }});
    const output = fs.createWriteStream('records/all_records.zip');

    return new Promise((resolve, reject) => {
      L.info(`Create ZIP`);
      zip
        .directory('records', false)
        .on('error', err => reject(err))
        .pipe(output);
  
      output.on('close', () => resolve());
      zip.finalize();
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
