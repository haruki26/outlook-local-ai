import z from "zod";
import { VectorMail } from "../../types";
import { BaseAPIClient } from "../shared";
import { conceptSearchResultSchema, mailSchema, registMailSchema, searchSchema } from "./schema";

type Search = Omit<z.infer<typeof searchSchema>, "tag_ids"> & {
  tagIds: string[];
};

class SearchClient extends BaseAPIClient {
  constructor(parent: string) {
    super(`${parent}/search`);
  }

  async post(data: Search): Promise<VectorMail[]> {
    const res = await this.fetchAPI("POST", {
      requestBodySchema: searchSchema,
      responseSchema: z.array(mailSchema),
      data: {
        query: data.query,
        tag_ids: data.tagIds,
      },
    });

    return res.map((item) => ({
      id: item.id,
      part: item.mail_part,
      sectionId: item.section_id,
    }));
  }
}

type ConceptSearchResult = Omit<z.infer<typeof conceptSearchResultSchema>, "mails"> & {
  mails: VectorMail[];
};

class SearchWithConceptClient extends BaseAPIClient {
  constructor(parent: string) {
    super(`${parent}/search-with-concept`);
  }

  async post(data: Search): Promise<ConceptSearchResult[]> {
    const res = await this.fetchAPI("POST", {
      requestBodySchema: searchSchema,
      responseSchema: z.array(conceptSearchResultSchema),
      data: {
        query: data.query,
        tag_ids: data.tagIds,
      },
    });

    return res.map((item) => ({
      concept: item.concept,
      mails: item.mails.map((mail) => ({
        id: mail.id,
        part: mail.mail_part,
        sectionId: mail.section_id,
      })),
    }));
  }
}

type RegistMail = Omit<z.infer<typeof registMailSchema>, "tag_ids"> & {
  tagIds: string[];
};

export class VectorStoreClient extends BaseAPIClient {
  public search: SearchClient;
  public searchWithConcept: SearchWithConceptClient;

  constructor() {
    const resource = "vector-store";
    super(resource);
    this.search = new SearchClient(resource);
    this.searchWithConcept = new SearchWithConceptClient(resource);
  }

  public async post(data: RegistMail): Promise<void> {
    await this.fetchAPI("POST", {
      requestBodySchema: registMailSchema,
      data: {
        mail: data.mail,
        id: data.id,
        tag_ids: data.tagIds,
      },
    });
  }
}
