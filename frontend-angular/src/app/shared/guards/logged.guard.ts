import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from 'src/app/models/route-names';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { AuthService } from 'src/app/services/Interface/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard  {

  constructor( private _authService: AuthService, private _alertService: AlertService, private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = this._authService.getCurrentUser()

    if (!currentUser) {
      this._alertService.alertError('You are currently not logged in')
      this.router.navigate([`/${Route.AUTHENTICATION}/${Route.LOGIN}`])
      return false;
    }

    return true;
  }
  
}
