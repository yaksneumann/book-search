import { Component, Input, output, inject } from '@angular/core';
import { Book } from '../book.model';
import { BookService } from '../book.service';

@Component({
  selector: 'app-book-dialog',
  standalone: true,
  imports: [],
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.css',
})
export class BookDialogComponent {
  private bookService = inject(BookService);
  @Input() book!: Book;
  close = output<void>();

  protected get isInWishlist(): boolean {
    return this.bookService.userWishlist().some(item => item.id === this.book.id);
  }

  protected toggleWishlist(): void {
    if (this.isInWishlist) {
      this.bookService.removeFromWishlist(this.book.id);
    } else {
      this.bookService.addToWishlist(this.book);
    }
  }
}
