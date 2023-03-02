import { User } from "../model/User";
import { AuthTokens } from "../service/user";

export type UserOutput = Omit<User, "applications" | "tokens">;
export type UserWithTokensOutput = UserOutput & AuthTokens;

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
