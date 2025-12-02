export interface Tag {
  id: string;
  name: string;
}

export interface VectorMail {
  // メールの一部を表示
  id: string;
  part: string;
  sectionId: number;
}
