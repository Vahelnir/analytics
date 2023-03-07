import { z } from "zod";

const baseEventInputSchema = z.object({
  event: z.string(),
  data: z.record(z.any()),
  clientTime: z.string().datetime(),
  isCustom: z.boolean(),
  applicationId: z.string().uuid(),
});

export const clickEventInputSchema = baseEventInputSchema.extend({
  event: z.literal("click"),
  data: z.object({
    selector: z.string(),
    innerText: z.string(),
  }),
});

export const resizeEventInputSchema = baseEventInputSchema.extend({
  event: z.literal("resize"),
  data: z.object({
    width: z.number(),
    height: z.number(),
  }),
});

export const customEventInputSchema = baseEventInputSchema.extend({
  isCustom: z.literal(true),
});

export const eventBodySchema = z.array(
  z.union([
    clickEventInputSchema,
    resizeEventInputSchema,
    customEventInputSchema,
  ])
);

export type BaseEventInput = z.infer<typeof baseEventInputSchema>;
export type ClickEventInput = z.infer<typeof clickEventInputSchema>;
export type ResizeEventInput = z.infer<typeof resizeEventInputSchema>;
export type CustomEventInput = z.infer<typeof customEventInputSchema>;
export type EventInput = z.infer<typeof eventBodySchema>;
