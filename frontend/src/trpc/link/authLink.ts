import type { AppRouter } from "backend/types/trpc/router";
import { Observable, observable } from "@trpc/server/observable";
import { TRPCLink } from "@trpc/react-query";

export type AuthLinkOptions = {
  ignore: string[];
  refresh: () => Promise<unknown> | undefined;
};

export function authLink({
  ignore,
  refresh,
}: AuthLinkOptions): TRPCLink<AppRouter> {
  return () => {
    let isRefreshing = false;
    let currentRefresh$: Observable<unknown, unknown> | null = null;

    async function refreshToken() {
      isRefreshing = true;
      await refresh();
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
