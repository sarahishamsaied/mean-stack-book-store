import {
  Component,
  OnInit,
  signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PublisherService,
  Publisher,
} from '../../../services/publisher.service';
import { CardComponent } from '../../../card/card.component';
import { PaginationComponent } from '../../../pagination/pagination.component';
import { SearchComponent } from '../../../search/search.component';
import { FormsModule } from '@angular/forms';
import { DropdownSelectComponent } from '../../../dropdown/dropdown.component';
import { EditModalComponent } from '../../../edit-modal/edit-modal.component';
import { DeleteModalComponent } from '../../../delete-modal/delete-modal.component';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-publisher-list',
  templateUrl: './publishers-list.component.html',
  styleUrls: ['./publishers-list.component.css'],
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
export class PublisherListComponent implements OnInit {
  private publisherService = inject(PublisherService);
  private router = inject(Router);

  publishers = signal<Publisher[]>([]);
  currentPage = signal(0);
  pageSize = signal(10);
  totalPublishers = signal(0);
  searchTerm = signal('');

  selectedPublisher = signal<Publisher | null>(null);
  isEditModalOpen = signal(false);
  isDeleteModalOpen = signal(false);

  totalPages = computed(() =>
    Math.ceil(this.totalPublishers() / this.pageSize())
  );

  filteredPublishers = computed(() => {
    return this.publishers().filter((publisher) =>
      publisher.name.toLowerCase().includes(this.searchTerm().toLowerCase())
    );
  });

  constructor() {
    effect(() => {
      this.loadPublishers();
    });
  }

  ngOnInit(): void {}

  loadPublishers(): void {
    const where: any = {};
    const currentSearchTerm = this.searchTerm().toLowerCase().trim();

    if (currentSearchTerm) {
      where.name = { contains: currentSearchTerm };
    }
    this.publisherService
      .getPublishers(
        this.currentPage() * this.pageSize(),
        this.pageSize(),
        where
      )
      .subscribe(({ publishers, total }) => {
        this.publishers.set(publishers);
        this.totalPublishers.set(total);
      });
  }

  onEditPublisher(publisher: Publisher): void {
    this.selectedPublisher.set(publisher);
    this.isEditModalOpen.set(true);
  }

  onDeletePublisher(publisher: Publisher): void {
    this.selectedPublisher.set(publisher);
    this.isDeleteModalOpen.set(true);
  }

  closeEditModal(): void {
    this.isEditModalOpen.set(false);
    this.selectedPublisher.set(null);
  }

  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
    this.selectedPublisher.set(null);
  }

  saveEditedPublisher(editedPublisher: Publisher): void {
    this.publisherService
      .updatePublisher(editedPublisher.id, editedPublisher)
      .subscribe({
        next: (updatedPublisher) => {
          this.publishers.update((publishers) =>
            publishers.map((publisher) =>
              publisher.id === updatedPublisher.id
                ? updatedPublisher
                : publisher
            )
          );
          this.closeEditModal();
        },
        error: (err) => console.error('Error updating publisher:', err),
      });
  }

  confirmDeletePublisher(): void {
    if (this.selectedPublisher()) {
      this.publisherService
        .deletePublisher(this.selectedPublisher()!.id)
        .subscribe({
          next: () => {
            this.publishers.update((publishers) =>
              publishers.filter(
                (publisher) => publisher.id !== this.selectedPublisher()!.id
              )
            );
            this.totalPublishers.update((total) => total - 1);
            this.closeDeleteModal();
          },
          error: (err) => console.error('Error deleting publisher:', err),
        });
    }
  }

  handleCardClick(id: number): void {
    this.router.navigate(['/publishers', id]);
  }

  getPublisherFields(publisher: Publisher) {
    return [
      {
        key: 'name',
        label: 'Name',
        type: 'text' as const,
        value: publisher.name,
      },
      {
        key: 'location',
        label: 'Location',
        type: 'textarea' as const,
        value: publisher.location,
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
