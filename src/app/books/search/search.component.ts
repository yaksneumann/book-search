import { Component, inject, signal } from '@angular/core';
import { BookService } from '../book.service';
import type { Book } from '../book.model';
import { BooksComponent } from '../books/books.component';
import { BookHeaderComponent } from '../book-header/book-header.component';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [BookHeaderComponent, BooksComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  private bookService = inject(BookService);
  protected searchInput = signal<string>('');
  protected books = signal<Book[] | null>(null);
  protected loading = signal(false);
  protected currentPage = signal(0);
  protected totalBooks = signal(0);
  protected error = signal<string | null>('');
  private searchInput$ = toObservable(this.searchInput);

  private onSearchChange = this.searchInput$.pipe(
      filter((searchValue) => !!searchValue?.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchValue) => this.search(searchValue))
    )
    .subscribe({
      next: (response) => {
        this.books.set(response.books);
        this.totalBooks.set(response.totalItems);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('An error occurred while searching books');
        this.loading.set(false);
      },
    });

  ngOnDestroy() {
    this.onSearchChange.unsubscribe();
  }

  search(searchTerm: string) {
    this.loading.set(true);
    this.error.set('');
    return this.bookService.searchBooks(searchTerm, this.currentPage() * 20);
  }
}