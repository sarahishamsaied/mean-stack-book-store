import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { BookListComponent } from './screens/books/books-list/books-list.component';
import { BookDetailsComponent } from './screens/books/book-details/book-details.component';
import { AuthorListComponent } from './screens/authors/author-list/author-list.component';
import { AuthorDetailsComponent } from './screens/authors/author-details/author-details.component';
import { CreateBookFormComponent } from './screens/books/create-book/create-book.component';
import { CreateAuthorComponent } from './screens/authors/create-author/create-author.component';
import { PublisherListComponent } from './screens/publisher/publishers-list/publishers-list.component';
import { CreatePublisherComponent } from './screens/publisher/create-publisher/create-publisher.component';
import { CategoryListComponent } from './screens/category/categories-list/categories-list.component';
import { CategoryDetailsComponent } from './screens/category/category-details/category-details.component';
import { CreateCategoryComponent } from './screens/category/create-category/create-category.component';
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'books', component: BookListComponent },
  { path: 'books/:id', component: BookDetailsComponent },
  { path: 'authors', component: AuthorListComponent },
  { path: 'authors/:id', component: AuthorDetailsComponent },
  { path: 'create-book', component: CreateBookFormComponent },
  { path: 'create-author', component: CreateAuthorComponent },
  { path: 'publishers', component: PublisherListComponent },
  { path: 'create-publisher', component: CreatePublisherComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/:id', component: CategoryDetailsComponent },
  { path: 'create-category', component: CreateCategoryComponent },
  { path: '**', redirectTo: '' },
];
