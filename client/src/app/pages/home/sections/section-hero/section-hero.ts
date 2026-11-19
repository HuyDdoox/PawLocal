import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../../../services/product.service';
import { Banner } from '../../../../models/product.model';

@Component({
  selector: 'app-section-hero',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './section-hero.html',
  styleUrl: './section-hero.css',
})
export class SectionHero {
  readonly productService = inject(ProductService);

  readonly currentBanner = computed<Banner | null>(() => {
    const banners = this.productService.banners();
    return banners && banners.length > 0 ? banners[0] : null;
  });
}
