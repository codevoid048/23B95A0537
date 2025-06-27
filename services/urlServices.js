import { addMinutes } from '../utils/timeUtils.js';

const urlStore = new Map();

export function createShortUrlEntry(originalUrl, shortId, validityMinutes = 30) {
    const createdAt = new Date();
    const expiresAt = addMinutes(validityMinutes);

    const entry = {
        originalUrl,
        shortId,
        createdAt,
        expiresAt,
        clicks: 0,
        accessLogs: []
    };

    urlStore.set(shortId, entry);
    return entry;
}

export function getUrlData(shortId) {
    return urlStore.get(shortId);
}

export function logClick(shortId, ip) {
    const entry = urlStore.get(shortId);
    if (!entry) return;

    entry.clicks++;
    entry.accessLogs.push({
        timestamp: new Date(),
        ip
    });
}

export function isShortUrlExists(shortId) {
    return urlStore.has(shortId);
}
