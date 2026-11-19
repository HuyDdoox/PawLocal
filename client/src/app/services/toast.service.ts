import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly currentToast = signal<ToastItem | null>(null);
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastType = 'success', durationMs: number = 2000): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const id = Date.now();
    this.currentToast.set({ id, message, type });

    this.timer = setTimeout(() => {
      if (this.currentToast()?.id === id) {
        this.currentToast.set(null);
      }
    }, durationMs);
  }

  success(message: string, durationMs: number = 2000): void {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs: number = 2500): void {
    this.show(message, 'error', durationMs);
  }

  info(message: string, durationMs: number = 2000): void {
    this.show(message, 'info', durationMs);
  }

  warning(message: string, durationMs: number = 2000): void {
    this.show(message, 'warning', durationMs);
  }

  close(): void {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.currentToast.set(null);
  }
}
