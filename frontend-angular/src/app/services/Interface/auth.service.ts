import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from 'src/app/models/user';
import { InterfaceApiBaseService } from '../Base/interface-api-base.service';
import { UserSignUp } from '../../models/register-user';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Route } from '../../models/route-names';
import { UserService } from './user.service';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private _apiService: InterfaceApiBaseService,
    private router: Router,
    private _userService: UserService,
    private _tokenService: TokenService,
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')!));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  signIn(email: string, password: string): Observable<any> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._apiService.post('/auth/login', { email, password }, httpHeaders).pipe(
      map((data: any) => {
        this._tokenService.setUserToken(data.token);
        return data.token;
      }),
    );
  }

  logout(): Observable<any> {
    localStorage.clear();
    this.currentUserSubject.next(null);
    this.router.navigate([`/${Route.AUTHENTICATION}/${Route.LOGIN}`]);
    return this._apiService.post<any>('/auth/logout', {});
  }

  registerUser(user: UserSignUp): Observable<any> {
    return this._apiService.post<any>('/auth/register', user).pipe(
      map((res) => {
        return res as string;
      }),
    );
  }

  confirmAccount(token: string): Observable<string> {
    let params = new HttpParams();
    params = params.append('token', token.toString());

    return this._apiService.get<any>('/auth/register/confirm', params).pipe(
      map((res) => {
        return res as string;
      }),
    );
  }

  storeCurrentUser(): Observable<User> {
    return this._apiService.get<User>('/auth/me').pipe(
      map((user) => {
        if (user) {
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));

          // When admin logs in, update non verified users badge value
          if (user.roles.includes('ADMIN')) {
            this._userService.getAllUsers().subscribe((res) => {
              const nonVerfiedUsers = res.filter((user) => user.verified === false);
              this._userService.newUsers.next(nonVerfiedUsers.length);
            });
          }
        }
        return user;
      }),
    );
  }

  recoverPassword(email: string): Observable<any> {
    return this._apiService.post<any>(`/auth/recoverPassword`, { email }).pipe(
      map((res) => {
        return res as string;
      }),
    );
  }

  confirmToken(token: string, email: string): Observable<any> {
    return this._apiService.post<any>(`/auth/password/confirm/`, { resetPasswordToken: token, userMail: email }).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  resetPassword(token: string, password: string, mail: string): Observable<any> {
    return this._apiService.post<any>(`/auth/newPassword`, { resetPasswordToken: token, newPassword: password, userMail: mail }).pipe(
      map((res) => {
        return res as string;
      }),
    );
  }

  setUserAbmURL(url: string): Observable<any> {
    return this._apiService.put<any>('/users/updateApiUrl', { url }).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  getCurrentUser(): User {
    return this.currentUserSubject.value;
  }
}
