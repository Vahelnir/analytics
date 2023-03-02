import { useState } from "react";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc, trpcClient } from "./trpc";
import { router } from "./router";

export function App() {
  const [client] = useState(() => trpcClient);
  // as never because react-query is apparently using deprecated types
  const [queryClient] = useState(() => new QueryClient());
  return (
    <div className="App">
      <trpc.Provider client={client} queryClient={queryClient}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </trpc.Provider>
    </div>
  );
}
