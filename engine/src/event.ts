import { debounce } from "throttle-debounce";
import type {
  BaseEventInput,
  ClickEventInput,
  ResizeEventInput,
} from "backend/types/dto";

interface EventTypes {
  click: ClickEventInput["data"];
  resize: ResizeEventInput["data"];
}

let eventBatch: BaseEventInput[] = [];

export function emit<T extends keyof EventTypes>(
  event: T,
  data: EventTypes[T],
  isCustom?: boolean
): void;
export function emit(
  event: string,
  data: Record<string, unknown>,
  isCustom = false
): void {
  const config = window.analytics.config;
  eventBatch.push({
    event,
    data,
    clientTime: new Date().toJSON(),
    isCustom,
    applicationId: config?.applicationId ?? "",
  });
  sendEventBatch();
}

export const customEmit: typeof emit = (event, data) => emit(event, data, true);

const sendEventBatch = debounce(500, rawSendEventBatch);

async function rawSendEventBatch() {
  console.log("sending batch", eventBatch);

  // TODO: make the API's URL configurable
  try {
    await fetch("http://localhost:3000/emitEvent", {
      method: "POST",
      body: JSON.stringify(eventBatch),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    });
    eventBatch = [];
  } catch (err) {
    // retry next time
  }
}
