import type { AppRouter } from "backend/types/trpc/router";
import {
  Observable,
  observable,
  Observer,
  share,
  Unsubscribable,
} from "@trpc/server/observable";
import { TRPCLink } from "@trpc/react-query";

export type AuthLinkOptions = {
  ignore: string[];
  refresh: () => Promise<void>;
  onFailedRefresh: (error: unknown) => Promise<void>;
};

export function authLink({
  ignore,
  refresh,
  onFailedRefresh,
}: AuthLinkOptions): TRPCLink<AppRouter> {
  return () => {
    let isRefreshing = false;
    let currentRefresh$: Observable<unknown, unknown> | null = null;

    function refreshToken() {
      isRefreshing = true;
      const cleanup = () => {
        isRefreshing = false;
        currentRefresh$ = null;
      };
      currentRefresh$ = observable((observer) => {
        refresh()
          .then(() => {
            observer.complete();
            cleanup();
          })
          .catch(async (error) => {
            onFailedRefresh(error);
            cleanup();
          });
      }).pipe(share());
    }

    return ({ next, op }) => {
      function sendNextOperation(observer: Observer<unknown, unknown>) {
        return next(op).subscribe({
          next: observer.next,
          complete: observer.complete,
          async error(error) {
            if (error.data?.code === "UNAUTHORIZED" && !isRefreshing) {
              refreshToken();
            }
            observer.error(error);
          },
        });
      }

      function sendNextOperationObservable() {
        return observable((observer) => sendNextOperation(observer));
      }

      // allow some requests to not wait the refresh
      if (ignore.includes(op.path)) {
        return sendNextOperationObservable();
      }

      // wait for the current refresh to be done
      if (isRefreshing && currentRefresh$) {
        return observable((observer: Observer<unknown, unknown>) => {
          const sendNextOp = () => {
            unsubscribeNextOp = sendNextOperation(observer);
          };
          let unsubscribeNextOp: Unsubscribable | null = null;
          const unsubscribeCurrentRefresh = currentRefresh$?.subscribe({
            complete: () => sendNextOp(),
            error: () => sendNextOp(),
          });
          return () => {
            unsubscribeCurrentRefresh?.unsubscribe();
            unsubscribeNextOp?.unsubscribe();
          };
        });
      }

      return sendNextOperationObservable();
    };
  };
}
