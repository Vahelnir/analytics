import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash, verify } from "argon2";
import { UserModel } from "../model/User";
import { userModelToUserOutput, UserOutput } from "../dto/user";
import { login, verifyToken } from "../service/user";
import { router, publicProcedure, loggedProcedure } from ".";

type AuthTokens = { refreshToken: string; accessToken: string };

export const user = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(
      async ({
        input: { email, password },
        ctx: { jwt },
      }): Promise<AuthTokens> => {
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Wrong email or password",
          });
        }

        const isPasswordValid = await verify(user.password, password);
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Wrong email or password",
          });
        }

        const { accessToken, refreshToken } = await login(jwt, user);
        return { accessToken, refreshToken };
      }
    ),
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        username: z.string(),
        password: z.string(),
      })
    )
    .mutation(
      async ({ input: { email, username, password } }): Promise<UserOutput> => {
        const res = await UserModel.findOne({ email });
        if (res) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exists",
          });
        }

        const newUser = await UserModel.create({
          email,
          username,
          password: await hash(password),
          applications: {},
          tokens: [],
        });
        return userModelToUserOutput(newUser);
      }
    ),
  refresh: publicProcedure
    .input(z.object({ refreshToken: z.string() }))
    .mutation(
      async ({
        input: { refreshToken: receivedRefreshToken },
        ctx: { jwt },
      }): Promise<AuthTokens> => {
        const decodedUser = verifyToken(jwt, receivedRefreshToken);
        const user = await UserModel.findOne({
          _id: decodedUser.id,
          tokens: { $elemMatch: { refreshToken: receivedRefreshToken } },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Refresh token not found",
          });
        }

        const { accessToken, refreshToken } = await login(jwt, user);
        return { accessToken, refreshToken };
      }
    ),
  authentication: loggedProcedure.query(() => ({ working: true })),
});
