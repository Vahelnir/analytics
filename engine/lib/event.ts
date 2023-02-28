import { debounce } from "throttle-debounce";

interface EventTypes {
  click: { selector: string; innerText: string };
  resize: { width: number; height: number };
}

let eventBatch: unknown[] = [];

export function emit<T extends keyof EventTypes>(
  event: T,
  data: EventTypes[T]
) {
  eventBatch.push({ event, ...data, time: Date.now() });
  sendEventBatch();
}

const sendEventBatch = debounce(500, rawSendEventBatch);

function rawSendEventBatch() {
  console.log("sending batch", eventBatch);
  eventBatch = [];
  // fetch()
}
