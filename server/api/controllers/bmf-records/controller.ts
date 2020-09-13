import { Request, Response } from 'express';

import BMFAudioService from '../../services/bmf-records.service';

export class BmfRecoredsController {
  public async saveFile(req: Request, res: Response): Promise<void> {
    const file = { ...req.file };

    try {
      const save = await BMFAudioService.saveFile({ ...file });
      res.json({ ...save });
    } catch (err) {
      res.status(404).json({ ...err });
    }
  }

  async listFiles(req: Request, res: Response) {
    const list = await BMFAudioService.listFiles();
    res.json([...list]);
  }
}

export default new BmfRecoredsController();
