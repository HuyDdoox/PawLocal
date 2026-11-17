import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Order, OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.css',
})
export class AdminOrders implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly orders = signal<Order[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedStatus = signal<string>('all');

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading.set(true);
    this.adminService.getOrders(this.selectedStatus()).subscribe({
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

  filterStatus(status: string): void {
    this.selectedStatus.set(status);
    this.loadOrders();
  }

  updateStatus(orderId: string, status: OrderStatus): void {
    this.adminService.updateOrderStatus(orderId, status).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadOrders();
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Không thể cập nhật trạng thái đơn hàng');
      },
    });
  }

  togglePaymentStatus(order: Order): void {
    const nextStatus = order.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    this.adminService.updateOrderStatus(order._id, undefined, nextStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadOrders();
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Lỗi khi cập nhật trạng thái thanh toán');
      },
    });
  }

  getStatusLabel(status: OrderStatus): string {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'processing': return 'Chuẩn bị hàng';
      case 'shipped': return 'Đang giao';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
