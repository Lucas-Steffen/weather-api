import { createClient } from "redis";
import "dotenv/config";

export const redis = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_SOCKET_HOST,
    port: Number(process.env.REDIS_SOCKET_PORT)
  }
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});