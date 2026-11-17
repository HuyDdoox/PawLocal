import { Component, computed, input, output } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  readonly id = input<number>(0);
  readonly slug = input<string>('');
  readonly mongoId = input<string>('', { alias: '_id' });
  readonly name = input.required<string>();
  readonly price = input.required<number>();
  readonly image = input.required<string>();
  readonly oldPrice = input<number>(0);
  readonly hot = input<boolean>(false);
  readonly stock = input<number>(10);

  readonly add = output<void>();

  readonly discountPercent = computed(() => {
    const oldP = this.oldPrice();
    const curP = this.price();
    if (oldP > curP && oldP > 0) {
      return Math.round(((oldP - curP) / oldP) * 100);
    }
    return 0;
  });

  readonly routeTarget = computed(() => {
    if (this.slug()) return ['/product', this.slug()];
    if (this.id() > 0) return ['/products', this.id()];
    if (this.mongoId()) return ['/products', this.mongoId()];
    return ['/products'];
  });

  addToCart(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.stock() > 0) {
      this.add.emit();
    }
  }
}
