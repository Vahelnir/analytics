import { JWT } from "@fastify/jwt";
import { HydratedDocument } from "mongoose";
import { User } from "../model/User";

export async function login(jwt: JWT, user: HydratedDocument<User>) {
  const accessToken = jwt.sign({ id: user._id }, { expiresIn: "1h" });

  user.tokens.push({ jwt: accessToken, refresh: " " });
  await user.save();
  return { accessToken };
}
