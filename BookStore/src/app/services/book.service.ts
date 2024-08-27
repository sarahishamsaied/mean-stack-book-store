import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseApiService } from './api/base-api.service';
import { HttpClient } from '@angular/common/http';
import { Author } from './author.service';
import { Category } from './category.service';

export interface Book {
  id: number;
  title: string;
  author: Author;
  description: string;
  cover: string;
  price: number;
  pages: number;
  stock: number;
  category: Category;
}

@Injectable({
  providedIn: 'root',
})
export class BookService extends BaseApiService {
  private booksEndpoint = 'book';
  constructor(http: HttpClient) {
    super(http);
  }
  getBooks(
    skip: number = 0,
    take: number = 10,
    where?: { [key: string]: string | number }
  ): Observable<{ books: Book[]; total: number }> {
    const params = {
      skip: skip.toString(),
      take: take.toString(),
      where: where ? JSON.stringify(where) : '',
    };

    return this.get<Book[]>(this.booksEndpoint, { params }).pipe(
      map((result) => ({
        books: result.data,
        total: result.total,
      }))
    );
  }

  getBookById(id: number): Observable<Book> {
    return this.get<Book>(`${this.booksEndpoint}/${id}`).pipe(
      map((response) => {
        console.log(response);
        return response.data;
      })
    );
  }

  addBook(book: FormData): Observable<Book> {
    return this.post(this.booksEndpoint, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.put<Book>(`${this.booksEndpoint}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    return this.delete<void>(`${this.booksEndpoint}/${id}`);
  }
}
