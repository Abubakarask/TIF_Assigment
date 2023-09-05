const express = require("express");
const { createRole, getAllRoles } = require("../controllers/role");
const { signup, signin, myProfile, signout } = require("../controllers/user");
const {
  signupValidationRules,
  signinValidationRules,
} = require("../utils/validation");
const { isAuthenticated } = require("../middlewares/auth");
const {
  createCommunity,
  getAllCommunities,
  getCommunityMembers,
  getOwnedCommunity,
  getMyJoinedCommunity,
} = require("../controllers/community");
const { route } = require("../app");
const { addMember, deleteMember } = require("../controllers/member");
const router = express.Router();

//Role APIs
router.route("/role").post(createRole).get(getAllRoles);

//User APIs
router.route("/auth/signup").post(signupValidationRules, signup);
router.route("/auth/signin").post(signinValidationRules, signin);
router.route("/auth/me").get(isAuthenticated, myProfile);
router.route("/auth/signout").get(isAuthenticated, signout);

//Community APIs
router
  .route("/community")
  .post(isAuthenticated, createCommunity)
  .get(isAuthenticated, getAllCommunities);
router
  .route("/community/:id/members")
  .get(isAuthenticated, getCommunityMembers);
router.route("/community/me/owner").get(isAuthenticated, getOwnedCommunity);
router.route("/community/me/member").get(isAuthenticated, getMyJoinedCommunity);

// Member APIs
router.route("/member").post(isAuthenticated, addMember);
router
  .route("/member/:memberid/:communityid")
  .delete(isAuthenticated, deleteMember);

module.exports = router;
