import { createServer } from "./server";

export type { AppRouter } from "./router";

async function run() {
  const server = await createServer({
    database:
      "mongodb://root:password@127.0.0.1:27017/analytics?authSource=admin",
  });

  await server.start();
}

run();
