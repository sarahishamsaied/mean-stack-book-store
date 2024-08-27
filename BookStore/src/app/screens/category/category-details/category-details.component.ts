// src/app/category-details/category-details.component.ts
import { Component, signal, computed, effect, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService, Category } from '../../../services/category.service';
import { CommonModule } from '@angular/common';
import { EditModalComponent } from '../../../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../../../delete-modal/delete-modal.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  selector: 'app-category-details',
  templateUrl: './category-details.component.html',
  standalone: true,
  styleUrls: ['./category-details.component.css'],
  imports: [CommonModule, EditModalComponent, DeleteModalComponent],
})
export class CategoryDetailsComponent {
  private categoryService = inject(CategoryService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  category = signal<Category | undefined>(undefined);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  categoryId = toSignal(
    this.route.paramMap.pipe(map((params) => params.get('id')))
  );

  constructor() {
    effect(() => this.loadCategory());
  }

  loadCategory(): void {
    const id = this.categoryId();
    if (id) {
      this.categoryService.getCategoryById(+id).subscribe((category) => {
        this.category.set(category);
      });
    }
  }

  deleteCategory = () => this.isDeleteModalOpen.set(true);

  closeEditModal = () => this.isEditModalOpen.set(false);

  saveEditedCategory(editedCategory: Category): void {
    this.categoryService
      .updateCategory(editedCategory.id, editedCategory)
      .subscribe({
        next: (updatedCategory) => {
          this.category.set(updatedCategory);
          this.isEditModalOpen.set(false);
          console.log('Category updated successfully:', updatedCategory);
        },
        error: (err) => console.error('Error updating category:', err),
      });
  }

  closeDeleteModal = () => this.isDeleteModalOpen.set(false);

  getCategoryFields = computed(() => {
    const category = this.category();
    return category
      ? [
          {
            key: 'title',
            label: 'Title',
            type: 'text' as const,
            value: category.name,
          },
        ]
      : [];
  });

  confirmDeleteCategory(): void {
    const category = this.category();
    if (category) {
      this.categoryService.deleteCategory(category.id).subscribe(() => {
        this.closeDeleteModal();
        this.goBack();
      });
    }
  }

  goBack = () => this.router.navigate(['/categorys']);

  editCategory = () => this.isEditModalOpen.set(true);

  viewBookDetails(bookId: number): void {
    this.router.navigate(['/books', bookId]);
  }
}
