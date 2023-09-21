import { Document } from "mongoose";

export interface ICommunity extends Document {
  name: string | null;
  slug: string;
  owner: string;
  created_at?: Date;
  updated_at?: Date;
}
