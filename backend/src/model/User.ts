import { Schema, model, Types, InferSchemaType } from "mongoose";

export const UserSchema = new Schema(
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

export type User = InferSchemaType<typeof UserSchema> & { _id: Types.ObjectId };

export const UserModel = model("User", UserSchema);
