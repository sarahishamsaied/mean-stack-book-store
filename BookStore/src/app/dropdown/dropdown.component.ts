import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dropdown-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.css'],
})
export class DropdownSelectComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() valueKey: string = 'id';
  @Input() displayKey: string = 'name';
  @Input() selectedValue: any = null;
  @Output() valueChange = new EventEmitter<any>();

  constructor() {}

  ngOnInit(): void {}

  onValueChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.valueChange.emit(value ? Number(value) : null);
  }
}
