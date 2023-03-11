import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { applicationToDto } from "../../../dto/application";
import { loggedProcedure, router } from "../../trpc";

export const userApplicationsRouter = router({
  all: loggedProcedure.query(async ({ ctx: { loggedUser } }) => {
    const currentUser = loggedUser.user;

    return currentUser.applications.map(applicationToDto);
  }),
  find: loggedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx: { loggedUser }, input: { id } }) => {
      const currentUser = loggedUser.user;

      const application = currentUser.applications.id(id);
      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `You do not own any application with the id ${id}`,
        });
      }

      return currentUser.applications.id(id);
    }),
});
