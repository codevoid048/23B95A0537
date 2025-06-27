import { nanoid } from "nanoid";
import { createShortUrlEntry, getUrlData, logClick, isShortUrlExists } from "../services/urlServices.js";
import { isExpired } from "../utils/timeUtils.js";

const BASE_URL = "http://localhost:3000";

export const createShortUrl = async (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
        return res.status(400).json({ error: "URL is required" });
    }

    let shortCode = shortcode || nanoid(10);
    while (isShortUrlExists(shortCode)) {
        shortCode = nanoid(10);
    }

    const newUrl = createShortUrlEntry(url, shortCode, parseInt(validity));

    res.status(201).json({
        shortLink: `${BASE_URL}/${shortCode}`,
        expiry: newUrl.expiresAt,
    });
};

// GET /shorturls/:shortcode
export const getShortUrlInfo = (req, res) => {
    const { shortcode } = req.params;
    const data = getUrlData(shortcode);

    if (!data) {
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    res.json({
        originalUrl: data.originalUrl,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        clicks: data.clicks,
        accessLogs: data.accessLogs
    });
};

// GET /:shortcode (redirect)
export const handleRedirect = (req, res) => {
    const { shortcode } = req.params;
    const data = getUrlData(shortcode);

    if (!data) {
        return res.status(404).send('Short link not found');
    }

    if (isExpired(data.expiresAt)) {
        return res.status(410).send('This link has expired');
    }

    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.connection?.remoteAddress || req.socket?.remoteAddress;

    const ip = rawIp === '::1' ? '127.0.0.1' : rawIp;

    logClick(shortcode, ip);

    res.redirect(data.originalUrl);
};