import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: false
  }
});

redisClient.on("error", (err) => {
  if (redisClient.isReady) {
    console.log("redis error:", err.message);
  }
});

async function connectRedis() {
  try {
    await redisClient.connect();
    console.log("redis connected");
    return true;
  } catch (error) {
    console.log("redis cache disabled:", error.message);
    return false;
  }
}

export { redisClient, connectRedis };
export default { redisClient, connectRedis };
