import express from "express";
import "dotenv/config";
import { redis } from "./config/redisConnection.js";
import { router } from './routes/weather.js'
import rateLimit from "express-rate-limit";

const PORT = process.env.PORT || 3301;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

const server = express();
server.use(router)
server.use(limiter);
server.use(express.static('public'));

async function startServer() {
  await redis.connect();
  console.log("✅ Connected to Redis Cloud");

  server.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
}

startServer();