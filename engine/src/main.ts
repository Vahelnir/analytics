import { customEmit } from "./event";
import { AnalyticsConfig, init } from "./init";

window.analytics = {
  emit: () => {
    throw new Error("run init() first");
  },
  init,
};

declare global {
  interface Window {
    analytics: {
      config?: AnalyticsConfig;
      emit: typeof customEmit;
      init: typeof init;
    };
  }
}
