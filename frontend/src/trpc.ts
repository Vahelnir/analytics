import type { AppRouter } from "backend/types/trpc/router";
import { Observable, observable } from "@trpc/server/observable";
import { createTRPCReact, httpBatchLink, TRPCLink } from "@trpc/react-query";
import superjson from "superjson";
import { AuthTokens, getAuthTokens, setAuthTokens } from "./service/auth";
import { router } from "./router";

export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
  transformer: superjson,
  links: [
    authLink({ ignore: ["api.user.refresh"], redirect: "/login" }),
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

function authLink({
  ignore,
  redirect,
}: {
  ignore: string[];
  redirect: string;
}): TRPCLink<AppRouter> {
  return () => {
    let isRefreshing = false;
    let currentRefresh$: Observable<unknown, unknown> | null = null;
    async function refreshToken() {
      const { refreshToken: currentRefreshToken } = getAuthTokens();
      if (!currentRefreshToken) {
        return router.navigate(redirect);
      }

      console.log("refreshing the tokens");
      // cast as a type because TRPC currently has broken
      // types with the raw client when using the react client
      isRefreshing = true;
      const tokens = await (
        trpcClient.mutation as (
          path: string,
          input: Record<string, string>
        ) => Promise<AuthTokens>
      )("api.user.refresh", { refreshToken: currentRefreshToken });
      setAuthTokens(tokens);
      isRefreshing = false;
      currentRefresh$ = null;
    }

    return ({ next, op }) => {
      function performRequest() {
        return observable((observer) => {
          const unsubscribe = next(op).subscribe({
            next: observer.next,
            complete: observer.complete,
            async error(error) {
              if (error.data?.code === "UNAUTHORIZED" && !isRefreshing) {
                refreshToken();
              }
              observer.error(error);
            },
          });
          return unsubscribe;
        });
      }

      // allow some requests to not wait the refresh
      if (ignore.includes(op.path)) {
        currentRefresh$ = performRequest();
        return currentRefresh$;
      }

      // wait for the current refresh to be done
      if (isRefreshing && currentRefresh$) {
        return observable((observer) =>
          currentRefresh$?.subscribe({
            complete: () => next(op).subscribe(observer),
          })
        );
      }

      return performRequest();
    };
  };
}
