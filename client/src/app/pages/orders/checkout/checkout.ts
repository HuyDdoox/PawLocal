import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DecimalPipe],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  readonly productService = inject(ProductService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  readonly deliveryFee = 30000;

  readonly checkoutForm = this.fb.group({
    recipientName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^(0|\+84)[3|5|7|8|9][0-9]{8}$/)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    note: [''],
  });

  ngOnInit(): void {
    if (this.productService.cart().length === 0) {
      this.router.navigate(['/cart']);
      return;
    }

    const u = this.authService.currentUser();
    if (u) {
      this.checkoutForm.patchValue({
        recipientName: u.name || '',
        phone: u.phone || '',
        address: u.address || '',
      });
    }
  }

  get finalTotal(): number {
    const sub = this.productService.cartTotal();
    return sub >= 500000 ? sub : sub + this.deliveryFee;
  }

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formVal = this.checkoutForm.getRawValue();
    const items = this.productService.cart().map((item) => ({
      productId: item.product._id || String(item.product.id),
      quantity: item.quantity,
    }));

    this.orderService
      .createOrder({
        items,
        shippingAddress: {
          recipientName: formVal.recipientName,
          phone: formVal.phone,
          address: formVal.address,
          note: formVal.note,
        },
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.success) {
            this.productService.clearCart();
            alert('🎉 Đặt hàng COD thành công! Mã đơn: ' + res.data?._id?.substring(res.data._id.length - 6));
            this.router.navigate(['/my-orders']);
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
        },
      });
  }
}
