import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-section-quick-actions',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './section-quick-actions.html',
  styleUrl: './section-quick-actions.css',
})
export class SectionQuickActions {
  readonly productService = inject(ProductService);
}
