import { Component, inject } from '@angular/core';
import { BookService } from '../book.service';
import { BooksComponent } from '../books/books.component';
import { UserService } from '../../shared/user.service';
import { BookHeaderComponent } from '../book-header/book-header.component';

@Component({
  selector: 'app-user-books',
  standalone: true,
  imports: [BookHeaderComponent, BooksComponent, ],
  templateUrl: './user-books.component.html',
  styleUrl: './user-books.component.css'
})
export class UserBooksComponent {
  userService = inject(UserService);
  bookService = inject(BookService);
}
