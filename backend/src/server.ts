import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifyJwt } from "@fastify/jwt";
import mongoose from "mongoose";
import { appRouter, createContext } from "./trpc";
import { zodErrorHandler } from "./errorHandler/zodErrorHandler";
import { emitEventRoute } from "./route/emitEvent";

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
  database: string;
}

export async function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? "/trpc";
  const databaseUrl = opts.database;

  const server = fastify({ logger: dev });

  await Promise.all([
    server.register(fastifyTRPCPlugin, {
      prefix,
      trpcOptions: { router: appRouter, createContext },
    }),
    server.register(fastifyCors, {}),
    server.register(fastifyJwt, {
      // TODO: configure the secret in .env
      secret: "hello je suis secret",
    }),
    server.register(zodErrorHandler),
    server.register(emitEventRoute),
  ]);

  server.get("/", async () => {
    return { hello: "world" };
  });

  const stop = async () => {
    await server.close();
  };

  const start = async () => {
    try {
      await mongoose.connect(databaseUrl);
      await server.listen({ port });
      console.log("listening on port", port);
    } catch (err) {
      server.log.error(err);
      process.exit(1);
    }
  };

  return { server, start, stop };
}
