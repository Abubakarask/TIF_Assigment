import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string | null;
  email: string;
  password: string;
  created_at: Date;
}
