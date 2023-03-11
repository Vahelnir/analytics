import { publicProcedure, router } from "./trpc";
import { authRouter } from "./router/auth";
import { userRouter } from "./router/user";

export const appRouter = router({
  api: router({
    version: publicProcedure.query(() => {
      return { version: "0.42.0" };
    }),
    auth: authRouter,
    user: userRouter,
  }),
});

export type AppRouter = typeof appRouter;
