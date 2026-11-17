import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../../../services/product.service';

@Component({
  selector: 'app-section-services',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './section-services.html',
  styleUrl: './section-services.css',
})
export class SectionServices {
  readonly productService = inject(ProductService);

  getServiceIcon(name: string): string {
    if (name.includes('Hoàng Gia') || name.includes('Combo')) return 'fa-solid fa-crown';
    if (name.includes('Cắt Tỉa')) return 'fa-solid fa-scissors';
    if (name.includes('Tắm Sấy')) return 'fa-solid fa-soap';
    if (name.includes('Móng')) return 'fa-solid fa-paw';
    return 'fa-solid fa-wand-magic-sparkles';
  }

  getServiceBadge(name: string): string {
    if (name.includes('Hoàng Gia') || name.includes('Combo')) return '⭐ Gói VIP';
    if (name.includes('Tắm Sấy')) return '🔥 Phổ biến';
    if (name.includes('Cắt Tỉa')) return '✨ Tạo kiểu đẹp';
    return '🛡️ Chăm sóc';
  }
}
