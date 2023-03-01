import { Schema, model } from "mongoose";

type BaseEvent<
  E extends string,
  D extends Record<string, unknown>,
  C extends boolean = false
> = {
  event: E;
  data: D;
  clientTime: Date;
  serverTime: Date;
  ip: string;
  userAgent: string;
  isCustom: C;
};

export type ClickEvent = BaseEvent<
  "click",
  { selector: string; innerText: string }
>;

export type ResizeEvent = BaseEvent<
  "resize",
  { width: number; height: number }
>;

export type CustomEvent = BaseEvent<string, Record<string, unknown>, true>;

export type Event = CustomEvent | ResizeEvent | ClickEvent;

export const EventSchema = new Schema<Event>({
  event: {
    type: String,
    required: true,
  },
  data: { type: {}, required: true },
  clientTime: { type: Date, required: true },
  serverTime: { type: Date, required: true },
  userAgent: { type: String, required: true },
  ip: { type: String, required: true },
  isCustom: { type: Boolean, required: true },
});

export const EventModel = model<Event>("Event", EventSchema);
