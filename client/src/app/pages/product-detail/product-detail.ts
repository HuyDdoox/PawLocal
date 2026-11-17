import { Component, computed, inject, input, linkedSignal, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.css',
})
export class ProductDetail {
  readonly productService = inject(ProductService);

  readonly id = input<string>('');
  readonly slug = input<string>('');

  readonly isAdded = signal<boolean>(false);

  readonly product = computed<Product | undefined>(() => {
    const s = this.slug() || this.id();
    if (!s) return undefined;
    return this.productService.getProductById(s);
  });

  readonly productId = computed(() => this.product()?.id || 0);

  readonly quantity = linkedSignal({
    source: this.productId,
    computation: () => 1,
  });

  increaseQty(): void {
    const p = this.product();
    if (p && this.quantity() < p.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  decreaseQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  onAddToCart(): void {
    const p = this.product();
    if (p) {
      this.productService.addToCart(p, this.quantity());
      this.isAdded.set(true);
      setTimeout(() => this.isAdded.set(false), 2000);
    }
  }
}
