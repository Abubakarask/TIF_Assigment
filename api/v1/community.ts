import express from "express";
import { isAuthenticated } from "../../middlewares/v1/auth";
import communityController from "../../controllers/v1/community";

const CommunityRouter = express.Router();
//Community APIs
CommunityRouter.route("/")
  .post(isAuthenticated, communityController.createCommunity)
  .get(isAuthenticated, communityController.getAllCommunities);

CommunityRouter.route("/:id/members").get(
  isAuthenticated,
  communityController.getCommunityMembers
);
CommunityRouter.route("/me/owner").get(
  isAuthenticated,
  communityController.getOwnedCommunity
);
CommunityRouter.route("/me/member").get(
  isAuthenticated,
  communityController.getMyJoinedCommunity
);

export default CommunityRouter;
