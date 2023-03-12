import UAParser from "ua-parser-js";
import { z } from "zod";
import { EventModel } from "../../../model/Event";
import { loggedProcedure } from "../../trpc";

export const mostUsedPeripherals = loggedProcedure
  .input(
    z.object({
      id: z.string(),
      range: z.object({ gte: z.date(), lte: z.date() }),
    })
  )
  .query(
    async ({
      input: {
        id,
        range: { gte, lte },
      },
    }) => {
      const t = await EventModel.aggregate<{
        _id: { userAgent: string };
        total: number;
      }>([
        {
          $match: {
            applicationId: id,
            clientTime: {
              $gte: gte,
              $lt: lte,
            },
          },
        },
        {
          $group: {
            _id: {
              ip: "$ip",
              userAgent: "$userAgent",
            },
          },
        },
        {
          $group: {
            _id: {
              userAgent: "$_id.userAgent",
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]).limit(10);
      return t.map((data) => ({
        agent: new UAParser(data._id.userAgent).getResult(),
        total: data.total,
      }));
    }
  );
