import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {
  readonly productService = inject(ProductService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  updateQty(productId: number | string, delta: number, currentQty: number): void {
    this.productService.updateQuantity(productId, currentQty + delta);
  }

  removeItem(productId: number | string): void {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      this.productService.removeFromCart(productId);
    }
  }

  onProceedCheckout(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
