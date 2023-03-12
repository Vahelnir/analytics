import { z } from "zod";
import { EventModel } from "../../../model/Event";
import { loggedProcedure } from "../../trpc";

export const mostUsedSizes = loggedProcedure
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
        _id: { size: { width: number; height: number } };
        total: number;
      }>([
        {
          $match: {
            applicationId: id,
            clientTime: {
              $gte: gte,
              $lt: lte,
            },
            event: "resize",
          },
        },
        {
          $group: {
            _id: {
              size: "$data",
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]).limit(10);
      return t.map((data) => ({
        size: data._id.size,
        total: data.total,
      }));
    }
  );
