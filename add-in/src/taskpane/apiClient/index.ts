import { TagClient } from "./tags";
import { VectorStoreClient } from "./vectorStore";

export const apiClient = {
  tags: new TagClient(),
  vectorStore: new VectorStoreClient(),
};
