import express, { Request, Response } from "express";
import MemberService from "../../services/v1/member";
import RoleService from "../../services/v1/role";
import CommunityService from "../../services/v1/community";
import { ObjectId } from "mongodb";
import UserService from "../../services/v1/user";
import Logger from "../../universe/v1/libraries/logger";

class memberController {
  static async addMember(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { community, user, role } = req.body;

      //check if member exists in community, if exists send error
      let memberExists = await MemberService.memberExists(user, community);
      if (memberExists) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "User is already added in the community.",
              code: "RESOURCE_EXISTS",
            },
          ],
        });
      }

      //check if the payload attributes are present in respective communities, if not send error
      const communityExists = await CommunityService.getCommunityById(
        new ObjectId(community)
      );
      const userExists = await UserService.getUserById(new ObjectId(user));
      const roleExists = await RoleService.getRoleById(new ObjectId(role));

      if (!communityExists) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "community",
              message: "Community not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }

      if (!userExists) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "user",
              message: "User not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }

      if (!roleExists) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "role",
              message: "Role not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }

      //get details for Community Admin
      let AdminDtls = await RoleService.findRoleDtls("Community Admin");
      let communityAdmin: any;
      if (AdminDtls) {
        //check if user is community admin(of community given in payload)
        communityAdmin = await MemberService.ifCommunityAdmin(
          AdminDtls._id,
          new ObjectId(community),
          userId
        );
      }
      if (!communityAdmin) {
        return res.status(401).json({
          status: false,
          errors: [
            {
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS",
            },
          ],
        });
      }

      // Create a new member
      const member = await MemberService.createMember(
        new ObjectId(community),
        userId,
        new ObjectId(role)
      );

      res.status(200).json({
        status: true,
        content: {
          data: {
            _id: member?._id,
            community: member?.community,
            user: member?.user,
            role: member?.role,
            created_at: member?.created_at,
          },
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to add a member to the community.",
      });
    }
  }

  static async deleteMember(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { member, community } = req.params;
      let memberObjectId = new ObjectId(member);
      let communityObjectId = new ObjectId(community);
      console.log(memberObjectId, communityObjectId);

      let memberExists = await MemberService.memberExists(
        new ObjectId(member),
        new ObjectId(community)
      );

      Logger.instance.info(memberExists);

      if (!memberExists) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "Member not found.",
              code: "RESOURCE_NOT_FOUND",
            },
          ],
        });
      }

      //get details for Community Admin and Moderator
      const AdminDtls = await RoleService.findRoleDtls("Community Admin");
      const modrtrDtls = await RoleService.findRoleDtls("Community Moderator");

      //check if user is community admin or moderator(of community given in payload)
      const communityAccess = await MemberService.ifCommunityAccess(
        communityObjectId,
        userId,
        AdminDtls?._id,
        modrtrDtls?._id
      );

      // console.log(communityAccess, communityid, userId);

      if (!communityAccess) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              message: "You are not authorized to perform this action.",
              code: "NOT_ALLOWED_ACCESS",
            },
          ],
        });
      }

      await MemberService.deleteMember(member, community);

      res.status(200).json({
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to delete a member to the community.",
      });
    }
  }
}

export default memberController;
