import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { trpc } from "./trpc";

async function test() {
  await trpc.api.version.query();
}

test();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
