import { User } from "../model/User";

export type UserOutput = Omit<User, "applications" | "tokens">;

export function userModelToUserOutput({
  _id,
  username,
  password,
  email,
  createdAt,
  updatedAt,
}: User): UserOutput {
  return { _id, username, password, email, createdAt, updatedAt };
}
