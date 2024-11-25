import { Component, signal } from '@angular/core';
import { inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userService = inject(UserService);
  router = inject(Router);
  username = signal('');

  logout() {
    this.userService.clearUsername();
    this.router.navigate(['/']);
  }
}
