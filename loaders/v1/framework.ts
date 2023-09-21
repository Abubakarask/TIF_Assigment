import helmet from "helmet";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

const FrameworkLoader = (app: express.Application) => {
  app.use(helmet());
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
};

export default FrameworkLoader;
