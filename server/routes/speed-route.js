import express from 'express'
import {
  pingCheck,
  downloadTest,
  uploadTest
} from '../controller/speed-controller.js';

const router = express.Router();


router.get('/ping', pingCheck);
router.get('/download', downloadTest);
router.post('/upload', uploadTest);

export default router;