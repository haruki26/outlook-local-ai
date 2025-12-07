import z from "zod";

const postNerSchema = z.object({
  text: z.string(),
});

const nerResponseSchema = z.object({
  text: z.string(),
});

export { postNerSchema, nerResponseSchema };
