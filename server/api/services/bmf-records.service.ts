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
  saved_name: string;
  saved: boolean;
  err?: any;
}

export class BMFAudioService {
  public async listFiles(deviceID?: string): Promise<string[]> {
    const path = deviceID ? `records/${deviceID}` : 'records/';

    console.log('deviceID => ', deviceID);

    L.info('fetch all files');
    await this.checkRecordsFolder();
    return s.ls('-A', [path]);
  }

  public saveFile(data: { file: FileUpload; deviceID: string }): Promise<FileSaved> {
    return new Promise(async (resolve, reject) => {
      const { file, deviceID } = data;
      const { originalname, filename } = file;
      const savedName = `${Date.now()}_${originalname}`;

      await this.checkRecordsFolder(deviceID);

      try {
        L.info(`Save the file ${originalname}`);
        s.cp(`records/${filename}`, `records/${deviceID}/${savedName}`);
        s.rm('-rf', `records/${filename}`);
        resolve({ file_name: originalname, saved: true, saved_name: savedName });
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

    const zip = archiver('zip', { zlib: { level: 9 } });
    const output = fs.createWriteStream('records/all_records.zip');

    return new Promise((resolve, reject) => {
      L.info(`Create ZIP`);
      zip
        .directory('records', false)
        .on('error', (err) => reject(err))
        .pipe(output);

      output.on('close', () => resolve());
      zip.finalize();
    });
  }

  private async checkRecordsFolder(deviceID?: string): Promise<boolean> {
    const exist = fs.existsSync('records');
    return new Promise((resolve) => {
      if (!exist) {
        s.mkdir('records');

        if (deviceID) {
          s.mkdir(`records/${deviceID}`);
        }
      } else {
        const sub = fs.existsSync(`records/${deviceID}`);

        if (!sub) {
          s.mkdir(`records/${deviceID}`);
        }
      }

      resolve(true);
    });
  }
}

export default new BMFAudioService();
