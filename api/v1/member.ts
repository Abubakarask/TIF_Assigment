import express from "express";
import { isAuthenticated } from "../../middlewares/v1/auth";
import memberController from "../../controllers/v1/member";

const MemberRouter = express.Router();

// Member APIs
MemberRouter.route("/").post(isAuthenticated, memberController.addMember);
MemberRouter.route("/:memberid/:communityid").delete(
  isAuthenticated,
  memberController.deleteMember
);

export default MemberRouter;
