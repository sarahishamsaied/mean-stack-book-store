import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-delete-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-modal.component.html',
  styleUrl: './delete-modal.component.css',
})
export class DeleteModalComponent {
  @Input() resourceName!: string;
  @Input() resourceDisplayName!: string;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
}
