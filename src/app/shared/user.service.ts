import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private username = signal<string>(localStorage.getItem('username') || '');

  setUsername(name: string) {
    this.username.set(name);
    localStorage.setItem('username', name);
  }

  getUsername() {
    if (!this.username()) {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        this.username.set(storedUsername);
      }
    }
    return this.username.asReadonly();
  }

  hasUsername(): boolean {
    return !!this.getUsername()();
  }

  clearUsername() {
    this.username.set('');
    localStorage.removeItem('username');
  }
}