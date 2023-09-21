import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../../models/User";

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

    const decoded = await jwt.verify(
      access_token,
      process.env.JWT_SECRET as string
    );

    // console.log(decoded);
    req.user = await User.findOne({ _id: decoded._id });
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: error.message,
    });
  }
};
