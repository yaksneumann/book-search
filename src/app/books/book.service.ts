import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Book } from './book.model';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private http = inject(HttpClient);
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';
  private maxResults: number = 20;
  private wishlist = signal<Book[]>([]);
  readonly userWishlist = this.wishlist.asReadonly();

  constructor() {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist.set(JSON.parse(savedWishlist));
    }
  }

  searchBooks(query: string, startIndex: number = 0): Observable<{ books: Book[]; totalItems: number }> {
    return this.http.get<any>(`${this.apiUrl}?q=${query}&startIndex=${startIndex}&maxResults=${this.maxResults}`).pipe(
        map((response) => ({
          books: response.items?.map(this.mapBookResponse) ?? [],
          totalItems: response.totalItems ?? 0,
        }))
      );
  }

  private mapBookResponse(item: any): Book {
    const volumeInfo = item.volumeInfo;
    return {
      id: item.id,
      title: volumeInfo.title,
      authors: volumeInfo.authors ?? ['Unknown Author'],
      description: volumeInfo.description ?? 'No description available',
      thumbnail: volumeInfo.imageLinks?.thumbnail ?? '',
      publishedDate: volumeInfo.publishedDate,
      pageCount: volumeInfo.pageCount,
    };
  }

  //for wishlist books
  addToWishlist(book: Book): void {
    const currentWishlist = this.wishlist();
    if (!currentWishlist.find((b) => b.id === book.id)) {
      this.wishlist.update((books) => [...books, book]);
      localStorage.setItem('wishlist', JSON.stringify(this.wishlist()));
    }
  }

  removeFromWishlist(bookId: string): void {
    this.wishlist.update((books) => books.filter((b) => b.id !== bookId));
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist()));
  }
}
