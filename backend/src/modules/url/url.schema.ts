import z from "zod";

export const createUrlSchema = z
  .object({
    originalUrl: z.url({
      protocol: /^https?$/,
    }).max(2048, "URL is too long"),
  })
  .strict();

export const updateUrlSchema = z.object({
  updatedOriginalUrl:z.string()
}).strict()

export type UrlInputType = z.infer<typeof createUrlSchema>;
export type UpdateUrlInputType = z.infer<typeof updateUrlSchema>;
