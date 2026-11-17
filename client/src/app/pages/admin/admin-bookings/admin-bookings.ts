import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { AdminService } from '../../../services/admin.service';
import { Booking, BookingStatus } from '../../../models/booking.model';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.css',
})
export class AdminBookings implements OnInit {
  private readonly adminService = inject(AdminService);

  readonly bookings = signal<Booking[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly selectedStatus = signal<string>('all');

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading.set(true);
    this.adminService.getBookings(this.selectedStatus()).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.bookings.set(res.data);
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
    this.loadBookings();
  }

  updateStatus(bookingId: string, status: BookingStatus): void {
    this.adminService.updateBookingStatus(bookingId, status).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadBookings();
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Không thể cập nhật trạng thái lịch hẹn');
      },
    });
  }

  togglePaymentStatus(booking: Booking): void {
    const nextStatus = booking.paymentStatus === 'paid' ? 'unpaid' : 'paid';
    this.adminService.updateBookingStatus(booking._id, undefined, nextStatus).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadBookings();
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Lỗi khi cập nhật trạng thái thanh toán');
      },
    });
  }

  getStatusLabel(status: BookingStatus): string {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Đã xong';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
