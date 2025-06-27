import rateLimit from 'express-rate-limit';

// limit each IP to 200 requests per window
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.'
});
