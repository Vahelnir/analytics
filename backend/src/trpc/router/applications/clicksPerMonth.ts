import { z } from "zod";
import { EventModel } from "../../../model/Event";
import { loggedProcedure } from "../../trpc";

export const clicksPerMonth = loggedProcedure
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
        total: number;
      }>([
        {
          $match: {
            applicationId: id,
            clientTime: {
              $gte: gte,
              $lt: lte,
            },
            event: "click",
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$clientTime" },
              month: { $month: "$clientTime" },
            },
            total: { $sum: 1 },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 },
        },
      ]);
      return t.map((data) => ({
        year: data._id.year,
        month: data._id.month,
        total: data.total,
      }));
    }
  );
