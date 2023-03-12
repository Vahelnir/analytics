import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import isURL from "validator/lib/isURL";
import { applicationToDto } from "../../../dto/application";
import { loggedProcedure, router } from "../../trpc";

export const userApplicationsRouter = router({
  all: loggedProcedure.query(async ({ ctx: { loggedUser } }) => {
    const currentUser = loggedUser.user;

    return currentUser.applications.map((app) => applicationToDto(app));
  }),
  find: loggedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx: { loggedUser }, input: { id } }) => {
      const currentUser = loggedUser.user;

      const application = currentUser.applications.id(id);
      if (!application) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `You do not own any application with the id ${id}`,
        });
      }

      return applicationToDto(currentUser.applications.id(id));
    }),
  new: loggedProcedure
    .input(
      z.object({
        name: z.string(),
        domain: z
          .string()
          .refine((str) =>
            isURL(str, { protocols: ["http", "https"], require_tld: false })
          ),
      })
    )
    .mutation(async ({ ctx: { loggedUser }, input: { name, domain } }) => {
      const currentUser = loggedUser.user;

      const application = currentUser.applications.create({
        name,
        domain,
        token: randomUUID(),
      });
      currentUser.applications.push(application);
      currentUser.save();

      return applicationToDto(application);
    }),
  delete: loggedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx: { loggedUser }, input: { id } }) => {
      const currentUser = loggedUser.user;
      currentUser.applications.pull(id);
      await currentUser.save();
      return true;
    }),
});
