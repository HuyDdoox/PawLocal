export interface Blog {
  _id?: string;
  id: number;
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  views?: number;
}
