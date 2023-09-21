import Cache from "./universe/v1/libraries/cache";
import express, { Request, Response, NextFunction } from "express";
import server from "./server";
import Logger from "./universe/v1/libraries/logger";

const PORT = process.env.PORT
console.log("Port - ", process.env.PORT);

/*
(async () => {
  await Cache.Loader();
})(); */

(async () => {
  const app = await server();

  app.listen(PORT, () => {
    Logger.instance.info(`Server running on PORT : ${PORT}`);
  });
})();