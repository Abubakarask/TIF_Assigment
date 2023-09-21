import express, { Request, Response } from "express";
import { generateSnowflakeId } from "../../universe/v1/libraries/helper";
import Logger from "../../universe/v1/libraries/logger";
import RoleService from "../../services/v1/role";

class RoleController {
  static async createRole(req: Request, res: Response) {
    try {
      const { name } = req.body;
      console.log(name);

      let roleExists = await RoleService.roleExists(name);
      console.log(roleExists);

      if (roleExists) {
        return res.status(400).json({
          status: false,
          error: {
            param: "name",
            message: `Role ${name} already exists.`,
            code: "RESOURCE_EXISTS",
          },
        });
      }

      const role = await RoleService.createRole(name);

      res.status(200).json({
        status: true,
        content: {
          data: role,
        },
      });
    } catch (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Failed to create Role" });
    }
  }

  static async getAllRoles(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      //no of entries per page
      const perPage = 10;

      //fetching entries and handling the pagination part(using skip for skipping the entries which we in previous pages)
      const roles = await RoleService.getAll(page, perPage);

      const totalRoles = await RoleService.getAllCount();
      const totalPages = Math.ceil(totalRoles / perPage);

      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: totalRoles,
            pages: totalPages,
            page,
          },
          data: roles,
        },
      });
    } catch (err) {
      Logger.instance.error(err);

      res.status(500).json({ status: false, error: "Failed to fetch roles" });
    }
  }
}

export default RoleController;
