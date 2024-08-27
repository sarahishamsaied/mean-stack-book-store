import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Config } from '../../config/app.config';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
})
export class CardComponent {
  private _coverImage!: string;

  @Input() title!: string;
  @Input() description!: string;
  @Input() subtitle!: string;
  @Input() subtitle2!: string;
  @Input() id!: number;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() cardClick = new EventEmitter<number>();
  maxDescriptionLength = 50;

  @Input() set coverImage(value: string) {
    if (value.startsWith('https')) {
      this._coverImage = value;
    } else {
      this._coverImage = `${Config.BASE_IMG_SRC}/${value}`;
    }
  }
  get truncatedDescription(): string {
    return this.description.length > this.maxDescriptionLength
      ? this.description.substring(0, this.maxDescriptionLength) + '...'
      : this.description;
  }

  get coverImage(): string {
    return this._coverImage;
  }

  onEdit(e: Event): void {
    e.stopPropagation();
    this.edit.emit(this.id);
  }

  onCardClick(): void {
    this.cardClick.emit(this.id);
  }

  onDelete(e: Event): void {
    e.stopPropagation();
    this.delete.emit(this.id);
  }
}
