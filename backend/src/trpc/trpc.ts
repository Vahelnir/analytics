import { JWT } from "@fastify/jwt";
import { initTRPC, TRPCError } from "@trpc/server";
import { FastifyRequest } from "fastify";
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

const isAuthed = t.middleware(async ({ next, ctx: { jwt, req } }) => {
  const authorization = getAuthorizationHeader(req);
  const accessToken = getBearerToken(authorization);
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
});
export const loggedProcedure = t.procedure.use(isAuthed);

function getAuthorizationHeader(req: FastifyRequest) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "no authorization header found",
    });
  }

  return authorization;
}

function getBearerToken(authorization: string) {
  const [type, credentials] = authorization.split(" ");
  if (!type || !credentials || type.toLocaleLowerCase() !== "bearer") {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "invalid authorization header",
    });
  }

  return credentials;
}

function verifyAccessTokenToken(jwt: JWT, token: string) {
  const decodedUser = verifyToken(jwt, token);
  return decodedUser;
}
