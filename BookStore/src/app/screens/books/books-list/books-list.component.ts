import { Component, OnInit, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookService, Book } from '../../../services/book.service';
import { CardComponent } from '../../../card/card.component';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { SearchComponent } from '../../../search/search.component';
import { Author, AuthorService } from '../../../services/author.service';
import { FormsModule } from '@angular/forms';
import { DropdownSelectComponent } from '../../../dropdown/dropdown.component';
import { EditModalComponent } from '../../../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../../../delete-modal/delete-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.css'],
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
export class BookListComponent implements OnInit {
  books = signal<Book[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  totalBooks = signal(0);
  filteredBooks = signal<Book[]>([]);
  selectedAuthorId = signal<string | null | undefined>(null);
  authors = signal<Author[]>([]);
  searchTerm = signal('');

  selectedBook = signal<Book | null>(null);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  totalPages = computed(() => Math.ceil(this.totalBooks() / this.pageSize()));

  onEditBook(book: Book): void {
    this.selectedBook.set(book);
    this.isEditModalOpen.set(true);
  }

  onDeleteBook(book: Book): void {
    console.log(book);
    this.selectedBook.set(book);
    this.isDeleteModalOpen.set(true);
  }
  handleCardClick(id: number): void {
    this.router.navigate(['/books', id]);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedBook.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedBook.set(null);
  }

  saveEditedBook(editedBook: Book): void {
    this.bookService.updateBook(editedBook.id, editedBook).subscribe({
      next: (updatedBook) => {
        this.books.update((books) =>
          books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        this.filteredBooks.update((books) =>
          books.map((book) => (book.id === updatedBook.id ? updatedBook : book))
        );
        this.closeEditModal();
      },
      error: (err) => console.error('Error updating book:', err),
    });
  }

  getBookFields(book: Book) {
    return [
      {
        key: 'title',
        label: 'Title',
        type: 'text' as const,
        value: book.title,
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea' as const,
        value: book.description,
      },
      {
        key: 'price',
        label: 'Price',
        type: 'number' as const,
        value: book.price,
      },
      {
        key: 'pages',
        label: 'Pages',
        type: 'number' as const,
        value: book.pages,
      },
    ];
  }

  confirmDeleteBook(): void {
    if (this.selectedBook()) {
      this.bookService.deleteBook(this.selectedBook()!.id).subscribe({
        next: () => {
          this.books.update((books) =>
            books.filter((book) => book.id !== this.selectedBook()!.id)
          );
          this.filteredBooks.update((books) =>
            books.filter((book) => book.id !== this.selectedBook()!.id)
          );
          this.totalBooks.update((total) => total - 1);
          this.closeDeleteModal();
        },
        error: (err) => console.error('Error deleting book:', err),
      });
    }
  }

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
    private router: Router
  ) {
    effect(() => {
      this.loadBooks();
    });
  }

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe(({ authors }) => {
      this.authors.set(authors);
    });
  }

  loadBooks(): void {
    const where: any = {};
    const currentSearchTerm = this.searchTerm().toLowerCase().trim();

    if (currentSearchTerm) {
      where.title = { contains: currentSearchTerm };
    }

    if (this.selectedAuthorId()) {
      console.log('selected');
      where.authorId = Number(this.selectedAuthorId());
    }

    this.bookService
      .getBooks(this.currentPage() * this.pageSize(), this.pageSize(), where)
      .subscribe(({ books, total }) => {
        this.books.set(books);
        this.totalBooks.set(total);
        this.filteredBooks.set(books);
      });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
    this.currentPage.set(0);
  }

  onAuthorFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const authorId = select.value === 'null' ? null : select.value;
    this.selectedAuthorId.set(authorId);
    console.log('selected', this.selectedAuthorId());
    if (authorId === null) {
      this.filteredBooks.set(this.books());
    } else {
      this.filteredBooks.update((books) =>
        books.filter((book) => book.author.id === parseInt(authorId))
      );
    }
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
