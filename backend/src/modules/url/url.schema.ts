import z from "zod";

export const urlSchema = z
  .object({
    originalUrl: z.url({
      protocol: /^https?$/,
    }).max(2048, "URL is too long"),
  })
  .strict();

export type UrlInputType = z.infer<typeof urlSchema>;
