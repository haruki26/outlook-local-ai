interface RegistMail {
  id: string;
  mail: string;
  tagIds: string[];
}

type RegistMailDTO = {
  tag_ids: string[];
} & Omit<RegistMail, "tagIds">;

interface MailDTO {
  id: string;
  mail_part: string;
  section_id: number;
}

interface Search {
  query: string;
  tagIds: string[];
}

type SearchDTO = {
  tag_ids: string[];
} & Omit<Search, "tagIds">;

export type { RegistMail, RegistMailDTO, MailDTO, Search, SearchDTO };
