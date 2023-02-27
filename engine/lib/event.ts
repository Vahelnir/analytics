interface EventTypes {
  click: { selector: string; innerText: string };
  resize: { width: number; height: number };
}

export function emit<T extends keyof EventTypes>(name: T, data: EventTypes[T]) {
  console.log("sending event", name, "with data", data);
  // fetch("");
}
