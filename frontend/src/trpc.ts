import type { AppRouter } from "backend/types/trpc/router";
import { observable } from "@trpc/server/observable";
import { createTRPCReact, httpBatchLink, TRPCLink } from "@trpc/react-query";
import superjson from "superjson";
import { AuthTokens, getAuthTokens, setAuthTokens } from "./service/auth";

export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    refetchLink(),
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

function refetchLink(): TRPCLink<AppRouter> {
  return () => {
    // here we just got initialized in the app - this happens once per app
    // useful for storing cache for instance
    return ({ next, op }) => {
      // this is when passing the result to the next link
      // each link needs to return an observable which propagates results
      return observable((observer) => {
        console.log("performing operation:", op);
        const unsubscribe = next(op).subscribe({
          next(value) {
            console.log("we received value", value);
            observer.next(value);
          },
          async error(error) {
            if (error.data?.code !== "UNAUTHORIZED") {
              observer.error(error);
              return;
            }

            const { refreshToken: currentRefreshToken } = getAuthTokens();
            console.log(
              "we received error",
              error,
              "refresh:",
              currentRefreshToken
            );
            if (!currentRefreshToken) {
              observer.error(error);
              return;
            }

            console.log("should refetch");
            // cast as a type because TRPC currently has broken
            // types with the raw client when using the react client
            const tokens = await (
              trpcClient.mutation as (
                path: string,
                input: Record<string, string>
              ) => Promise<AuthTokens>
            )("api.user.refresh", { refreshToken: currentRefreshToken });
            setAuthTokens(tokens);
            observer.error(error);
          },
          complete() {
            observer.complete();
          },
        });
        return unsubscribe;
      });
    };
  };
}
