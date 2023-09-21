import { ObjectId } from "mongodb";
import Database from "../../loaders/v1/database";
import { collections } from "../../schema/v1/meta";
import Logger from "../../universe/v1/libraries/logger";

class CommunityService {
  static async communityExists(slug: string) {
    return await Database.instance
      .collection(collections.communities)
      .findOne({ slug });
  }

  static async createCommunity(name: string, slug: string, owner: ObjectId) {
    const communityDocument = {
      name,
      slug,
      owner,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const result = await Database.instance
      .collection(collections.communities)
      .insertOne(communityDocument);
    Logger.instance.info("result", result);

    // Use the insertedId to fetch the community document
    if (result.insertedId) {
      const insertedId = result.insertedId;
      const createdCommunity = await Database.instance
        .collection(collections.communities)
        .findOne({ _id: insertedId });

      if (createdCommunity) {
        return createdCommunity;
      }
    }

    throw new Error("Community creation failed or community not found");
  }

  static async getAll(page: number, perPage: number) {
    try {
      const collection = Database.instance.collection(collections.communities);

      const pipeline = [
        {
          $skip: (page - 1) * perPage,
        },
        {
          $limit: perPage,
        },
        {
          $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "ownerInfo",
          },
        },
        {
          $project: {
            name: 1,
            ownerInfo: { _id: 1, name: 1 },
          },
        },
      ];

      const allCommunities = await collection.aggregate(pipeline).toArray();

      return allCommunities;
    } catch (error) {
      throw error;
    }
  }

  static async getOwnedCommunities(
    ownerId: ObjectId,
    page: number,
    perPage: number
  ) {
    let result = await Database.instance
      .collection(collections.communities)
      .find({ owner: ownerId })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    return result;
  }

  static async getJoinedCommunities(
    skip: number,
    limit: number,
    userId: ObjectId
  ) {
    const collection = Database.instance.collection(collections.members);

    const pipeline = [
      {
        $match: {
          user: userId,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: collections.communities,
          localField: "community",
          foreignField: "_id",
          as: "communityInfo",
        },
      },
      {
        $lookup: {
          from: collections.roles,
          localField: "role",
          foreignField: "_id",
          as: "roleInfo",
        },
      },
    //   {
    //     $project: {
    //       _id: 0, // Exclude _id field
    //       "communityInfo.id": 1,
    //       "communityInfo.name": 1,
    //       "communityInfo.slug": 1,
    //       "communityInfo.owner.id": 1,
    //       "communityInfo.owner.name": 1,
    //       "communityInfo.created_at": 1,
    //       "communityInfo.updated_at": 1,
    //       "roleInfo.id": 1,
    //       "roleInfo.name": 1,
    //     },
    //   },
    ];

    const joinedCommunities = await collection.aggregate(pipeline).toArray();

    return joinedCommunities;
  }

  static async getCommunityMembers(
    communityId: string,
    skip: number,
    limit: number
  ) {
    try {
      const collection = Database.instance.collection(collections.members);

      const pipeline = [
        {
          $match: {
            community: new ObjectId(communityId),
          },
        },
        {
          $skip: skip,
        },
        {
          $limit: limit,
        },
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "roleInfo",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "user",
            foreignField: "_id",
            as: "userInfo",
          },
        },
      ];

      const members = await collection.aggregate(pipeline).toArray();

      return members;
    } catch (error) {
      throw error;
    }
  }

  static async getAllCount() {
    return Database.instance
      .collection(collections.communities)
      .countDocuments();
  }

  static async getOwnedCommunitiesCount(ownerId: ObjectId) {
    return Database.instance
      .collection(collections.communities)
      .countDocuments({ owner: ownerId });
  }

  static async findCommunityDtls(name: string) {
    return await Database.instance
      .collection(collections.communities)
      .findOne({ name });
  }

  static async getCommunityById(_id: ObjectId) {
    return await Database.instance
      .collection(collections.communities)
      .findOne({ _id });
  }
}

export default CommunityService;
