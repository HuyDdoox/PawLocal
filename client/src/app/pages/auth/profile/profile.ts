import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  readonly authService = inject(AuthService);

  logout(): void {
    if (confirm('Bạn có chắc muốn đăng xuất?')) {
      this.authService.logout();
    }
  }
}
