import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthorService, Author } from '../../../services/author.service';
import {
  Publisher,
  PublisherService,
} from '../../../services/publisher.service';
import { Category, CategoryService } from '../../../services/category.service';
import { Book, BookService } from '../../../services/book.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-book.component.html',
  styleUrls: ['./create-book.component.css'],
})
export class CreateBookFormComponent implements OnInit {
  createBookForm: FormGroup;
  authors: Author[] = [];
  publishers: Publisher[] = [];
  categories: Category[] = [];
  fileToUpload: File | null = null;
  alertMessage: string = '';
  alertType: 'success' | 'error' | '' = '';

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private publisherService: PublisherService,
    private categoryService: CategoryService,
    private bookService: BookService,
    private toastr: ToastrService
  ) {
    this.createBookForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      isbn: ['', Validators.required],
      publishDate: ['', Validators.required],
      pages: [0, Validators.required],
      authorId: [0, Validators.required],
      price: [0, Validators.required],
      stock: [0, Validators.required],
      publisherId: [0, Validators.required],
      categoryId: [0, Validators.required],
    });
  }
  onFileSelect(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      this.fileToUpload = fileList[0];
    }
  }

  ngOnInit(): void {
    this.authorService.getAuthors().subscribe(({ authors }) => {
      this.authors = authors;
    });
    this.publisherService.getPublishers().subscribe(({ publishers }) => {
      this.publishers = publishers;
    });

    this.categoryService.getCategories().subscribe(({ categories }) => {
      this.categories = categories;
    });
  }
  onSubmit(): void {
    if (this.createBookForm.valid && this.fileToUpload) {
      const formData: FormData = new FormData();
      Object.keys(this.createBookForm.value).forEach((key) => {
        formData.append(key, this.createBookForm.get(key)!.value.toString());
      });
      formData.append('cover', this.fileToUpload, this.fileToUpload.name);

      this.bookService.addBook(formData).subscribe({
        next: (author) => {
          this.toastr.success('Author added successfully!');
          this.createBookForm.reset();
        },
        error: (err) => {
          this.handleServerErrors(err);
          this.toastr.error('Failed to add author');
        },
      });
    } else {
      this.toastr.error('Please fill in all required fields');
    }
  }
  private handleServerErrors(error: any): void {
    if (error && error.errors) {
      error.errors.forEach((err: { path: string; message: string }) => {
        if (this.createBookForm.get(err.path)) {
          this.createBookForm
            .get(err.path)
            ?.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
