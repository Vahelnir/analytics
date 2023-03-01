import { inferAsyncReturnType } from "@trpc/server";
import { CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const jwt = req.server.jwt;
  return { jwt, req, res };
}

export type Context = inferAsyncReturnType<typeof createContext>;
