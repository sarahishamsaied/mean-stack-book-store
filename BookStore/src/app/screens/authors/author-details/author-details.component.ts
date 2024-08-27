import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorService, Author } from '../../../services/author.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-details',
  templateUrl: './author-details.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./author-details.component.css'],
})
export class AuthorDetailsComponent implements OnInit {
  author?: Author;

  constructor(
    private authorService: AuthorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAuthor();
  }

  loadAuthor(): void {
    const authorId = this.route.snapshot.paramMap.get('id');
    if (authorId) {
      this.authorService.getAuthorById(+authorId).subscribe((author) => {
        this.author = author;
      });
    }
  }

  editAuthor(): void {
    this.router.navigate(['/authors', this.author?.id]);
  }

  deleteAuthor(): void {
    if (
      this.author &&
      confirm('Are you sure you want to delete this author?')
    ) {
      this.authorService.deleteAuthor(this.author.id).subscribe(() => {
        this.router.navigate(['/authors']);
      });
    }
  }

  viewBookDetails(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }
}
