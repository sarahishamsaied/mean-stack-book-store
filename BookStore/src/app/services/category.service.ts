import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BaseApiService } from './api/base-api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Book } from './book.service';

export interface Category {
  id: number;
  name: string;
  books?: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends BaseApiService {
  private categoriesEndpoint = 'category';
  constructor(http: HttpClient) {
    super(http);
  }
  getCategories(
    skip: number = 0,
    take: number = 10,
    where?: { [key: string]: string | number }
  ): Observable<{ categories: Category[]; total: number }> {
    const params = {
      skip: skip.toString(),
      take: take.toString(),
      where: where ? JSON.stringify(where) : '',
    };

    return this.get<Category[]>(this.categoriesEndpoint, { params }).pipe(
      map((result) => ({
        categories: result.data,
        total: result.total,
      }))
    );
  }

  getCategoryById(id: number): Observable<Category> {
    return this.get<Category>(`${this.categoriesEndpoint}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  addCategory(category: Category): Observable<Category> {
    return this.post<Category>(this.categoriesEndpoint, category).pipe(
      catchError(this.handleError)
    );
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.put<Category>(`${this.categoriesEndpoint}/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.delete<void>(`${this.categoriesEndpoint}/${id}`);
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(` ${error.status}, ${error.error} `);
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
