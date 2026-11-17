import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../models/order.model';

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
  readonly selectedPaymentMethod = signal<'COD' | 'VIETQR'>('VIETQR');
  readonly showQrModal = signal<boolean>(false);
  readonly createdOrder = signal<Order | null>(null);
  readonly isConfirmingPaid = signal<boolean>(false);
  readonly copyFeedback = signal<string | null>(null);

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

  selectPaymentMethod(method: 'COD' | 'VIETQR'): void {
    this.selectedPaymentMethod.set(method);
  }

  copyToClipboard(text: string, label: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copyFeedback.set(`Đã sao chép ${label}!`);
      setTimeout(() => this.copyFeedback.set(null), 2500);
    });
  }

  onConfirmPayment(): void {
    const order = this.createdOrder();
    if (!order) return;

    this.isConfirmingPaid.set(true);
    this.orderService.confirmPayment(order._id).subscribe({
      next: (res) => {
        this.isConfirmingPaid.set(false);
        this.showQrModal.set(false);
        alert('🎉 Cảm ơn bạn! Hệ thống đã ghi nhận thanh toán VietQR và đang chuẩn bị giao hàng.');
        this.router.navigate(['/my-orders']);
      },
      error: (err) => {
        this.isConfirmingPaid.set(false);
        alert(err.error?.message || 'Có lỗi khi cập nhật trạng thái thanh toán.');
      },
    });
  }

  closeModalAndGoToOrders(): void {
    this.showQrModal.set(false);
    this.router.navigate(['/my-orders']);
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
        paymentMethod: this.selectedPaymentMethod(),
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.success && res.data) {
            this.productService.clearCart();

            if (this.selectedPaymentMethod() === 'VIETQR') {
              this.createdOrder.set(res.data);
              this.showQrModal.set(true);
            } else {
              alert('🎉 Đặt hàng COD thành công! Mã đơn: ' + res.data._id.substring(res.data._id.length - 6).toUpperCase());
              this.router.navigate(['/my-orders']);
            }
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi tạo đơn hàng');
        },
      });
  }
}
