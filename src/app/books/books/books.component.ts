import { Component, inject, signal, input, output, Input } from '@angular/core';
import type { Book } from '../book.model';
import { BookDialogComponent } from '../book-dialog/book-dialog.component';
import { BookService } from '../book.service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [BookDialogComponent],
  templateUrl: './books.component.html',
  styleUrl: './books.component.css'
})
export class BooksComponent {
  title = input.required<string>();
  books = input.required<Book[]>();
  wishList = input.required<boolean>();
  // selectBook = output<Book>();
  selectedBook = signal<Book | null>(null);
  // book = input<Book>();
  @Input() book!: Book;

  bookService = inject(BookService);

  // onSelectBook(book: Book) {
  //   this.selectBook.emit(book);
  // }

  protected showBookDetails(book: Book): void {
    this.selectedBook.set(book);
  }

  closeDialog(): void {
    this.selectedBook.set(null);
  }

  addToWishlist(book: Book): void {
    this.bookService.addToWishlist(book);
  }

  isInWishlist(book: Book): boolean {
    return this.bookService.userWishlist().some(item => item.id === book.id);
  }
}
