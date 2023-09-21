import { Document, Types } from "mongoose";

export interface IMember extends Document {
  community: Types.ObjectId;
  user: Types.ObjectId;
  role: Types.ObjectId;
  createdAt?: number;
}
