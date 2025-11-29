interface Tag {
  id: string;
  name: string;
}

interface VectorMail {
  id: string;
  part: string;
  sectionId: string;
  tag: Tag[];
}

interface RegisterVectorMail {
  id: string;
  body: string;
  tagIds: string[];
}