import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BaseApiService } from './api/base-api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Book } from './book.service';

export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  bio: string;
  birthDate: string;
  books?: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class AuthorService extends BaseApiService {
  private authorsEndpoint = 'author';
  constructor(http: HttpClient) {
    super(http);
  }
  getAuthors(
    skip: number = 0,
    take: number = 10,
    where?: { [key: string]: string | number }
  ): Observable<{ authors: Author[]; total: number }> {
    const params = {
      skip: skip.toString(),
      take: take.toString(),
      where: where ? JSON.stringify(where) : '',
    };

    return this.get<Author[]>(this.authorsEndpoint, { params }).pipe(
      map((result) => ({
        authors: result.data,
        total: result.total,
      }))
    );
  }

  getAuthorById(id: number): Observable<Author> {
    return this.get<Author>(`${this.authorsEndpoint}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  addAuthor(author: Author): Observable<Author> {
    return this.post<Author>(this.authorsEndpoint, author).pipe(
      catchError(this.handleError)
    );
  }

  updateAuthor(id: number, author: Author): Observable<Author> {
    return this.put<Author>(`${this.authorsEndpoint}/${id}`, author);
  }

  deleteAuthor(id: number): Observable<void> {
    return this.delete<void>(`${this.authorsEndpoint}/${id}`);
  }
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
