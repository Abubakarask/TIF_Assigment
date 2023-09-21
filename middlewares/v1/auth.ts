import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserService from "../../services/v1/user";
import { DataStoredInToken } from "../../interfaces/v1/user";
import { ObjectId } from "mongodb";
import Logger from "../../universe/v1/libraries/logger";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // console.log(req.cookies);
    const { access_token } = req.cookies;

    if (!access_token) {
      return res.status(401).json({
        message: "Please login first",
      });
    }

    const decoded: any = jwt.verify(
      access_token,
      process.env.JWT_SECRET as string
    );

    console.log(decoded, typeof decoded._id);

    // Retrieve the user from the database based on the ObjectId
    req.user = await UserService.getUserById(new ObjectId(decoded._id));

    next();
  } catch (err) {
    Logger.instance.error(err);
    res.status(500).json({
      message: err.message,
    });
  }
};
