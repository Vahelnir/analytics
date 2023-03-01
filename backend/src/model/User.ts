import { Schema, model } from "mongoose";

export type UserApplication = Record<string, { token: string; urls: string[] }>;

export type User = {
  username: string;
  password: string;
  email: string;
  createdAt: Date;
  editedAt: Date;
  applications: UserApplication;
  tokens: { jwt: string; refresh: string }[];
};

export const UserSchema = new Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, required: true },
  editedAt: { type: Date, required: true },
  applications: {
    type: Map,
    of: {
      token: { type: String, required: true },
      urls: { type: [String], required: true },
    },
    required: true,
  },
});

export const UserModel = model<User>("User", UserSchema);
