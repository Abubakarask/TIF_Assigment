import express from "express";
import UserController from "../../controllers/v1/user";
import { isAuthenticated } from "../../middlewares/v1/auth";

const UserRouter = express.Router();

//User APIs
UserRouter.route("/signup").post(UserController.signup);
UserRouter.route("/signin").post(UserController.signin);
UserRouter.route("/me").get(isAuthenticated, UserController.myProfile);
UserRouter.route("/signout").get(isAuthenticated, UserController.signout);

export default UserRouter;
