import { Component, signal, computed, inject, input, effect } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products {
  readonly productService = inject(ProductService);

  readonly slug = input<string>('');
  readonly search = input<string>('');

  readonly keyword = signal('');
  readonly categorySlug = signal('');
  readonly sortBy = signal('default');
  readonly isSortOpen = signal(false);

  readonly sortOptions = [
    { value: 'default', label: 'Mặc định' },
    { value: 'hot', label: 'Bán chạy nhất' },
    { value: 'price-asc', label: 'Giá: Thấp ➔ Cao' },
    { value: 'price-desc', label: 'Giá: Cao ➔ Thấp' },
    { value: 'newest', label: 'Mới nhất' },
  ];

  readonly currentSortLabel = computed(() => {
    const found = this.sortOptions.find((o) => o.value === this.sortBy());
    return found ? found.label : 'Mặc định';
  });

  constructor() {
    effect(() => {
      const s = this.slug();
      if (s) {
        this.categorySlug.set(s);
      }
    });

    effect(() => {
      const q = this.search();
      if (q) {
        this.keyword.set(q);
      }
    });
  }

  readonly filteredProducts = computed(() => {
    let result = [...this.productService.products()];

    // 1. Search keyword
    const kw = this.keyword().trim().toLowerCase();
    if (kw) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(kw) ||
          (p.description && p.description.toLowerCase().includes(kw))
      );
    }

    // 2. Category filter
    const cat = this.categorySlug();
    if (cat && cat !== 'tat-ca') {
      result = result.filter(
        (p) =>
          p.categorySlug === cat ||
          p.slug === cat ||
          String(p.categoryId) === cat ||
          (typeof p.category === 'object' && p.category?.slug === cat)
      );
    }

    // 3. Sorting
    if (this.sortBy() === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (this.sortBy() === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (this.sortBy() === 'newest') {
      result.sort((a, b) => (b.id || 0) - (a.id || 0));
    } else if (this.sortBy() === 'hot') {
      result.sort((a, b) => Number(b.hot) - Number(a.hot));
    }

    return result;
  });

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.keyword.set(input.value);
  }

  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.categorySlug.set(select.value);
  }

  selectCategory(slug: string): void {
    this.categorySlug.set(slug);
  }

  selectSort(sortKey: string): void {
    this.sortBy.set(sortKey);
    this.isSortOpen.set(false);
  }

  toggleSortDropdown(event: Event): void {
    event.stopPropagation();
    this.isSortOpen.update((v) => !v);
  }

  closeSortDropdown(): void {
    this.isSortOpen.set(false);
  }

  onSelectSort(val: string): void {
    this.sortBy.set(val);
    this.isSortOpen.set(false);
  }

  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.sortBy.set(select.value);
  }

  resetFilters(): void {
    this.keyword.set('');
    this.categorySlug.set('');
    this.sortBy.set('default');
    this.isSortOpen.set(false);
  }

  onAddToCart(product: Product): void {
    this.productService.addToCart(product);
  }
}
