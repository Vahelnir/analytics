import { z } from "zod";
import { EventModel } from "../../../model/Event";
import { loggedProcedure } from "../../trpc";

export const mostClickedElements = loggedProcedure
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
        _id: { selector: string };
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
              selector: "$data.selector",
            },
            total: { $sum: 1 },
          },
        },
        { $sort: { total: -1 } },
      ]).limit(5);
      return t.map((data) => ({
        selector: data._id.selector,
        total: data.total,
      }));
    }
  );
