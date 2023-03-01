import { FastifyPluginAsync } from "fastify";
import { ZodError } from "zod";

export const zodErrorHandler: FastifyPluginAsync = async (server) => {
  server.setErrorHandler((error, _request, reply) => {
    if (!(error instanceof ZodError)) {
      reply.send(error);
      return;
    }
    reply.status(400).send(JSON.parse(error.message));
  });
};
