import { JWT } from "@fastify/jwt";
import { initTRPC, TRPCError } from "@trpc/server";
import { FastifyRequest } from "fastify";
import superjson from "superjson";
import { UserModel } from "../model/User";
import { Context } from "./context";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape }) => shape,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const isAuthed = t.middleware(async ({ next, ctx: { jwt, req } }) => {
  const authorization = getAuthorizationHeader(req);
  const bearerToken = getBearerToken(authorization);
  const decodedUser = verifyToken(jwt, bearerToken);

  const user = await UserModel.findOne({ _id: decodedUser.id });
  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "no user associated with this token",
    });
  }

  const foundToken = user.tokens.find(({ jwt }) => jwt === bearerToken);
  if (!foundToken) {
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

function verifyToken(jwt: JWT, token: string) {
  let decodedUser = undefined;
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
  return decodedUser;
}
