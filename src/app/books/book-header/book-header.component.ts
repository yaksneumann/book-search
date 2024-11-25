import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-book-header',
  standalone: true,
  imports: [],
  templateUrl: './book-header.component.html',
  styleUrl: './book-header.component.css'
})
export class BookHeaderComponent {
  protected userService = inject(UserService);
}
