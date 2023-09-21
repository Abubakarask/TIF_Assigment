import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/v1/user";
import Env from "../loaders/v1/env";

interface IUserModel extends Model<IUser> {
  generateToken(): string;
}

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
  },

  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
