import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => 
          import('./home/home.component')
            .then(m => m.HomeComponent)
      },
      {
        path: 'search',
        loadComponent: () => 
          import('./books/search/search.component')
            .then(m => m.SearchComponent)
      },
      {
        path: 'wishlist',
        loadComponent: () => 
          import('./books/user-books/user-books.component')
            .then(m => m.UserBooksComponent),
      }
];
