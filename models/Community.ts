import mongoose, { Schema, Model } from "mongoose";
import { ICommunity } from "../interfaces/v1/community";

const communitySchema: Schema<ICommunity> = new Schema<ICommunity>(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    owner: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Community: Model<ICommunity> = mongoose.model<ICommunity>(
  "Community",
  communitySchema
);

export { Community };
