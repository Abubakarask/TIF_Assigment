import { Document, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Number;
}

export interface DataStoredInToken {
  _id: Types.ObjectId;
}
