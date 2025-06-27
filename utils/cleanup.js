import { urlStore } from '../services/urlServices.js';
import { log } from '../middlewares/logger.js';

// Delete expired short URLs from memory store

export const cleanExpiredLinks = async () => {
    const now = new Date();
    let deleted = 0;

    for (const [code, entry] of urlStore.entries()) {
        if (now > entry.expiresAt) {
            urlStore.delete(code);
            deleted++;
        }
    }

    if (deleted > 0) {
        await log({ stack: 'backend', level: 'info', pkg: 'cron_job', message: `Cleaned up ${deleted} expired links` });
        console.log(`Cleaned up ${deleted} expired link(s)`);
    }
};
