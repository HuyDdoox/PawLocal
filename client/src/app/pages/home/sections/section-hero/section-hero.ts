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

  readonly currentBanner = computed<Banner>(() => {
    const banners = this.productService.banners();
    if (banners && banners.length > 0) {
      return banners[0];
    }
    return {
      id: 1,
      title: 'PAWLOCAL SPA & GROOMING 2026',
      subtitle: 'Ưu đãi đặt lịch tắm cắt tỉa giảm ngay 25% cho Boss yêu.',
      image: '/images/banners/hero-banner.jpg',
      link: '/booking',
    };
  });
}
