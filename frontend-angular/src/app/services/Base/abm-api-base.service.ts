import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment.dev';
import { AuthService } from '../Interface/auth.service';

@Injectable({
  providedIn: 'root',
})

// Base service ABM API http requests
export class AbmApiBaseService {
  private apiUrl: string;

  constructor(
    private http: HttpClient,
    private _authService: AuthService,
  ) {
    this._authService.currentUser.subscribe((user) => (this.apiUrl = user?.apiUrl ? user?.apiUrl : `${environment.abmEndpoint}`));
  }

  get<T>(path: string, params: HttpParams = new HttpParams(), responseText: boolean = false): Observable<T> {
    let customHttpOptions = {
      params: params,
      responseType: responseText ? ('text' as 'json') : 'json',
    };

    return this.http.get<T>(`${this.apiUrl}${path}`, customHttpOptions).pipe(catchError(this.onError));
  }

  post<T>(path: string, body: object = {}): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body).pipe(catchError(this.onError));
  }

  put<T>(path: string, body: object = {}, params: HttpParams = new HttpParams()): Observable<T> {
    let customHttpOptions = {
      params: params,
    };

    return this.http.put<T>(`${this.apiUrl}${path}`, body, customHttpOptions).pipe(catchError(this.onError));
  }

  delete<T>(path: string, params: HttpParams = new HttpParams(), responseText: boolean = false): Observable<T> {
    let customHttpOptions = {
      params: params,
      responseType: responseText ? ('text' as 'json') : 'json',
    };

    return this.http.delete<T>(`${this.apiUrl}${path}`, customHttpOptions).pipe(catchError(this.onError));
  }

  private onError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
