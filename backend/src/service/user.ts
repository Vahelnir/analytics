import { JWT } from "@fastify/jwt";
import { TRPCError } from "@trpc/server";
import { HydratedDocument } from "mongoose";
import { User } from "../model/User";

const REFRESH_TOKEN_EXPIRE = 60 * 60 * 24 * 7; // 7j
const ACCESS_TOKEN_EXPIRE = 60 * 20; // 20m

export async function login(jwt: JWT, user: HydratedDocument<User>) {
  const now = new Date();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE * 1000);
  const accessToken = jwt.sign(
    { id: user._id },
    { expiresIn: ACCESS_TOKEN_EXPIRE }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    { expiresIn: REFRESH_TOKEN_EXPIRE }
  );

  // remove every expired access/refresh token couple
  const tokens = user.tokens.filter(({ expiresAt }) => expiresAt <= now);
  tokens.push({ accessToken, refreshToken, expiresAt });
  user.tokens = tokens;
  await user.save();
  return { accessToken, refreshToken };
}

export async function refresh(
  jwt: JWT,
  refreshToken: string,
  user: HydratedDocument<User>
) {
  // invalidate the current refresh token and its related access token
  user.tokens = user.tokens.filter(
    (tokenEntry) => tokenEntry.refreshToken !== refreshToken
  );

  // re-login
  return login(jwt, user);
}

export function verifyToken(jwt: JWT, token: string) {
  let decodedUser;
  try {
    // TODO: see if this is also checking if the token has been expired
    decodedUser = jwt.verify(token);
  } catch (err) {
    // ignore error
  }
  if (
    !decodedUser ||
    typeof decodedUser !== "object" ||
    !("id" in decodedUser) ||
    typeof decodedUser.id !== "string"
  ) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "no user associated with this token",
    });
  }
  return { id: decodedUser.id };
}
