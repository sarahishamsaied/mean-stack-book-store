import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { BaseApiService } from './api/base-api.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Book } from './book.service';

export interface Publisher {
  id: number;
  name: string;
  location?: string;
  books: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class PublisherService extends BaseApiService {
  private publishersEndpoint = 'publisher';
  constructor(http: HttpClient) {
    super(http);
  }
  getPublishers(
    skip: number = 0,
    take: number = 10,
    where?: { [key: string]: string | number }
  ): Observable<{ publishers: Publisher[]; total: number }> {
    const params = {
      skip: skip.toString(),
      take: take.toString(),
      where: where ? JSON.stringify(where) : '',
    };

    return this.get<Publisher[]>(this.publishersEndpoint, { params }).pipe(
      map((result) => ({
        publishers: result.data,
        total: result.total,
      }))
    );
  }

  getPublisherById(id: number): Observable<Publisher> {
    return this.get<Publisher>(`${this.publishersEndpoint}/${id}`).pipe(
      map((response) => response.data)
    );
  }

  addPublisher(publisher: Publisher): Observable<Publisher> {
    return this.post<Publisher>(this.publishersEndpoint, publisher).pipe(
      catchError(this.handleError)
    );
  }

  updatePublisher(id: number, publisher: Publisher): Observable<Publisher> {
    return this.put<Publisher>(`${this.publishersEndpoint}/${id}`, publisher);
  }

  deletePublisher(id: number): Observable<void> {
    return this.delete<void>(`${this.publishersEndpoint}/${id}`);
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
