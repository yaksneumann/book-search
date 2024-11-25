import { Component, inject, signal, input } from '@angular/core';
import type { Book } from '../book.model';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { BookService } from '../book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [BookDialogComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent {
  title = input.required<string>();
  books = input.required<Book[]>();
  wishList = input.required<boolean>();
  protected selectedBook = signal<Book | null>(null);
  private bookService = inject(BookService);

  protected showBookDetails(book: Book): void {
    this.selectedBook.set(book);
  }

  protected isInWishlist(book: Book): boolean {
    return this.bookService.userWishlist().some((item) => item.id === book.id);
  }
}