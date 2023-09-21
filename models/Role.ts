import mongoose, { Schema, Model } from "mongoose";
import { IRole } from "../interfaces/v1/role";

const roleSchema: Schema<IRole> = new Schema<IRole>(
  {
    _id: { type: String, required: true },
    name: { type: String, unique: true },
  },
  { timestamps: true }
);

const Role: Model<IRole> = mongoose.model<IRole>("Role", roleSchema);

export { Role };
