import Database from "../../loaders/v1/database";
import { collections } from "../../schema/v1/meta";
import { ObjectId } from "mongodb";

class MemberService {
  static async memberExists(userID: ObjectId, communityID: ObjectId) {
    return await Database.instance
      .collection(collections.members)
      .findOne({ user: userID, community: communityID });
  }

  static async createMember(
    community: ObjectId,
    user: ObjectId,
    role: ObjectId
  ) {
    const memberDocument = {
      community,
      user,
      role,
      createdAt: Date.now(),
    };

    const result = await Database.instance
      .collection(collections.members)
      .insertOne(memberDocument);

    // Use the insertedId to fetch the community document
    if (result.insertedId) {
      const insertedId = result.insertedId;
      const createdMember = await Database.instance
        .collection(collections.members)
        .findOne({ _id: insertedId });

      if (createdMember) {
        return createdMember;
      }
    }
  }
  static async getAll(page: number, perPage: number) {
    let allMembers = await Database.instance
      .collection(collections.members)
      .find()
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();
    return allMembers;
  }

  static async getAllCount() {
    return Database.instance.collection(collections.members).countDocuments();
  }

  static async deleteMember(user: string, community: string) {
    return await Database.instance
      .collection(collections.members)
      .deleteOne({ user, community });
  }

  static async getMemberCount(communityId: ObjectId) {
    return Database.instance
      .collection(collections.members)
      .countDocuments({ community: communityId });
  }

  static async ifCommunityAdmin(
    roleId: ObjectId,
    communityId: ObjectId,
    userId: ObjectId
  ) {
    return Database.instance
      .collection(collections.members)
      .findOne({ community: communityId, role: roleId, user: userId });
  }

  static async ifCommunityAccess(
    communityId: ObjectId,
    userId: string,
    AdminId: ObjectId,
    Modrtr: ObjectId
  ) {
    return Database.instance.collection(collections.members).findOne({
      community: communityId,
      user: new ObjectId(userId),
      $or: [{ role: AdminId }, { role: Modrtr }],
    });
  }

  static async getJoinedCommunitiesCount(userId: ObjectId) {
    return Database.instance
      .collection(collections.members)
      .countDocuments({ used: userId });
  }
}

export default MemberService;
