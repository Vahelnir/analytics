import { debounce } from "throttle-debounce";

import { getElementCSSSelector } from "./element";
import { emit } from "./event";

export function run() {
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
