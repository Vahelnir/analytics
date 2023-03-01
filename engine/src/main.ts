import { customEmit } from "./event";
import { run } from "./run";

window.analytics = { emit: customEmit, run };

declare global {
  interface Window {
    analytics: {
      emit: typeof customEmit;
      run: typeof run;
    };
  }
}
