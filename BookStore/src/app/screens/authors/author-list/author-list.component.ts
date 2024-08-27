import {
  Component,
  OnInit,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorService, Author } from '../../../services/author.service';
import { CardComponent } from '../../../card/card.component';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { SearchComponent } from '../../../search/search.component';
import { FormsModule } from '@angular/forms';
import { DropdownSelectComponent } from '../../../dropdown/dropdown.component';
import { EditModalComponent } from '../../../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../../../delete-modal/delete-modal.component';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-author-list',
  templateUrl: './author-list.component.html',
  styleUrls: ['./author-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    CardComponent,
    SearchComponent,
    FormsModule,
    DropdownSelectComponent,
    EditModalComponent,
    DeleteModalComponent,
  ],
})
export class AuthorListComponent implements OnInit {
  private authorService = inject(AuthorService);
  private router = inject(Router);

  authors = signal<Author[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  totalAuthors = signal(0);
  searchTerm = signal('');

  selectedAuthor = signal<Author | null>(null);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  totalPages = computed(() => Math.ceil(this.totalAuthors() / this.pageSize()));

  filteredAuthors = computed(() => {
    return this.authors().filter(
      (author) =>
        author.firstName
          .toLowerCase()
          .includes(this.searchTerm().toLowerCase()) ||
        author.lastName.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });

  constructor() {
    effect(() => {
      this.loadAuthors();
    });
  }

  ngOnInit(): void {}

  loadAuthors(): void {
    const where: any = {};
    const currentSearchTerm = this.searchTerm().toLowerCase().trim();

    if (currentSearchTerm) {
      where.firstName = { contains: currentSearchTerm };
    }

    this.authorService
      .getAuthors(this.currentPage() * this.pageSize(), this.pageSize(), where)
      .subscribe(({ authors, total }) => {
        this.authors.set(authors);
        this.totalAuthors.set(total);
      });
  }

  onEditAuthor(author: Author): void {
    this.selectedAuthor.set(author);
    this.isEditModalOpen.set(true);
  }

  onDeleteAuthor(author: Author): void {
    this.selectedAuthor.set(author);
    this.isDeleteModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedAuthor.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedAuthor.set(null);
  }

  saveEditedAuthor(editedAuthor: Author): void {
    this.authorService.updateAuthor(editedAuthor.id, editedAuthor).subscribe({
      next: (updatedAuthor) => {
        this.authors.update((authors) =>
          authors.map((author) =>
            author.id === updatedAuthor.id ? updatedAuthor : author
          )
        );
        this.closeEditModal();
      },
      error: (err) => console.error('Error updating author:', err),
    });
  }

  confirmDeleteAuthor(): void {
    if (this.selectedAuthor()) {
      this.authorService.deleteAuthor(this.selectedAuthor()!.id).subscribe({
        next: () => {
          this.authors.update((authors) =>
            authors.filter((author) => author.id !== this.selectedAuthor()!.id)
          );
          this.totalAuthors.update((total) => total - 1);
          this.closeDeleteModal();
        },
        error: (err) => console.error('Error deleting author:', err),
      });
    }
  }

  handleCardClick(id: number): void {
    this.router.navigate(['/authors', id]);
  }

  getAuthorFields(author: Author) {
    return [
      {
        key: 'firstName',
        label: 'First Name',
        type: 'text' as const,
        value: author.firstName,
      },
      {
        key: 'lastName',
        label: 'Last Name',
        type: 'text' as const,
        value: author.lastName,
      },
      {
        key: 'bio',
        label: 'Bio',
        type: 'textarea' as const,
        value: author.bio,
      },
      {
        key: 'birthDate',
        label: 'Birth Date',
        type: 'date' as const,
        value: author.birthDate,
      },
    ];
  }

  onSearch(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
    this.currentPage.set(0);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.pageSize.set(itemsPerPage);
    this.currentPage.set(0);
  }
}
