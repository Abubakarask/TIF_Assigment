import mongoose, { Schema, Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUser } from "../interfaces/v1/user";
import Env from "../loaders/v1/env";

interface IUserModel extends Model<IUser> {
  matchPassword(password: string): Promise<boolean>;
  generateToken(): string;
}

const userSchema = new Schema<IUser, IUserModel>({
  _id: { type: String, required: true },

  name: {
    type: String,
    default: null,
  },

  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre<IUser>("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

userSchema.methods.generateToken = function (this: IUser): string {
  return jwt.sign({ _id: this._id }, Env.variable.JWT_SECRET as string);
};

const User = mongoose.model<IUser, IUserModel>("User", userSchema);

export { User };
