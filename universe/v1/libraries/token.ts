import jwt from "jsonwebtoken";
import Env from "../../../loaders/v1/env";
import { ObjectId } from "mongodb";

const generateToken = async (id: ObjectId): Promise<string> => {
  const token = jwt.sign(
    {
      _id: id,
    },
    Env.variable.JWT_SECRET as string
  );

  return token;
};

export default generateToken;
