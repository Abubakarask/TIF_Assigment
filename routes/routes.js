const express = require("express");
const { createRole, getAllRoles } = require("../controllers/role");
const { handleDuplicateKeyError } = require("../middlewares/errorHandler");
const { signup, signin, myProfile, signout } = require("../controllers/user");
const {
  signupValidationRules,
  signinValidationRules,
} = require("../utils/validation");
const { isAuthenticated } = require("../middlewares/auth");
const router = express.Router();

//Role APIs
router.route("/role").post(createRole).get(getAllRoles);

//User APIs
router.route("/auth/signup").post(signupValidationRules, signup);
router.route("/auth/signin").post(signinValidationRules, signin);
router.route("/auth/me").post(isAuthenticated, myProfile);
router.route("/auth/signout").post(isAuthenticated, signout);

module.exports = router;
