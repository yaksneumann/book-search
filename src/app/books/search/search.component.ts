import { Component, inject, signal, computed, OnDestroy } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../book.service';
import type { Book, BooksResults } from '../book.model';
import { BooksComponent } from '../books/books.component';
import { debounceTime, distinctUntilChanged, EMPTY, filter, Subject, catchError, Observable, switchMap, tap, of } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { BookHeaderComponent } from '../book-header/book-header.component';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface BookResult {
  items?: {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      description?: string;
      imageLinks?: {
        thumbnail: string;
      };
    };
  }[];
  totalItems: number;
}

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [BookHeaderComponent, BooksComponent, ReactiveFormsModule, RouterModule, CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent implements OnDestroy {
  protected searchInput = signal<string>('');
  protected searchControl = new FormControl('');
  protected books = signal<Book[] | null>(null);
  protected loading = signal(false);
  
  currentPage = signal(0);
  totalBooks = signal(0);
  private bookService = inject(BookService);
  private totalItems = signal(0);

  searchQuery = signal('');
  isLoading = signal(false);
  error = signal<string | null>(null);
  // protected error = signal('');
  private selectedBook = signal<Book | null>(null);
  searchResults = signal<any[]>([]);
  errorMessage = signal<string>('');

  private searchInput$ = toObservable(this.searchInput);

  private onSearchChange = this.searchInput$
    .pipe(
      filter((searchValue) => !!searchValue?.trim()),
      tap((v) => console.log('after filter', v)),
      debounceTime(300),
      tap((v) => console.log('after debounce', v)),
      distinctUntilChanged(),
      tap((v) => console.log('after distinct until changed', v)),
      tap(this.search),
      tap((v) => console.log('after switch map', v))
    )
    .subscribe();

    private http = inject(HttpClient);
    private searchSubject = new Subject<string>();
    private apiUrl = 'https://www.googleapis.com/books/v1/volumes';

    constructor() {
      // Set up the search pipeline
      this.searchSubject.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(query => {
          if (!query.trim()) {
            this.searchResults.set([]);
            return of(null);
          }
  
          this.isLoading.set(true);
          this.errorMessage.set('');
          //calling search 
          this.search(query);
  
          return this.http.get<BookResult>(`${this.apiUrl}?q=${encodeURIComponent(query)}`).pipe(
            catchError(error => {
              this.errorMessage.set('An error occurred while searching. Please try again.');
              return of(null);
            })
          );
        })
      ).subscribe(response => {
        this.isLoading.set(false);
        if (response?.items) {
          this.searchResults.set(response.items);
        }
      });
    }
  
    onSearch(query: string) {
      this.searchQuery.set(query);
      this.searchSubject.next(query);
    }
  
    // Clean up subscription
    ngOnDestroy() {
      this.searchSubject.complete();
    }

  pages = computed(() => {
    const pageCount = Math.ceil(this.totalItems() / 20);
    return Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 5);
  });


 ////shlomos code
  search(searchTerm: any) {
    //this.loading.set(true);
    this.error.set('');
    console.log('search', searchTerm)

    this.bookService.searchBooks(searchTerm, this.currentPage() * 20)
      .subscribe({
        next: (response) => {
          console.log('finished search successfuly');
          this.books.set(response.books);
          // this.totalBooks.set(response.total);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('An error occurred while searching books');
          this.loading.set(false);
        },
      });
  }

  // search(): void {
  //   if (!this.searchControl.value?.trim()) {
  //     this.error.set('Please enter a search term');
  //     return;
  //   }

  //   this.loading.set(true);
  //   this.error.set('');

  //   this.bookService.searchBooks(
  //     this.searchControl.value,
  //     this.currentPage() * 20
  //   ).subscribe({
  //     next: (response) => {
  //       this.books.set(response.books);
  //       this.totalBooks.set(response.totalItems);
  //       this.loading.set(false);
  //     },
  //     error: () => {
  //       this.error.set('An error occurred while searching books');
  //       this.loading.set(false);
  //     }
  //   });
  // }

  previousPage(): void {
    if (this.currentPage() > 0) {
      this.currentPage.update((page) => page - 1);
      // this.search();
    }
  }

  nextPage(): void {
    if ((this.currentPage() + 1) * 20 < this.totalBooks()) {
      this.currentPage.update((page) => page + 1);
      // this.search();
    }
  }
  // ngOnDestroy() {
  //   this.onSearchChange.unsubscribe();
  // }
}
