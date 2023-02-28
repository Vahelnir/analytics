import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import mongoose from "mongoose";
import cors from "@fastify/cors";

import { appRouter } from "./router";

export interface ServerOptions {
  dev?: boolean;
  port?: number;
  prefix?: string;
  database: string;
}

export function createServer(opts: ServerOptions) {
  const dev = opts.dev ?? true;
  const port = opts.port ?? 3000;
  const prefix = opts.prefix ?? "/trpc";
  const databaseUrl = opts.database;

  const server = fastify({ logger: dev });

  server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: { router: appRouter },
  });

  server.register(cors, {});

  server.get("/", async () => {
    return { hello: "wait-on 💨" };
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
