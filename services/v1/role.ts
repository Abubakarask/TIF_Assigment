import { ObjectId } from "mongoose";
import Database from "../../loaders/v1/database";
import { collections } from "../../schema/v1/meta";

class RoleService {
  static async roleExists(name: string) {
    return await Database.instance
      .collection(collections.roles)
      .findOne({ name });
  }

  static async createRole(name: string, roleId: string) {
    const roleDocument = {
      _id: roleId,
      name,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await Database.instance
      .collection(collections.roles)
      .insertOne(roleDocument);
    console.log("result", result);

    return result;
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
}

export default RoleService;
