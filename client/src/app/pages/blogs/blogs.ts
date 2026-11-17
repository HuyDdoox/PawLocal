import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blogs.html',
  styleUrl: './blogs.css',
})
export class Blogs {
  readonly blogService = inject(BlogService);
}
