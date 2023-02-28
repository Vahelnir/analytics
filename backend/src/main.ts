import { createServer } from "./server";

async function run() {
  const server = createServer({
    database: "mongodb://127.0.0.1:27017/analytics",
  });

  await server.start();
}

run();
