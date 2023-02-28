import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import cors from "@fastify/cors";
import mongoose from "mongoose";
import { z, ZodError } from "zod";

import { appRouter } from "./router";

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

  await server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: { router: appRouter },
  });

  await server.register(cors, {});

  server.get("/", async () => {
    return { hello: "wait-on 💨" };
  });

  const eventBodySchema = z.object({
    event: z.string(),
  });
  type EventBody = z.infer<typeof eventBodySchema>;
  server.post("/emitEvent", async (request, response) => {
    const body = eventBodySchema.parse(request.body);

    return {};
  });

  server.setErrorHandler((error, _request, reply) => {
    if (!(error instanceof ZodError)) {
      reply.send(error);
      return;
    }
    reply.status(403).send(JSON.parse(error.message));
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
