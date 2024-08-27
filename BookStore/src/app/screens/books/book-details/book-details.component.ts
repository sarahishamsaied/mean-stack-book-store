// src/app/book-details/book-details.component.ts
import { Component, signal, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookService, Book } from '../../../services/book.service';
import { CommonModule } from '@angular/common';
import { EditModalComponent } from '../../../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../../../delete-modal/delete-modal.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { Config } from '../../../../config/app.config';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  standalone: true,
  styleUrls: ['./book-details.component.css'],
  imports: [CommonModule, EditModalComponent, DeleteModalComponent],
})
export class BookDetailsComponent {
  private bookService = inject(BookService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  book = signal<Book | undefined>(undefined);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  bookId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  constructor() {
    effect(() => this.loadBook());
  }

  loadBook(): void {
    const id = this.bookId();
    if (id) {
      this.bookService.getBookById(+id).subscribe((book) => {
        if (book.cover && !book.cover.startsWith('http')) {
          book.cover = `${Config.API_BASE_URL}/${book.cover}`;
        }
        this.book.set(book);
      });
    }
  }

  deleteBook = () => this.isDeleteModalOpen.set(true);

  closeEditModal = () => this.isEditModalOpen.set(false);

  saveEditedBook(editedBook: Book): void {
    this.bookService.updateBook(editedBook.id, editedBook).subscribe({
      next: (updatedBook) => {
        this.book.set(updatedBook);
        this.isEditModalOpen.set(false);
        console.log('Book updated successfully:', updatedBook);
      },
      error: (err) => console.error('Error updating book:', err),
    });
  }

  closeDeleteModal = () => this.isDeleteModalOpen.set(false);

  getBookFields = computed(() => {
    const book = this.book();
    return book
      ? [
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
        ]
      : [];
  });

  confirmDeleteBook(): void {
    const book = this.book();
    if (book) {
      this.bookService.deleteBook(book.id).subscribe(() => {
        this.closeDeleteModal();
        this.goBack();
      });
    }
  }

  goBack = () => this.router.navigate(['/books']);

  editBook = () => this.isEditModalOpen.set(true);
}
