import express, { Request, Response } from "express";
import { generateSlug } from "../../universe/v1/libraries/helper";
import CommunityService from "../../services/v1/community";
import RoleService from "../../services/v1/role";
import MemberService from "../../services/v1/member";
import Logger from "../../universe/v1/libraries/logger";
import { ObjectId } from "mongodb";

class communityController {
  static async createCommunity(req: Request, res: Response) {
    try {
      // user _id from the authenticated user
      // console.log(req.user);
      const ownerId = req.user._id;

      // get community name from payload
      const { name } = req.body;

      const slug = await generateSlug(name);

      const communityWithSlugExists = await CommunityService.communityExists(
        slug
      );
      if (communityWithSlugExists) {
        return res.status(400).json({
          success: false,
          message: "Community with this name/slug already exists",
          code: "ALREADY_EXIST",
        });
      }

      const community = await CommunityService.createCommunity(
        name,
        slug,
        ownerId
      );

      //Add owner/logged_in user(first member as Community Admin)
      let roleDetails = await RoleService.findRoleDtls("Community Admin");

      if (roleDetails) {
        let firstMember = await MemberService.createMember(
          community._id,
          ownerId,
          roleDetails._id
        );
      }

      res.status(200).json({
        status: true,
        content: {
          data: {
            _id: community._id,
            name: community.name,
            slug: community.slug,
            owner: community.owner,
            created_at: community.created_at,
            updated_at: community.updated_at,
          },
        },
      });
    } catch (error) {
      Logger.instance.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to create a community",
      });
    }
  }

  static async getAllCommunities(req: Request, res: Response) {
    try {
      // Get the page number from query (default to 1 if not present)
      const page = parseInt(req.query.page as string) || 1;
      const perPage = 10;

      // Calculate skip and limit for pagination
      const skip = (page - 1) * perPage;
      const limit = perPage;

      //Communities wrt Pagination, also populated owner details
      // const allCommunities = await Community.find({}, { __v: 0 })
      //   .skip(skip)
      //   .limit(limit)
      //   .populate({
      //     path: "owner",
      //     select: "_id name",
      //   });

      const allCommunities = await CommunityService.getAll(page, perPage);

      const totalCommunities = await CommunityService.getAllCount();

      const totalPages = Math.ceil(totalCommunities / limit);

      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: totalCommunities,
            pages: totalPages,
            page,
          },
          data: allCommunities,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve joined communities",
      });
    }
  }

  static async getCommunityMembers(req: Request, res: Response) {
    try {
      let communityId = req.params.id;
      Logger.instance.info(communityId);

      const page = parseInt(req.query.page as string) || 1;
      const perPage = 10;

      // Calculate skip and limit for pagination
      const skip = (page - 1) * perPage;
      const limit = perPage;

      // Query the community to ensure it exists
      const community = await CommunityService.getCommunityById(
        new ObjectId(communityId)
      );
      if (!community) {
        return res.status(404).json({
          status: false,
          message: "Community not found",
        });
      }

      // Query members with pagination, populate other fields
      // const members = await Member.find({ community: communityId })
      //   .skip(skip)
      //   .limit(limit)
      //   .populate({
      //     path: "role",
      //     select: "id name",
      //   })
      //   .populate({
      //     path: "user",
      //     select: "id name",
      //   });
      const members = await CommunityService.getCommunityMembers(
        communityId,
        skip,
        limit
      );

      Logger.instance.info(members);

      const totalMembers = await MemberService.getMemberCount(
        new ObjectId(communityId)
      );
      const totalPages = Math.ceil(totalMembers / limit);

      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: totalMembers,
            pages: totalPages,
            page,
          },
          data: members,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: `Failed to retrieve all members of community ${req.params.id}`,
      });
    }
  }

  static async getOwnedCommunity(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = 10;

      // get all the communites with owner_id as loggedIn user's Id
      const communities = await CommunityService.getOwnedCommunities(
        req.user._id,
        page,
        perPage
      );

      const totalCommunities = await CommunityService.getOwnedCommunitiesCount(
        req.user._id
      );
      const totalPages = Math.ceil(totalCommunities / perPage);

      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: totalCommunities,
            pages: totalPages,
            page,
          },
          data: communities,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: `Failed to retrieve all members of community ${req.params.id}`,
      });
    }
  }

  static async getMyJoinedCommunity(req: Request, res: Response) {
    try {
      const userId = req.user.id;

      //get page from query params if not present use default as 1
      const page = parseInt(req.query.page as string) || 1;
      const perPage = 10;

      // Calculate skip and limit for pagination
      const skip = (page - 1) * perPage;
      const limit = perPage;

      // const joinedCommunities = await Member.find({ user: userId })
      //   .skip(skip)
      //   .limit(limit)
      //   .populate({
      //     path: "community",
      //     select: "id name slug owner created_at updated_at",
      //     populate: {
      //       path: "owner",
      //       select: "id name",
      //     },
      //   })
      //   .populate("role", "id name");
      const joinedCommunities = await CommunityService.getJoinedCommunities(
        skip,
        limit,
        userId
      );

      console.log(joinedCommunities);

      const total = await MemberService.getJoinedCommunitiesCount(userId);
      const totalPages = Math.ceil(total / perPage);

      const transformedData = joinedCommunities.map((item: any) => ({
        id: item.community.id,
        name: item.community.name,
        slug: item.community.slug,
        owner: {
          id: item.community.owner.id,
          name: item.community.owner.name,
        },
        created_at: item.community.created_at,
        updated_at: item.community.updated_at,
        role: {
          id: item.role.id,
          name: item.role.name,
        },
      }));

      res.status(200).json({
        status: true,
        content: {
          meta: {
            total,
            pages: totalPages,
            page,
          },
          data: transformedData,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve joined communities",
      });
    }
  }
}
export default communityController;
