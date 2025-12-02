import { Tag } from "../../types";

interface PostTagDTO {
  name: string;
}

interface TagDTO extends Tag {}

export type { PostTagDTO, TagDTO };
