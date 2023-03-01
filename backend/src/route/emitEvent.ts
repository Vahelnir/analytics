import { FastifyPluginAsync } from "fastify";
import { eventBodySchema } from "../dto";
import { Event, EventModel } from "../model/Event";

export const emitEventRoute: FastifyPluginAsync = async (server) => {
  server.post("/emitEvent", async (request) => {
    const input = eventBodySchema.parse(request.body);

    const ip = request.ip;
    const userAgent = request.headers["user-agent"] ?? "";
    const serverTime = new Date();

    const events = input.map(
      (event) =>
        ({
          ...event,
          clientTime: new Date(event.clientTime),
          ip,
          userAgent,
          serverTime,
        } satisfies Event)
    );
    await EventModel.insertMany(events);

    return true;
  });
};
