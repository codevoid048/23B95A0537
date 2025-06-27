import axios from 'axios';
import { getNewAccessToken } from '../utils/getAccessToken.js';

const LOGGING_ENDPOINT = 'http://20.244.56.144/evaluation-service/logs';

export async function log({ stack = 'backend', level = 'info', pkg = 'handler', message }) {
    const accessToken = await getNewAccessToken();
    if (!accessToken) {
        console.error('Failed to fetch access token, skipping log');
        return;
    }

    const payload = { stack, level, package: pkg, message };

    try {
        console.log('Logging payload:', payload);
        await axios.post(LOGGING_ENDPOINT, payload, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (err) {
        console.error('Logging failed:', err.response?.data || err.message);
    }
}
