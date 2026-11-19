import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PetService } from '../../services/pet.service';
import { Pet } from '../../models/pet.model';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pets',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pets.html',
  styleUrl: './pets.css',
})
export class Pets implements OnInit {
  private readonly petService = inject(PetService);
  private readonly toast = inject(ToastService);

  readonly pets = signal<Pet[]>([]);
  readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadPets();
  }

  loadPets(): void {
    this.isLoading.set(true);
    this.petService.getMyPets().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.pets.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  deletePet(id: string): void {
    if (!confirm('Bạn có chắc chắn muốn xóa hồ sơ bé này?')) return;
    this.petService.deletePet(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Đã xóa hồ sơ thú cưng thành công');
          this.loadPets();
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Không thể xóa hồ sơ');
      },
    });
  }
}
