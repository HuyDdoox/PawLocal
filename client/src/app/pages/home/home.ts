import { Component } from '@angular/core';
import { SectionHero } from './sections/section-hero/section-hero';
import { SectionQuickActions } from './sections/section-quick-actions/section-quick-actions';
import { SectionProducts } from './sections/section-products/section-products';
import { SectionServices } from './sections/section-services/section-services';
import { SectionFeedback } from './sections/section-feedback/section-feedback';
import { SectionNewsletter } from './sections/section-newsletter/section-newsletter';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SectionHero,
    SectionQuickActions,
    SectionProducts,
    SectionServices,
    SectionFeedback,
    SectionNewsletter,
  ],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
