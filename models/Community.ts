import mongoose, { Schema, Model } from "mongoose";
import { ICommunity } from "../interfaces/v1/community";

const communitySchema: Schema<ICommunity> = new Schema<ICommunity>(
  {
    _id: { type: String, required: true },
    name: { type: String, default: null },
    slug: { type: String, unique: true },
    owner: { type: String, ref: "User" },
  },
  { timestamps: true }
);

const Community: Model<ICommunity> = mongoose.model<ICommunity>(
  "Community",
  communitySchema
);

export { Community };
