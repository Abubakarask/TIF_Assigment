import { Db, MongoClient } from "mongodb";
import Env from "./env";
import Logger from "../../universe/v1/libraries/logger";

class Database {
  static instance: Db;

  static async Loader() {
    const uri = `mongodb+srv://${Env.variable.DATABASE_USERNAME}:${Env.variable.DATABASE_PASSWORD}@${Env.variable.DATABASE_REPLICASET}.${Env.variable.DATABASE_HOST}`;

    try {
      const client = new MongoClient(uri);
      await client.connect();
      Database.instance = client.db("TIF");

      Logger.instance.info("Database is established");
    } catch (error) {
      Logger.instance.error(error);
    }
  }
}

export default Database;
