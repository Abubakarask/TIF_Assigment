import express, { Request, Response } from "express";
import { Member } from "../../models/Member";
import { Community } from "../../models/Community";
import { Role } from "../../models/Role";
import { User } from "../../models/User";
import { generateSnowflakeId } from "../../universe/v1/libraries/helper";

class memberController {
  static async addMember(req: Request, res: Response) {
    try {
      const userId = req.user._id;
      const { community, user, role } = req.body;

      //check if member exists in community, if exists send error
      let memberExists = await Member.findOne({ user, community });
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
      const communityExists = await Community.findById(community);
      const userExists = await User.findById(user);
      const roleExists = await Role.findById(role);

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
      const AdminDtls = await Role.findOne({ name: "Community Admin" });

      //check if user is community admin(of community given in payload)
      const communityAdmin = await Member.find({
        role: AdminDtls._id,
        community,
        user: userId,
      });

      if (!communityAdmin) {
        return res.status(40).json({
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
      const _id = await generateSnowflakeId();
      const member = new Member({
        _id,
        community,
        user,
        role,
      });

      await member.save();

      res.status(200).json({
        status: true,
        content: {
          data: {
            _id: member._id,
            community: member.community,
            user: member.user,
            role: member.role,
            created_at: member.created_at,
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
      const { memberid, communityid } = req.params;

      //check if member exists in community, if not exists send error
      let member = await Member.findOne({
        user: memberid,
        community: communityid,
      });

      if (!member) {
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
      const AdminDtls = await Role.findOne({ name: "Community Admin" });
      const modrtrDtls = await Role.findOne({ name: "Community Moderator" });

      //check if user is community admin or moderator(of community given in payload)
      const communityAccess = await Member.findOne({
        community: communityid,
        user: userId,
        $or: [{ role: AdminDtls._id }, { role: modrtrDtls._id }],
      });

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

      await Member.deleteOne({
        user: memberid,
        community: communityid,
      });

      res.status(200).json({
        status: true,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to add a member to the community.",
      });
    }
  }
}

export default memberController;
