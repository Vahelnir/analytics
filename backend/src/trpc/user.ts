import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { hash } from "argon2";
import { User, UserModel } from "../model/User";
import { userModelToUserOutput, UserOutput } from "../dto/user";
import { router, publicProcedure } from ".";

export const user = router({
  login: publicProcedure.query(async (): Promise<User> => {
    const res = await UserModel.findOne({});
    if (!res) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }
    return res;
  }),
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
});
