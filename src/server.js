import express from "express";
import "dotenv/config";
import { redis } from "./config/redisConnection.js";

const PORT = process.env.PORT || 3301;

const server = express();

async function startServer() {
  await redis.connect();
  console.log("✅ Connected to Redis Cloud");

  server.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}`);
  });
}

startServer();