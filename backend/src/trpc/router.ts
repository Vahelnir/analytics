import { publicProcedure, router } from "./trpc";
import { user } from "./user";

export const appRouter = router({
  api: router({
    version: publicProcedure.query(() => {
      return { version: "0.42.0" };
    }),
    user,
  }),
});

export type AppRouter = typeof appRouter;
