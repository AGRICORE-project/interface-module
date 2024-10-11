import { Injectable } from '@angular/core';
import { local } from 'd3';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private tokenSubject: BehaviorSubject<string>;
  public token: Observable<string>;

  constructor() {
    this.tokenSubject = new BehaviorSubject<string>(localStorage.getItem('token'));
    this.token = this.tokenSubject.asObservable();
  }

  getUserToken(): string {
    return this.tokenSubject.value;
  }

  setUserToken(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSubject.next(token);
  }
}
