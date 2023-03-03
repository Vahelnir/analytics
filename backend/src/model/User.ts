import { Schema, model, Types } from "mongoose";

export type User = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  applications: Map<string, { token: string; urls: string[] }>;
  tokens: { accessToken: string; refreshToken: string; expiresAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
};

export const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    applications: {
      type: Map,
      of: {
        token: { type: String, required: true },
        urls: { type: [String], required: true },
      },
      required: true,
    },
    tokens: {
      type: [
        {
          accessToken: { type: String, required: true },
          refreshToken: { type: String, required: true },
          expiresAt: { type: Date, required: true },
        },
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", UserSchema);
