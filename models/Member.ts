import mongoose, { Schema, Model } from "mongoose";
import { IMember } from "../interfaces/v1/member";

const memberSchema: Schema<IMember> = new Schema<IMember>({
  community: { type: Schema.Types.ObjectId, ref: "Community" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  role: { type: Schema.Types.ObjectId, ref: "Role" },
  createdAt: { type: Date, default: Date.now },
});

const Member: Model<IMember> = mongoose.model<IMember>("Member", memberSchema);

export { Member };
