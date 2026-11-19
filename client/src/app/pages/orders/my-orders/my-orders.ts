import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ToastService } from '../../../services/toast.service';
import { Order, OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe, DecimalPipe],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly toastService = inject(ToastService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedQrOrder = signal<Order | null>(null);
  readonly isConfirming = signal<boolean>(false);
  readonly copyFeedback = signal<string | null>(null);

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.orders.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  openQrModal(order: Order): void {
    this.selectedQrOrder.set(order);
  }

  closeQrModal(): void {
    this.selectedQrOrder.set(null);
  }

  copyToClipboard(text: string, label: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copyFeedback.set(`Đã sao chép ${label}!`);
      setTimeout(() => this.copyFeedback.set(null), 2500);
    });
  }

  confirmPayment(orderId: string): void {
    this.isConfirming.set(true);
    this.orderService.confirmPayment(orderId).subscribe({
      next: (res) => {
        this.isConfirming.set(false);
        this.closeQrModal();
        this.toastService.success('🎉 Xác nhận thanh toán thành công! Đơn hàng đã chuyển sang chuẩn bị giao.');
        this.loadOrders();
      },
      error: (err) => {
        this.isConfirming.set(false);
        this.toastService.error(err.error?.message || 'Có lỗi xảy ra khi xác nhận thanh toán.');
      },
    });
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'pending': return 'Chờ xử lý';
      case 'processing': return 'Đang xử lý';
      case 'shipped': return 'Đang giao hàng';
      case 'completed': return 'Đã giao thành công';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
