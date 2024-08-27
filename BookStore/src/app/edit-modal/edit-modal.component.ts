import { Component } from '@angular/core';
import { Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-edit-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-modal.component.html',
  styleUrl: './edit-modal.component.css',
})
export class EditModalComponent {
  @Input() resource!: any;
  @Input() resourceName!: string;
  @Input() fields!: {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'date';
  }[];
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();

  editedResource: any;

  ngOnInit() {
    this.editedResource = { ...this.resource };
  }

  onSubmit() {
    this.save.emit(this.editedResource);
  }
}
