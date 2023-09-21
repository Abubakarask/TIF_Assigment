import { ObjectId } from "mongodb";
import Database from "../../loaders/v1/database";
import { collections } from "../../schema/v1/meta";
import Logger from "../../universe/v1/libraries/logger";

class RoleService {
  static async roleExists(name: string) {
    return await Database.instance
      .collection(collections.roles)
      .findOne({ name });
  }

  static async createRole(name: string) {
    const roleDocument = {
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await Database.instance
      .collection(collections.roles)
      .insertOne(roleDocument);
    Logger.instance.info("result", result);

    // Use the insertedId to fetch the role document
    if (result.insertedId) {
      const insertedId = result.insertedId;
      const createdRole = await Database.instance
        .collection(collections.roles)
        .findOne({ _id: insertedId });

      if (createdRole) {
        return createdRole;
      }
    }

    throw new Error("Role creation failed or role not found");
  }

  static async getAll(page: number, perPage: number) {
    let allRoles = await Database.instance
      .collection(collections.roles)
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();
    return allRoles;
  }

  static async getAllCount() {
    return Database.instance.collection(collections.roles).countDocuments();
  }

  static async findRoleDtls(name: string) {
    return await Database.instance
      .collection(collections.roles)
      .findOne({ name });
  }

  static async getRoleById(_id: ObjectId) {
    return await Database.instance
      .collection(collections.roles)
      .findOne({ _id });
  }
}

export default RoleService;
