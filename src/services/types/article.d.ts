export interface Articles {
  status: string;
  data: Data;
}

export interface Data {
  id: string;
  author: Author;
  title: string;
  description: string;
  thumbnail: null;
  content: string;
  createdAt: Date;
  slug: string;
}

interface Author {
  id: string;
  nama: string;
  email: string;
}
