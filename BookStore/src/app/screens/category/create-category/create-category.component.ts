import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CategoryService } from '../../../services/category.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-form',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateCategoryComponent implements OnInit {
  categoryForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private toastr: ToastrService
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.categoryForm.valid) {
      console.log(this.categoryForm);
      this.categoryService.addCategory(this.categoryForm.value).subscribe({
        next: (category) => {
          this.toastr.success('Category added successfully!');
          this.categoryForm.reset();
        },
        error: (err) => {
          this.handleServerErrors(err);
          this.toastr.error('Failed to add category');
        },
      });
    } else {
      this.toastr.error('Please fill in all required fields');
    }
  }
  private handleServerErrors(error: any): void {
    if (error && error.errors) {
      error.errors.forEach((err: { path: string; message: string }) => {
        if (this.categoryForm.get(err.path)) {
          this.categoryForm
            .get(err.path)
            ?.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
