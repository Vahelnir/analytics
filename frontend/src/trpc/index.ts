import type { AppRouter } from "backend/types/trpc/router";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";
import { router } from "../router";
import { AuthTokens, getAuthTokens, setAuthTokens } from "../service/auth";
import { authLink } from "./link/authLink";

export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    authLink({
      ignore: ["api.user.refresh"],
      async refresh() {
        const { refreshToken: currentRefreshToken } = getAuthTokens();
        if (!currentRefreshToken) {
          return router.navigate("/login");
        }

        // cast as a type because TRPC currently has broken
        // types with the raw client when using the react client
        const tokens = await (
          trpcClient.mutation as (
            path: string,
            input: Record<string, string>
          ) => Promise<AuthTokens>
        )("api.user.refresh", { refreshToken: currentRefreshToken });
        setAuthTokens(tokens);
      },
    }),
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
