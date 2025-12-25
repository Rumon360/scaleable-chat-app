const Redis = require("ioredis");

const redisConfig = {
  host: "127.0.0.1",
  port: 6379,
  username: "admin",
  password: "password",
  // BullMQ requirement:
  maxRetriesPerRequest: null,
};

export const redis = new Redis(redisConfig);
