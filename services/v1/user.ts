import { ObjectId } from "mongodb";
import Database from "../../loaders/v1/database";
import { collections } from "../../schema/v1/meta";
import Logger from "../../universe/v1/libraries/logger";
import bcrypt from "bcrypt";

class UserService {
  static async userExists(email: string) {
    return await Database.instance
      .collection(collections.users)
      .findOne({ email });
  }

  static async createUser(name: string, email: string, password: string) {
    let hashedPassword = await bcrypt.hash(password, 10);
    const userDocument = {
      name,
      email,
      password: hashedPassword,
      createdAt: Date.now(),
    };

    const result = await Database.instance
      .collection(collections.users)
      .insertOne(userDocument);
    Logger.instance.info("result", result);

    // Use the insertedId to fetch the user document
    if (result.insertedId) {
      const insertedId = result.insertedId;
      const createdUser = await Database.instance
        .collection(collections.users)
        .findOne({ _id: insertedId });

      if (createdUser) {
        return createdUser;
      }
    }

    throw new Error("user creation failed or user not found");
  }

  static async getUserById(_id: ObjectId) {
    return await Database.instance
      .collection(collections.users)
      .findOne({ _id });
  }

  static async getAll(page: number, perPage: number) {
    let allusers = await Database.instance
      .collection(collections.users)
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();
    return allusers;
  }

  static async getAllCount() {
    return Database.instance.collection(collections.users).countDocuments();
  }

  static async finduserDtls(name: string) {
    return await Database.instance
      .collection(collections.users)
      .findOne({ name });
  }
}

export default UserService;
