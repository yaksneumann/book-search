export interface Book {
  id: string;
  title: string;
  authors: string[];
  description: string;
  thumbnail: string;
  publishedDate: string;
  pageCount: number;
}

export interface BooksResults {
  books: Book[];
  totalItems: number;
}
