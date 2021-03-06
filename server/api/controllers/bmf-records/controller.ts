import { Request, Response } from 'express';
import fs from 'fs';

import L from '../../../common/logger';
import BMFAudioService from '../../services/bmf-records.service';

export class BmfRecoredsController {
  public async saveFile(req: Request, res: Response): Promise<void> {
    const file = { ...req.file };
    const { deviceID } = req.body;

    if (!deviceID) {
      res.status(404).json({ message: `Device ID isn't present!` });
      return;
    }

    try {
      const save = await BMFAudioService.saveFile({ file, deviceID });
      res.json({ ...save });
    } catch (err) {
      res.status(404).json({ ...err });
    }
  }

  public async listFiles(req: Request, res: Response): Promise<void> {
    const { device_id } = req.query;
    const list = await BMFAudioService.listFiles(`${device_id}`);

    res.json([...list]);
  }

  public async getFiles(req: Request, res: Response): Promise<void> {
    try {
      await BMFAudioService.createZIP();
      res.download('records/all_records.zip');
    } catch (err) {
      L.info(`Create ZIP ERROR: `, err);
      res.status(404).json({ ...err });
    }
  }

  public async getFileByName(req: Request, res: Response): Promise<void> {
    const { name } = req.body;

    if (!name) {
      res.status(404).json({ error: `Provide the name of File!` });
    }

    if (!fs.existsSync(`records/${name}`)) {
      res.status(404).json({ error: `File ${name} is not exist` });
    }

    res.download(`records/${name}`);
  }
}

export default new BmfRecoredsController();
