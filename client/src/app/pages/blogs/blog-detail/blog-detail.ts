import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BlogService } from '../../../services/blog.service';
import { Blog } from '../../../models/blog.model';

@Component({
  selector: 'app-blog-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog-detail.html',
  styleUrl: './blog-detail.css',
})
export class BlogDetail {
  private readonly route = inject(ActivatedRoute);
  readonly blogService = inject(BlogService);

  readonly blog = computed<Blog | undefined>(() => {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return undefined;
    return this.blogService.getBlogBySlug(slug);
  });
}
