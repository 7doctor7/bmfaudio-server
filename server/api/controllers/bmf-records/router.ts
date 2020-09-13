import express from 'express';
import multer from 'multer';

import BmfRecoredsController from './controller';

const upload = multer({ dest: 'records/' });

export default express
  .Router()
  .post('/', upload.single('record'), BmfRecoredsController.saveFile)
  .get('/', BmfRecoredsController.listFiles)
  .get('/zip', BmfRecoredsController.getFiles)
  .get('/file', BmfRecoredsController.getFileByName);
