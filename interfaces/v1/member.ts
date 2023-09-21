import { Document } from "mongoose";

export interface IMember extends Document {
  _id: string;
  community: string;
  user: string;
  role: string;
  created_at?: Date;
}
