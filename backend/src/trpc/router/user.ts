import { router } from "../trpc";
import { userApplicationsRouter } from "./user/applications";

export const userRouter = router({
  applications: userApplicationsRouter,
});
