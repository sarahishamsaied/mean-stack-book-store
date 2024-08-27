// src/app/services/base-api.service.ts
import {
  HttpClient,
  HttpEvent,
  HttpHeaders,
  HttpParams,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Config } from '../../../config/app.config';

@Injectable({
  providedIn: 'root',
})
export class BaseApiService {
  BASE_API = Config.API_BASE_URL;
  constructor(private http: HttpClient) {}

  protected get<T>(
    url: string,
    options?: any
  ): Observable<{ data: T; total: number }> {
    const params = options?.params
      ? new HttpParams({
          fromObject: {
            ...options?.params,
          },
        })
      : undefined;

    return this.http
      .get<T>(`${this.BASE_API}/${url}`, { params, observe: 'response' })
      .pipe(
        map((response: HttpResponse<T>) => {
          console.log(response.headers);
          const total = Number(response.headers.get('X-Total-Count')) || 0;
          const data = response.body as T;
          return { data, total };
        })
      );
  }

  protected post<T>(url: string, body: any, options?: any): Observable<T> {
    console.log(typeof body);
    const params = options
      ? new HttpParams({ fromObject: options })
      : undefined;
    return this.http.post<T>(`${this.BASE_API}/${url}`, body, {
      params,
    });
  }

  protected put<T>(url: string, body: any, options?: any): Observable<T> {
    const params = options
      ? new HttpParams({ fromObject: options })
      : undefined;
    return this.http.put<T>(`${this.BASE_API}/${url}`, body, {
      params,
      headers: this.getHeaders(),
    });
  }

  protected delete<T>(url: string, options?: any): Observable<T> {
    const params = options
      ? new HttpParams({ fromObject: options })
      : undefined;
    return this.http.delete<T>(`${this.BASE_API}/${url}`, {
      params,
      headers: this.getHeaders(),
    });
  }

  protected getHeaders(body?: any): HttpHeaders {
    if (body instanceof FormData) {
      console.log('formdata');
      return new HttpHeaders({
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
    } else {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
    }
  }
}
