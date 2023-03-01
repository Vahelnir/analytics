import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash, verify } from "argon2";
import { UserModel } from "../model/User";
import { userModelToUserOutput, UserOutput } from "../dto/user";
import { login } from "../service/user";
import { router, publicProcedure, loggedProcedure } from ".";

export const user = router({
  login: publicProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(
      async ({
        input: { email, password },
        ctx: { jwt },
      }): Promise<{ accessToken: string }> => {
        const user = await UserModel.findOne({ email });
        if (!user) {
          throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        const isPasswordValid = await verify(user.password, password);
        if (!isPasswordValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Wrong email or password",
          });
        }

        const { accessToken } = await login(jwt, user);
        return { accessToken };
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
  authentication: loggedProcedure.query(() => ({ working: true })),
});
