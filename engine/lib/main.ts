import { emit } from "./event";
import { run } from "./run";

window.analytics = { emit, run };

declare global {
  interface Window {
    analytics: { emit: typeof emit; run: typeof run };
  }
}
