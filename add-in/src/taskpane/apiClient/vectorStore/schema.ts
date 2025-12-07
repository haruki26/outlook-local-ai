import z from "zod";

const registMailSchema = z.object({
  id: z.string(),
  mail: z.string(),
  tag_ids: z.array(z.string()),
});

const mailSchema = z.object({
  id: z.string(),
  mail_part: z.string(),
  section_id: z.number(),
});

const searchSchema = z.object({
  query: z.string(),
  tag_ids: z.array(z.string()),
});

const conceptSchema = z.object({
  id: z.string(),
  label: z.string(),
});

const conceptSearchResultSchema = z.object({
  concept: conceptSchema,
  mails: z.array(mailSchema),
});

const registeredCheckSchema = z.object({
  mail_id: z.string(),
});

const registeredCheckResultSchema = z.object({
  registered: z.boolean(),
});

export {
  registMailSchema,
  mailSchema,
  searchSchema,
  conceptSchema,
  conceptSearchResultSchema,
  registeredCheckSchema,
  registeredCheckResultSchema,
};
