import { publicProcedure, router } from "./trpc";
import { authRouter } from "./router/auth";
import { userRouter } from "./router/user";
import { applicationRouter } from "./router/applications";

export const appRouter = router({
  api: router({
    version: publicProcedure.query(() => {
      return { version: "0.42.0" };
    }),
    auth: authRouter,
    user: userRouter,
    applications: applicationRouter,
  }),
});

export type AppRouter = typeof appRouter;
