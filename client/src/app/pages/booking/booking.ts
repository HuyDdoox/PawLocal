import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { BookingService } from '../../services/booking.service';
import { Pet } from '../../models/pet.model';
import { Service, Booking as BookingModel, TimeSlot, BookingStatus } from '../../models/booking.model';

interface DayOption {
  dateStr: string;
  label: string;
  dayOfWeek: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking implements OnInit {
  private readonly petService = inject(PetService);
  private readonly bookingService = inject(BookingService);
  private readonly route = inject(ActivatedRoute);

  readonly activeTab = signal<'book' | 'my-bookings'>('book');
  readonly isInitialLoading = signal(true);
  readonly isLoadingSlots = signal(false);
  readonly isSubmitting = signal(false);
  readonly isLoadingBookings = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly pets = signal<Pet[]>([]);
  readonly services = signal<Service[]>([]);
  readonly bookedSlots = signal<TimeSlot[]>([]);
  readonly myBookings = signal<BookingModel[]>([]);

  readonly allSlots: TimeSlot[] = ['09:00', '10:30', '13:00', '14:30', '16:00'];
  availableDays: DayOption[] = [];

  readonly selectedPetId = signal<string>('');
  readonly selectedServiceId = signal<string>('');
  readonly selectedDate = signal<string>('');
  readonly selectedTimeSlot = signal<string>('');
  readonly selectedPaymentMethod = signal<'COUNTER' | 'VIETQR'>('VIETQR');
  readonly showQrModal = signal<boolean>(false);
  readonly createdBooking = signal<BookingModel | null>(null);
  readonly isConfirmingPaid = signal<boolean>(false);
  readonly copyFeedback = signal<string | null>(null);
  note: string = '';

  selectPaymentMethod(method: 'COUNTER' | 'VIETQR'): void {
    this.selectedPaymentMethod.set(method);
  }

  openQrModal(booking: BookingModel): void {
    this.createdBooking.set(booking);
    this.showQrModal.set(true);
  }

  closeQrModal(): void {
    this.showQrModal.set(false);
    this.createdBooking.set(null);
  }

  copyToClipboard(text: string, label: string): void {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      this.copyFeedback.set(`Đã sao chép ${label}!`);
      setTimeout(() => this.copyFeedback.set(null), 2500);
    });
  }

  onConfirmPayment(): void {
    const b = this.createdBooking();
    if (!b) return;

    this.isConfirmingPaid.set(true);
    this.bookingService.confirmPayment(b._id).subscribe({
      next: (res) => {
        this.isConfirmingPaid.set(false);
        this.closeQrModal();
        alert('🎉 Cảm ơn bạn! Hệ thống đã ghi nhận thanh toán giữ chỗ VietQR và xác nhận lịch hẹn của bạn.');
        this.loadMyBookings();
        this.activeTab.set('my-bookings');
      },
      error: (err) => {
        this.isConfirmingPaid.set(false);
        alert(err.error?.message || 'Có lỗi khi cập nhật trạng thái thanh toán.');
      },
    });
  }

  ngOnInit(): void {
    this.generateDays();
    this.loadInitialData();

    const queryPetId = this.route.snapshot.queryParams['petId'];
    if (queryPetId) {
      this.selectedPetId.set(queryPetId);
    }
  }

  generateDays(): void {
    const days: DayOption[] = [];
    const dowNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      let label = `${day}/${month}`;
      let dow = dowNames[d.getDay()];
      if (i === 0) dow = 'Hôm nay';
      if (i === 1) dow = 'Ngày mai';

      days.push({ dateStr, label, dayOfWeek: dow });
    }

    this.availableDays = days;
    if (days.length > 0) {
      this.selectedDate.set(days[0].dateStr);
    }
  }

  loadInitialData(): void {
    this.isInitialLoading.set(true);
    this.petService.getMyPets().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.pets.set(res.data);
          if (res.data.length > 0 && !this.selectedPetId()) {
            this.selectedPetId.set(res.data[0]._id);
          }
        }
        this.loadServices();
      },
      error: () => {
        this.loadServices();
      },
    });
  }

  loadServices(): void {
    this.bookingService.getServices().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.services.set(res.data);
          if (res.data.length > 0) {
            this.selectedServiceId.set(res.data[0]._id);
            this.fetchSlots();
          }
        }
        this.isInitialLoading.set(false);
      },
      error: () => {
        this.isInitialLoading.set(false);
      },
    });
  }

  onPetSelect(petId: string): void {
    this.selectedPetId.set(petId);
  }

  onServiceSelect(serviceId: string): void {
    this.selectedServiceId.set(serviceId);
    this.fetchSlots();
  }

  onDateSelect(dateStr: string): void {
    this.selectedDate.set(dateStr);
    this.fetchSlots();
  }

  onSlotSelect(slot: TimeSlot): void {
    if (!this.isSlotBooked(slot)) {
      this.selectedTimeSlot.set(slot);
    }
  }

  isSlotBooked(slot: TimeSlot): boolean {
    return this.bookedSlots().includes(slot);
  }

  fetchSlots(): void {
    const sId = this.selectedServiceId();
    const d = this.selectedDate();
    if (!sId || !d) return;

    this.isLoadingSlots.set(true);
    this.bookingService.getAvailableSlots(sId, d).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.bookedSlots.set(res.data.bookedSlots);
          if (this.selectedTimeSlot() && res.data.bookedSlots.includes(this.selectedTimeSlot() as TimeSlot)) {
            this.selectedTimeSlot.set('');
          }
        }
        this.isLoadingSlots.set(false);
      },
      error: () => {
        this.isLoadingSlots.set(false);
      },
    });
  }

  getSelectedServicePrice(): number {
    const s = this.services().find((item) => item._id === this.selectedServiceId());
    return s ? s.basePrice : 0;
  }

  submitBooking(): void {
    if (!this.selectedPetId() || !this.selectedServiceId() || !this.selectedDate() || !this.selectedTimeSlot()) {
      this.errorMessage.set('Vui lòng chọn đầy đủ thông tin đặt lịch');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    this.bookingService
      .createBooking({
        petId: this.selectedPetId(),
        serviceId: this.selectedServiceId(),
        date: this.selectedDate(),
        timeSlot: this.selectedTimeSlot(),
        paymentMethod: this.selectedPaymentMethod(),
        note: this.note,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting.set(false);
          if (res.success && res.data) {
            this.selectedTimeSlot.set('');
            this.note = '';
            this.loadMyBookings();

            if (this.selectedPaymentMethod() === 'VIETQR') {
              this.createdBooking.set(res.data);
              this.showQrModal.set(true);
            } else {
              alert('🎉 Đặt lịch hẹn Spa thành công! Cửa hàng sẽ sớm liên hệ xác nhận.');
              this.activeTab.set('my-bookings');
            }
          }
        },
        error: (err) => {
          this.isSubmitting.set(false);
          this.errorMessage.set(err.error?.message || 'Có lỗi khi đặt lịch, vui lòng thử lại');
        },
      });
  }

  loadMyBookings(): void {
    this.isLoadingBookings.set(true);
    this.bookingService.getMyBookings().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.myBookings.set(res.data);
        }
        this.isLoadingBookings.set(false);
      },
      error: () => {
        this.isLoadingBookings.set(false);
      },
    });
  }

  cancelBooking(id: string): void {
    if (!confirm('Bạn có chắc chắn muốn hủy lịch hẹn này?')) return;
    this.bookingService.cancelBooking(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadMyBookings();
        }
      },
      error: (err) => {
        alert(err.error?.message || 'Không thể hủy lịch hẹn');
      },
    });
  }

  getStatusLabel(status: BookingStatus): string {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'confirmed': return 'Đã xác nhận';
      case 'completed': return 'Đã hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  }
}
