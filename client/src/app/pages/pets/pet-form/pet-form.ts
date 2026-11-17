import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PetService } from '../../../services/pet.service';
import { PetSpecies } from '../../../models/pet.model';

@Component({
  selector: 'app-pet-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pet-form.html',
  styleUrl: './pet-form.css',
})
export class PetForm implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly petService = inject(PetService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly isEditMode = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);
  private petId: string | null = null;

  readonly petForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    species: ['dog' as PetSpecies, [Validators.required]],
    breed: [''],
    weightKg: [undefined as number | undefined, [Validators.min(0.1)]],
    birthDate: [''],
    notes: [''],
  });

  ngOnInit(): void {
    this.petId = this.route.snapshot.paramMap.get('id');
    if (this.petId) {
      this.isEditMode.set(true);
      this.loadPet(this.petId);
    }
  }

  loadPet(id: string): void {
    this.petService.getPetById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const p = res.data;
          this.petForm.patchValue({
            name: p.name,
            species: p.species,
            breed: p.breed || '',
            weightKg: p.weightKg,
            birthDate: p.birthDate ? p.birthDate.substring(0, 10) : '',
            notes: p.notes || '',
          });
        }
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Không thể tải thông tin thú cưng');
      },
    });
  }

  setSpecies(species: PetSpecies): void {
    this.petForm.controls.species.setValue(species);
  }

  isFieldInvalid(field: 'name'): boolean {
    const ctrl = this.petForm.controls[field];
    return ctrl.invalid && (ctrl.dirty || ctrl.touched);
  }

  onSubmit(): void {
    if (this.petForm.invalid) {
      this.petForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);

    const formVal = this.petForm.getRawValue();
    const payload = {
      ...formVal,
      weightKg: formVal.weightKg ? Number(formVal.weightKg) : undefined,
    };

    const action$ = this.isEditMode() && this.petId
      ? this.petService.updatePet(this.petId, payload)
      : this.petService.createPet(payload);

    action$.subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.router.navigate(['/pets']);
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra, vui lòng thử lại');
      },
    });
  }
}
