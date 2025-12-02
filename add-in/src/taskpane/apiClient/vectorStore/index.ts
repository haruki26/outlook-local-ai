import { VectorMail } from "../../types";
import { BaseAPIClient } from "../shared";
import { MailDTO, RegistMail, SearchDTO } from "./schema";

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

  async post(data: SearchDTO): Promise<VectorMail[]> {
    const res = await this.fetchAPI("POST", { guard: this.searchDataGuard, data });
    return res.map((item) => ({
      id: item.id,
      part: item.mail_part,
      sectionId: item.section_id,
    }));
  }
}

export class VectorStoreClient extends BaseAPIClient {
  search: SearchClient;

  constructor() {
    super("vector-store");
    this.search = new SearchClient();
  }

  async post(data: RegistMail): Promise<void> {
    await this.fetchAPI("POST", { data });
  }
}
