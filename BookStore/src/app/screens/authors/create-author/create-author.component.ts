import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthorService } from '../../../services/author.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-author-form',
  templateUrl: './create-author.component.html',
  styleUrls: ['./create-author.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreateAuthorComponent implements OnInit {
  authorForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authorService: AuthorService,
    private toastr: ToastrService
  ) {
    this.authorForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      bio: [''],
      birthDate: [''],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.authorForm.valid) {
      console.log(this.authorForm);
      this.authorService.addAuthor(this.authorForm.value).subscribe({
        next: (author) => {
          this.toastr.success('Author added successfully!');
          this.authorForm.reset();
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
        if (this.authorForm.get(err.path)) {
          this.authorForm
            .get(err.path)
            ?.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
