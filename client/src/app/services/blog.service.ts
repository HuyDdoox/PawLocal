import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Blog } from '../models/blog.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/blogs`;

  readonly blogs = signal<Blog[]>([]);
  readonly loading = signal<boolean>(false);

  constructor() {
    this.loadBlogs();
  }

  loadBlogs(): void {
    this.loading.set(true);
    this.http.get<{ success: boolean; data: Blog[] }>(this.API_URL).subscribe({
      next: (res) => {
        if (res?.data) {
          this.blogs.set(res.data);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Không thể kết nối API blogs từ MongoDB:', err);
        this.loading.set(false);
      },
    });
  }

  getBlogBySlug(slug: string): Blog | undefined {
    return this.blogs().find((b) => b.slug === slug || String(b.id) === slug);
  }
}
