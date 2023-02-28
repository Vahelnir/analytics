import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  api: router({
    version: publicProcedure.query(() => {
      return { version: "0.42.0" };
    }),
    event: router({}),
  }),
});

export type AppRouter = typeof appRouter;
