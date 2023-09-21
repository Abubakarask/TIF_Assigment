import express from "express";
import RoleController from "../../controllers/v1/role";

const RoleRouter = express.Router();

//Role APIs
RoleRouter.route("/")
  .post(RoleController.createRole)
  .get(RoleController.getAllRoles);

export default RoleRouter;
