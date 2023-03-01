import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import type { AppRouter } from "backend/types/trpc/router";

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer: superjson,
  links: [
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      headers() {
        const accessToken = localStorage.getItem("accessToken");
        let authorization = undefined;
        if (accessToken) {
          authorization = "Bearer " + localStorage.getItem("accessToken");
        }
        return {
          Authorization: authorization,
        };
      },
    }),
  ],
});
