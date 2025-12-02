import { BaseAPIClient } from "../shared";
import type { Tag } from "../../types";
import { PostTagDTO, TagDTO } from "./schema";

export class TagClient extends BaseAPIClient {
  constructor() {
    super("tags");
  }

  private getTagsGuard = (res: unknown): res is TagDTO[] => {
    return (
      Array.isArray(res) &&
      res.every((item) => typeof item === "object" && "id" in item && "name" in item)
    );
  };

  async get(): Promise<Tag[]> {
    return await this.fetchAPI("GET", { guard: this.getTagsGuard });
  }

  async post(data: PostTagDTO): Promise<void> {
    await this.fetchAPI("POST", { data });
  }
}
