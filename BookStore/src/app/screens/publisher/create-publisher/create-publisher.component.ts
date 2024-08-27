import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PublisherService } from '../../../services/publisher.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publisher-form',
  templateUrl: './create-publisher.component.html',
  styleUrls: ['./create-publisher.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class CreatePublisherComponent implements OnInit {
  publisherForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private publisherService: PublisherService,
    private toastr: ToastrService
  ) {
    this.publisherForm = this.fb.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.publisherForm.valid) {
      console.log(this.publisherForm);
      this.publisherService.addPublisher(this.publisherForm.value).subscribe({
        next: (publisher) => {
          this.toastr.success('Publisher added successfully!');
          this.publisherForm.reset();
        },
        error: (err) => {
          this.handleServerErrors(err);
          this.toastr.error('Failed to add publisher');
        },
      });
    } else {
      this.toastr.error('Please fill in all required fields');
    }
  }
  private handleServerErrors(error: any): void {
    if (error && error.errors) {
      error.errors.forEach((err: { path: string; message: string }) => {
        if (this.publisherForm.get(err.path)) {
          this.publisherForm
            .get(err.path)
            ?.setErrors({ serverError: err.message });
        }
      });
    }
  }
}
