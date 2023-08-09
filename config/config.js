require('dotenv').config()
module.exports = {
    "development": {
        "username": process.env.DEV_DB_USERNAME || 'root',
        "password": process.env.DEV_DB_PASSWORD || '',
        "database": process.env.DEV_DB_NAME || 'mydb',
        "host": process.env.DEV_DB_HOST || '127.0.0.1',
        "port": process.env.DEV_DB_PORT || '3306',
        "dialect": process.env.DEV_DB_DIALECT || "mysql",
        "logging": false,
        "pool": {
            "max": process.env.DEV_DB_POOL_MAX || 5,
            "min": process.env.DEV_DB_POOL_MIN || 0,
            "acquire": process.env.DEV_DB_POOL_ACQUIRE || 30000,
            "idle": process.env.DEV_DB_POOL_IDLE || 10000
        },
        "dialectOptions": {
            "timezone": '+07:00',
        },
        "timezone": '+07:00',
    },
    "test": {
        "username": "root",
        "password": null,
        "database": "database_test",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "logging": false,
        "pool": {
            "max": 5,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        },
        "dialectOptions": {
            "timezone": '+07:00',
        },
        "timezone": '+07:00',
    },
    "production": {
        "username": "root",
        "password": null,
        "database": "database_production",
        "host": "127.0.0.1",
        "dialect": "mysql",
        "logging": false,
        "pool": {
            "max": 5,
            "min": 0,
            "acquire": 30000,
            "idle": 10000
        },
        "dialectOptions": {
            "timezone": '+07:00',
        },
        "timezone": '+07:00',
    }
}
