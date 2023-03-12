import { Schema, Types } from "mongoose";

export type Application = {
  _id: Types.ObjectId;
  name: string;
  token: string;
  domain: string;
};

export const ApplicationSchema = new Schema<Application>({
  name: { type: String, required: true },
  token: { type: String, required: true },
  domain: { type: String, required: true },
});
