import { Component, Input, output, Output, EventEmitter, inject } from '@angular/core';
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

  @Input({ required: true }) book!: Book;
  // @Output() close = new EventEmitter<void>();
  close = output<void>();


  get isInWishlist(): boolean {
    console.log('helllo ');
    //return true;
    return this.bookService.userWishlist().some(item => item.id === this.book.id);
  }

  toggleWishlist(): void {
    if (this.isInWishlist) {
      this.bookService.removeFromWishlist(this.book.id);
    } else {
      this.bookService.addToWishlist(this.book);
    }
  }
}
