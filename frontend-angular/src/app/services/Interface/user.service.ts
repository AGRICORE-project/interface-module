import { Injectable } from '@angular/core';
import { InterfaceApiBaseService } from '../Base/interface-api-base.service';
import { map, Observable, BehaviorSubject } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  newUsers: BehaviorSubject<number> = new BehaviorSubject<number>(null)

  constructor(private _apiService: InterfaceApiBaseService) { }

  getAllUsers(): Observable<User[]> {
    return this._apiService.get<User[]>('/users').pipe(
      map(res => {
        const users = res
        return users;
      })
    )
  }

  getUser(email: string): Observable<User> {
    return this._apiService.get<User>(`/users/${email}`)
    .pipe(map(res => {
      const user: User = res;
      return user;
    }));
  }

  verifyUser(id: number): Observable<string> {
    return this._apiService.get<string>(`/users/enableUser/${id}`)
    .pipe(map(res => {
      return res
    }));
  }

  updateUser(user: User): Observable<User> {
    return this._apiService.put<User>('/users', user)
    .pipe(map(res => {
      const updatedUser: User = res;
      return updatedUser;
    }));
  }

  deleteUser(email: string): Observable<any> {
    return this._apiService.delete<any>(`/users/${email}`)
    .pipe(map(res => {
      return res
    }));
  }
}
