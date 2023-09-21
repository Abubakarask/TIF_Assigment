import IORedis, { Redis } from "ioredis";
class Cache {
  static instance: Redis;

  static async Loader(): Promise<void> {
    try {
      if (process.env.REDIS_URI) {
        Cache.instance = new IORedis(process.env.REDIS_URI);

        Cache.instance.on("ready", () => {
          console.log("Redis connection established.");
        });

        Cache.instance.on("error", (error) => {
          console.error("Redis connection error:", error);
        });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default Cache;
