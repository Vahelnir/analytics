import { Schema, model, Types, Model } from "mongoose";
import { Application, ApplicationSchema } from "./Application";

export type User = {
  _id: Types.ObjectId;
  username: string;
  password: string;
  email: string;
  applications: Application[];
  tokens: { accessToken: string; refreshToken: string; expiresAt: Date }[];
  createdAt: Date;
  updatedAt: Date;
};

type UserDocumentProps = {
  applications: Types.DocumentArray<Application>;
};
export type UserModel = Model<User, object, UserDocumentProps>;

export const UserSchema = new Schema<User, UserModel>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    applications: {
      type: [ApplicationSchema],
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

export const UserModel = model<User, UserModel>("User", UserSchema);
