import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-section-newsletter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './section-newsletter.html',
  styleUrl: './section-newsletter.css',
})
export class SectionNewsletter {
  email = signal<string>('');
  isSubscribed = signal<boolean>(false);

  onSubmit(): void {
    if (this.email().trim()) {
      this.isSubscribed.set(true);
    }
  }
}
