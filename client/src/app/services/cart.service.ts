import { Injectable, signal, computed, inject } from '@angular/core';
import { Product, CartItem } from '../models/product.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly productService = inject(ProductService);

  readonly items = this.productService.cart;
  readonly totalCount = this.productService.cartCount;
  readonly subtotal = this.productService.cartTotal;

  readonly deliveryFee = computed(() => {
    return this.subtotal() >= 500000 || this.items().length === 0 ? 0 : 30000;
  });

  readonly finalTotal = computed(() => this.subtotal() + this.deliveryFee());

  addToCart(product: Product, quantity: number = 1): void {
    this.productService.addToCart(product, quantity);
  }

  updateQuantity(productId: string | number, quantity: number): void {
    this.productService.updateQuantity(productId, quantity);
  }

  removeItem(productId: string | number): void {
    this.productService.removeFromCart(productId);
  }

  clearCart(): void {
    this.productService.clearCart();
  }
}
