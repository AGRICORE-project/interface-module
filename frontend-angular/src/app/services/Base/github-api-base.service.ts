import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class GithubApiBaseService {

  private apiUrl = `${environment.gitHubEndpoint}`;
  private token = `${environment.gitHubToken}`;
  
  private customHeaders = { 
    'Authorization': `Bearer ${this.token}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
};

  constructor(private http: HttpClient) { }

  get<T>(path: string): Observable<T> {
      return this.http.get<T>(`${this.apiUrl}${path}`, { headers: this.customHeaders })
          .pipe(catchError(this.onError));
  }

  post<T>(path: string, body: object = {}): Observable<T> {
      return this.http.post<T>(`${this.apiUrl}${path}`, body, { headers: this.customHeaders })
          .pipe(catchError(this.onError));
  }

  put<T>(path: string, body: object = {}): Observable<T> {
      return this.http.put<T>(`${this.apiUrl}${path}`, body, { headers: this.customHeaders })
          .pipe(catchError(this.onError));
  }

  delete<T>(path: string, body: object = {}): Observable<T> {
      return this.http.delete<T>(`${this.apiUrl}${path}`, { headers: this.customHeaders })
          .pipe(catchError(this.onError));
  }


  private onError(error: any): Observable<never> {
      return throwError(() => error);
  }
}
