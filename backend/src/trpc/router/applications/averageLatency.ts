import { z } from "zod";
import { EventModel } from "../../../model/Event";
import { loggedProcedure } from "../../trpc";

export const averageLatency = loggedProcedure
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
        _id: { year: number; month: number };
        latency: number;
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
              year: { $year: "$clientTime" },
              month: { $month: "$clientTime" },
            },
            latency: {
              $avg: {
                $dateDiff: {
                  startDate: "$clientTime",
                  endDate: "$serverTime",
                  unit: "second",
                },
              },
            },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]).limit(10);
      return t.map((data) => ({
        month: data._id.month,
        year: data._id.year,
        latency: data.latency,
      }));
    }
  );
