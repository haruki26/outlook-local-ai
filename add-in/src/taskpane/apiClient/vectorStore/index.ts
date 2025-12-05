import { VectorMail } from "../../types";
import { BaseAPIClient } from "../shared";
import { MailDTO, RegistMail, RegistMailDTO, Search, SearchDTO } from "./schema";

class SearchClient extends BaseAPIClient {
  constructor() {
    super("search");
  }

  private searchDataGuard(res: unknown): res is MailDTO[] {
    return (
      Array.isArray(res) &&
      res.every(
        (item) =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "mail_id" in item &&
          "section_id" in item
      )
    );
  }

  async post(data: Search): Promise<VectorMail[]> {
    const data_: SearchDTO = {
      query: data.query,
      tag_ids: data.tagIds,
    };
    const res = await this.fetchAPI("POST", { guard: this.searchDataGuard, data: data_ });
    return res.map((item) => ({
      id: item.id,
      part: item.mail_part,
      sectionId: item.section_id,
    }));
  }
}

export class VectorStoreClient extends BaseAPIClient {
  public search: SearchClient;

  constructor() {
    super("vector-store");
    this.search = new SearchClient();
  }

  public async post(data: RegistMail): Promise<void> {
    const data_: RegistMailDTO = {
      mail: data.mail,
      id: data.id,
      tag_ids: data.tagIds,
    };
    await this.fetchAPI("POST", { data: data_ });
  }
}
