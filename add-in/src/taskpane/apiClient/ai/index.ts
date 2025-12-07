import z from "zod";
import { BaseAPIClient } from "../shared";
import { nerResponseSchema, postNerSchema } from "./schema";

type PostNerBody = z.infer<typeof postNerSchema>;
type NerResponse = z.infer<typeof nerResponseSchema>;

class Ner extends BaseAPIClient {
  constructor(parent: string) {
    super(`${parent}/ner`);
  }

  async post(data: PostNerBody): Promise<NerResponse[]> {
    return await this.fetchAPI("POST", {
      requestBodySchema: postNerSchema,
      responseSchema: z.array(nerResponseSchema),
      data,
    });
  }
}

export class Ai extends BaseAPIClient {
  ner: Ner;

  constructor() {
    const resource = "ai";
    super(resource);
    this.ner = new Ner(resource);
  }
}
