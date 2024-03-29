import type { AppRouter } from "backend/types/trpc/router";
import { createTRPCReact, httpBatchLink } from "@trpc/react-query";
import superjson from "superjson";
import { router } from "../router";
import { AuthTokens, getAuthTokens, setAuthTokens } from "../service/auth";
import { authLink } from "./link/authLink";

function redirectToLogin() {
  return router.navigate("/login");
}

const refreshEndpoint = "api.auth.refresh";

export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    authLink({
      ignore: [refreshEndpoint],
      async refresh() {
        const { refreshToken: currentRefreshToken } = getAuthTokens();
        if (!currentRefreshToken) {
          throw new Error("no refresh token");
        }

        // cast as a type because TRPC currently has broken
        // types with the raw client when using the react client
        const tokens = await (
          trpcClient.mutation as (
            path: string,
            input: Record<string, string>
          ) => Promise<AuthTokens>
        )(refreshEndpoint, { refreshToken: currentRefreshToken });
        setAuthTokens(tokens);
      },
      onFailedRefresh: (error) => {
        console.error(error);
        return redirectToLogin();
      },
    }),
    httpBatchLink({
      url: "http://localhost:3000/trpc",
      // Not sure what exact value to put here :shrug:
      maxURLLength: 880,
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
