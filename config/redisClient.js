import { createClient } from 'redis';

// currently using redis for caching
const redisClient = createClient({
    url: 'redis://localhost:6379'
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

await redisClient.connect();

console.log('Redis connected');
export default redisClient;
