import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AdminService } from '../../../services/admin.service';
import { ProductService } from '../../../services/product.service';
import { Product, Category } from '../../../models/product.model';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DecimalPipe],
  templateUrl: './admin-products.html',
  styleUrl: './admin-products.css',
})
export class AdminProducts implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly adminService = inject(AdminService);
  private readonly productService = inject(ProductService);
  private readonly http = inject(HttpClient);
  private readonly toast = inject(ToastService);

  readonly products = signal<Product[]>([]);
  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly showAddForm = signal<boolean>(false);
  readonly isSubmitting = signal<boolean>(false);

  readonly productForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    price: [0, [Validators.required, Validators.min(1000)]],
    stock: [10, [Validators.required, Validators.min(0)]],
    category: ['', [Validators.required]],
    description: [''],
  });

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.adminService.getProducts().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.products.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  loadCategories(): void {
    this.http.get<{ success: boolean; data: Category[] }>('http://localhost:5000/api/categories').subscribe({
      next: (res) => {
        if (res.data) {
          this.categories.set(res.data);
        }
      },
    });
  }

  toggleAddForm(): void {
    this.showAddForm.update((v) => !v);
  }

  toggleAvailability(p: Product): void {
    const id = p._id || String(p.id);
    this.adminService.toggleProductAvailability(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.toast.success('Đã cập nhật trạng thái hiển thị');
          this.loadProducts();
          this.productService.loadData();
        }
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Không thể đổi trạng thái');
      },
    });
  }

  onCreateProduct(): void {
    if (this.productForm.invalid) return;

    this.isSubmitting.set(true);
    const formVal = this.productForm.getRawValue();

    this.http.post<{ success: boolean; data: Product }>('http://localhost:5000/api/products', formVal).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        if (res.success) {
          this.toast.success('Thêm sản phẩm thành công!');
          this.productForm.reset({ stock: 10, price: 0 });
          this.showAddForm.set(false);
          this.loadProducts();
          this.productService.loadData();
        }
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.toast.error(err.error?.message || 'Không thể tạo sản phẩm');
      },
    });
  }
}
