import { Request, Response } from "express";
import bcrypt from "bcrypt";
import UserService from "../../services/v1/user";
import generateToken from "../../universe/v1/libraries/token";
import Logger from "../../universe/v1/libraries/logger";

class UserController {
  static async signup(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      let userExists = await UserService.userExists(email);

      if (userExists) {
        return res.status(400).json({
          status: false,
          errors: [
            {
              param: "email",
              message: "User with this email address already exists.",
              code: "RESOURCE_EXISTS",
            },
          ],
        });
      }

      let user = await UserService.createUser(name, email, password);

      const token = await generateToken(user._id);

      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res
        .status(200)
        .cookie("access_token", token, options)
        .json({
          success: true,
          content: {
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
              created_at: user.created_at,
            },
            meta: { access_token: token },
          },
        });
    } catch (err) {
      Logger.instance.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async signin(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserService.userExists(email);

      if (!user) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              param: "email",
              message: "User does not exist",
              code: "DO_NOT_EXIST",
            },
          ],
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          errors: [
            {
              param: "password",
              message: "The credentials you provided are invalid",
              code: "INVALID_CREDENTIALS",
            },
          ],
        });
      }

      const token = await generateToken(user._id);

      const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      res
        .status(200)
        .cookie("access_token", token, options)
        .json({
          success: true,
          content: {
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
              createdAt: user.createdAt,
            },
            meta: { access_token: token },
          },
        });
    } catch (err) {
      Logger.instance.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async myProfile(req: Request, res: Response) {
    try {
      const user = await UserService.getUserById(req.user._id);

      res.status(200).json({
        success: true,
        content: {
          data: {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            createdAt: user?.createdAt,
          },
        },
      });
    } catch (err) {
      Logger.instance.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  static async signout(req: Request, res: Response) {
    try {
      res
        .status(200)
        .cookie("access_token", null, {
          expires: new Date(Date.now()),
          httpOnly: true,
        })
        .json({
          success: true,
          message: "Logged Out",
        });
    } catch (err) {
      Logger.instance.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }
}

export default UserController;
