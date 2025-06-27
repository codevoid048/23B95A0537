import express from 'express';
import dotenv from 'dotenv';
import urlRoutes from './routes/urlRoutes.js';
import { handleRedirect } from './controllers/urlControllers.js';
import { cleanExpiredLinks } from './utils/cleanup.js';
import { limiter } from './middlewares/ratelimiter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/shorturls', urlRoutes);
app.use(limiter);

app.get('/:shortcode', handleRedirect);

// Runs every 10 minutes
setInterval(() => {
    console.log('Running cleanup task to remove expired links');
    cleanExpiredLinks();
}, 10 * 60 * 1000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
