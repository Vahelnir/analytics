import { debounce } from "throttle-debounce";

import { getElementCSSSelector } from "./element";
import { customEmit, emit } from "./event";

export type AnalyticsConfig = { applicationId: string };

export function init(config: AnalyticsConfig) {
  window.analytics.config = config;
  window.analytics.emit = customEmit;
  document.addEventListener("click", (event) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }
    const element = event.target;
    const selector = getElementCSSSelector(element);
    emit("click", {
      selector,
      innerText: element.innerText.slice(0, 100),
    });
  });

  window.addEventListener(
    "resize",
    debounce(250, () => {
      emit("resize", {
        height: window.innerHeight,
        width: window.innerWidth,
      });
    })
  );
}
