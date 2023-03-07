import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { FastifyRequest } from "fastify";

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const jwt = req.server.jwt;
  const authorization = getAuthorizationHeader(req);
  const accessToken = getBearerToken(authorization ?? "");
  return { jwt, req, res, loggedUser: { accessToken } };
}

function getAuthorizationHeader(req: FastifyRequest) {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return;
  }

  return authorization;
}

function getBearerToken(authorization: string) {
  const [type, credentials] = authorization.split(" ");
  if (!type || !credentials || type.toLocaleLowerCase() !== "bearer") {
    return;
  }

  return credentials;
}

export type Context = inferAsyncReturnType<typeof createContext>;
