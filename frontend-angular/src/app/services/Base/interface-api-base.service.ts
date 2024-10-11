import { Injectable, inject } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment.dev';
import { TokenService } from '../Interface/token.service';

@Injectable({
  providedIn: 'root',
})
export class InterfaceApiBaseService {
  private apiUrl = `${environment.interfaceEndpoint}`;
  private _tokenService = inject(TokenService);
  private token: string = '';

  constructor(private http: HttpClient) {
    this._tokenService.token.subscribe((token) => (this.token = token));
  }

  get httpHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      withCredentials: 'true',
      Authorization: this.token,
    });
  }

  get<T>(path: string, params: HttpParams = new HttpParams(), headers: HttpHeaders = null): Observable<T> {
    if (!headers) headers = this.httpHeaders;
    return this.http.get<T>(`${this.apiUrl}${path}`, { headers, params: params }).pipe(catchError(this.onError));
  }

  post<T>(path: string, body: object = {}, headers: HttpHeaders = null): Observable<T> {
    if (!headers) headers = this.httpHeaders;
    return this.http.post<T>(`${this.apiUrl}${path}`, body, { headers }).pipe(catchError(this.onError));
  }

  put<T>(path: string, body: object = {}, headers: HttpHeaders = null): Observable<T> {
    if (!headers) headers = this.httpHeaders;
    return this.http.put<T>(`${this.apiUrl}${path}`, body, { headers }).pipe(catchError(this.onError));
  }

  delete<T>(path: string, body: object = {}, headers: HttpHeaders = null): Observable<T> {
    if (!headers) headers = this.httpHeaders;
    return this.http.delete<T>(`${this.apiUrl}${path}`, { headers }).pipe(catchError(this.onError));
  }

  private onError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
