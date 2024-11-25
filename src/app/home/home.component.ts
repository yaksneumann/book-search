import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private userService = inject(UserService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  userForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(1)]],
  });

  get showError(): boolean {
    const control = this.userForm.get('username');
    return (control?.invalid && (control?.touched)) || false;
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const username = this.userForm.get('username')?.value || '';
      this.userService.setUsername(username);
      this.router.navigate(['/search']);
    } else {
      this.userForm.markAllAsTouched();
    }
  }
}
