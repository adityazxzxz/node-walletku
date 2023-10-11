const Redis = require('ioredis');
const { writeErrorLog } = require('./logger');
let redis

try {
    redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        // enableOfflineQueue: false
    })
} catch (error) {
    writeErrorLog('Redis Error', error)
    throw new Error(error);
}

module.exports = {
    set: (key, exp, value) => {
        return redis.setex(key, exp, value)
    },
    get: (key) => {
        return redis.get(key)
    },
    is_exists: (key) => {
        return redis.exists(key)
    }
}