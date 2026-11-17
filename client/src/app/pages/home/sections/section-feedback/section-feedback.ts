import { Component, computed, inject, signal } from '@angular/core';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-section-feedback',
  standalone: true,
  imports: [],
  templateUrl: './section-feedback.html',
  styleUrl: './section-feedback.css',
})
export class SectionFeedback {
  readonly productService = inject(ProductService);

  readonly selectedRating = signal<number>(0);

  readonly feedbacks = this.productService.feedbacks;

  readonly totalCount = computed(() => this.feedbacks().length);

  readonly filteredFeedbacks = computed(() => {
    const sel = this.selectedRating();
    if (sel === 0) return this.feedbacks();
    return this.feedbacks().filter((f) => f.rating === sel);
  });

  setRatingFilter(rating: number): void {
    this.selectedRating.set(rating);
  }
}
