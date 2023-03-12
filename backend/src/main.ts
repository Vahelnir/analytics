import { createServer } from "./server";
export type { AppRouter } from "./trpc";

console.log("NODE_ENV", process.env.NODE_ENV);
async function run() {
  const server = await createServer({
    dev: process.env.NODE_ENV !== "production",
    database:
      process.env.DATABASE_URL ||
      "mongodb://root:password@127.0.0.1:27017/analytics?authSource=admin",
  });

  await server.start();
  console.log("started!");
}

run();
