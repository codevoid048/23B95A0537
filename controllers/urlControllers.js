import { nanoid } from "nanoid";
import { createShortUrlEntry, getUrlData, logClick, isShortUrlExists } from "../services/urlServices.js";
import { isExpired } from "../utils/timeUtils.js";
import { log } from "../middlewares/logger.js";

const BASE_URL = "http://localhost:3000";

function generateUniqueShortcode() {
    let code;
    do {
        code = nanoid(8);
    } while (isShortUrlExists(code));
    return code;
}

export const createShortUrl = async (req, res) => {
    const { url, validity = 30, shortcode } = req.body;

    if (!url) {
        await log({ stack: "backend", level: "error", pkg: "controller", message: "URL missing in Req" });
        return res.status(400).json({ error: "URL is required" });
    }

    let shortCode = shortcode || generateUniqueShortcode();
    while (isShortUrlExists(shortCode)) {
        shortCode = generateUniqueShortcode();
    }

    const newUrl = createShortUrlEntry(url, shortCode, parseInt(validity));

    await log({
        stack: "backend", level: "info", pkg: "controller",
        message: "New URL Created"
    });
    res.status(201).json({ shortLink: `${BASE_URL}/${shortCode}`, expiry: newUrl.expiresAt });
};

// GET /shorturls/:shortcode
export const getShortUrlInfo = async (req, res) => {
    const { shortcode } = req.params;
    const data = getUrlData(shortcode);

    if (!data) {
        await log({ stack: "backend", level: "error", pkg: "controller", message: "No Such Shortcode Exists" });
        return res.status(404).json({ error: 'Shortcode not found' });
    }

    await log({ stack: "backend", level: "info", pkg: "controller", message: "Short URL Info Fetched" });
    res.json({
        originalUrl: data.originalUrl,
        createdAt: data.createdAt,
        expiresAt: data.expiresAt,
        clicks: data.clicks,
        accessLogs: data.accessLogs
    });
};

// GET /:shortcode (redirect)
export const handleRedirect = async (req, res) => {
    const { shortcode } = req.params;
    const data = getUrlData(shortcode);

    if (!data) {
        await log({ stack: "backend", level: "error", pkg: "controller", message: "Short link not found" });
        return res.status(404).send('Short link not found');
    }

    if (isExpired(data.expiresAt)) {
        await log({ stack: "backend", level: "error", pkg: "controller", message: "Short link has expired" });
        return res.status(410).send('This link has expired');
    }

    const rawIp = req.headers['x-forwarded-for']?.split(',')[0] || req.connection?.remoteAddress || req.socket?.remoteAddress;
    const ip = rawIp === '::1' ? '127.0.0.1' : rawIp;
    logClick(shortcode, ip);
    await log({ stack: "backend", level: "info", pkg: "controller", message: "Redirecting to ShortURL" });
    res.redirect(data.originalUrl);
};