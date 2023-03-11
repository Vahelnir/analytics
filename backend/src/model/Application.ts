import { Schema, Types } from "mongoose";

export type Application = {
  _id: Types.ObjectId;
  name: string;
  token: string;
  urls: string[];
};

export const ApplicationSchema = new Schema<Application>({
  name: { type: String, required: true },
  token: { type: String, required: true },
  urls: { type: [String], required: true },
});
