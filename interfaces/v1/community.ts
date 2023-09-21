import { Document, Types } from "mongoose";

export interface ICommunity extends Document {
  name: string;
  slug: string;
  owner: Types.ObjectId;
  createdAt?: number;
  updatedAt?: number;
}
