import {
  Component,
  OnInit,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService, Category } from '../../../services/category.service';
import { CardComponent } from '../../../card/card.component';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { SearchComponent } from '../../../search/search.component';
import { FormsModule } from '@angular/forms';
import { DropdownSelectComponent } from '../../../dropdown/dropdown.component';
import { EditModalComponent } from '../../../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../../../delete-modal/delete-modal.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    CardComponent,
    SearchComponent,
    FormsModule,
    DropdownSelectComponent,
    EditModalComponent,
    DeleteModalComponent,
  ],
})
export class CategoryListComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private router = inject(Router);

  categories = signal<Category[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  totalCategorys = signal(0);
  searchTerm = signal('');

  selectedCategory = signal<Category | null>(null);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  totalPages = computed(() =>
    Math.ceil(this.totalCategorys() / this.pageSize())
  );

  filteredCategorys = computed(() => {
    return this.categories().filter((category) =>
      category.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });

  constructor() {
    effect(() => {
      this.loadCategories();
    });
  }

  ngOnInit(): void {}

  loadCategories(): void {
    const where: any = {};
    const currentSearchTerm = this.searchTerm().toLowerCase().trim();

    if (currentSearchTerm) {
      where.name = { contains: currentSearchTerm };
    }

    this.categoryService
      .getCategories(
        this.currentPage() * this.pageSize(),
        this.pageSize(),
        where
      )
      .subscribe(({ categories, total }) => {
        console.log(categories);
        this.categories.set(categories);
        this.totalCategorys.set(total);
      });
  }

  onEditCategory(category: Category): void {
    this.selectedCategory.set(category);
    this.isEditModalOpen.set(true);
  }

  onDeleteCategory(category: Category): void {
    this.selectedCategory.set(category);
    this.isDeleteModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedCategory.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedCategory.set(null);
  }

  saveEditedCategory(editedCategory: Category): void {
    this.categoryService
      .updateCategory(editedCategory.id, editedCategory)
      .subscribe({
        next: (updatedCategory) => {
          this.categories.update((categories) =>
            categories.map((category) =>
              category.id === updatedCategory.id ? updatedCategory : category
            )
          );
          this.closeEditModal();
        },
        error: (err) => console.error('Error updating category:', err),
      });
  }

  confirmDeleteCategory(): void {
    if (this.selectedCategory()) {
      this.categoryService
        .deleteCategory(this.selectedCategory()!.id)
        .subscribe({
          next: () => {
            this.categories.update((categories) =>
              categories.filter(
                (category) => category.id !== this.selectedCategory()!.id
              )
            );
            this.totalCategorys.update((total) => total - 1);
            this.closeDeleteModal();
          },
          error: (err) => console.error('Error deleting category:', err),
        });
    }
  }

  handleCardClick(id: number): void {
    this.router.navigate(['/categories', id]);
  }

  getCategoryFields(category: Category) {
    return [
      {
        key: 'name',
        label: 'Category Name',
        type: 'text' as const,
        value: category.name,
      },
    ];
  }

  onSearch(searchTerm: string): void {
    this.searchTerm.set(searchTerm);
    this.currentPage.set(0);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.pageSize.set(itemsPerPage);
    this.currentPage.set(0);
  }
}
