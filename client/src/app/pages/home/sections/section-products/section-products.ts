import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductCard } from '../../../../shared/product-card/product-card';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'app-section-products',
  standalone: true,
  imports: [ProductCard, RouterLink],
  templateUrl: './section-products.html',
  styleUrl: './section-products.css',
})
export class SectionProducts {
  readonly productService = inject(ProductService);

  readonly activeTab = signal<'featured' | 'sale'>('featured');

  readonly featuredProducts = computed(() =>
    [...this.productService.products()]
      .sort((a, b) => Number(b.hot) - Number(a.hot))
      .slice(0, 4)
  );

  readonly saleProducts = computed(() =>
    [...this.productService.products()]
      .filter((p) => this.productService.getDiscountRate(p) > 0)
      .sort((a, b) => this.productService.getDiscountRate(b) - this.productService.getDiscountRate(a))
      .slice(0, 4)
  );

  readonly displayedProducts = computed(() =>
    this.activeTab() === 'featured' ? this.featuredProducts() : this.saleProducts()
  );

  selectTab(tab: 'featured' | 'sale'): void {
    this.activeTab.set(tab);
  }

  onAddToCart(product: Product): void {
    this.productService.addToCart(product);
  }
}
