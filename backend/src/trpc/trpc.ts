import { JWT } from "@fastify/jwt";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { UserModel } from "../model/User";
import { verifyToken } from "../service/user";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape }) => shape,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(
  async ({
    next,
    ctx: {
      jwt,
      loggedUser: { accessToken },
    },
  }) => {
    if (!accessToken) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "invalid access token",
      });
    }
    const decodedUser = verifyAccessTokenToken(jwt, accessToken);

    const user = await UserModel.findOne({
      _id: decodedUser.id,
      tokens: { $elemMatch: { accessToken } },
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "no user associated with this token",
      });
    }

    return next({
      ctx: { user },
    });
  }
);
export const loggedProcedure = t.procedure.use(isAuthed);

function verifyAccessTokenToken(jwt: JWT, token: string) {
  const decodedUser = verifyToken(jwt, token);
  return decodedUser;
}
