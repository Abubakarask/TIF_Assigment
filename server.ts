import express, { Request, Response } from "express";
import Cache from "./universe/v1/libraries/cache";
import FrameworkLoader from "./loaders/v1/framework";
import Logger from "./universe/v1/libraries/logger";
import Env from "./loaders/v1/env";
import BookRouter from "./api/v1/books";
import Database from "./loaders/v1/database";
import UserRouter from "./api/v1/user";
import RoleRouter from "./api/v1/role";
import CommunityRouter from "./api/v1/community";
import MemberRouter from "./api/v1/member";

const server = async (): Promise<express.Application> => {
  const app = express();

  //Loaders
  Env.Loader();
  Logger.Loader();
  // await Cache.Loader();
  await Database.Loader();
  FrameworkLoader(app);

  //Middlewares

  //Routes
  app.use("/api/v1/auth", UserRouter);
  app.use("/api/v1/book", BookRouter);
  app.use("/api/v1/role", RoleRouter);
  app.use("/api/v1/community", CommunityRouter);
  app.use("/api/v1/member", MemberRouter);
  return app;
};

export default server;
