import express from 'express';
import { createShortUrl, getShortUrlInfo } from '../controllers/urlControllers.js';

const router = express.Router();

router.post('/', createShortUrl);
router.get('/:shortcode', getShortUrlInfo);

export default router;
