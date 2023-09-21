import mongoose, { Schema, Model } from "mongoose";
import { IMember } from "../interfaces/v1/member";

const memberSchema: Schema<IMember> = new Schema<IMember>({
  _id: { type: String, required: true },
  community: { type: String, ref: "Community" },
  user: { type: String, ref: "User" },
  role: { type: String, ref: "Role" },
  created_at: { type: Date, default: Date.now },
});

const Member: Model<IMember> = mongoose.model<IMember>("Member", memberSchema);

export { Member };
