import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Route } from 'src/app/models/route-names';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { AuthService } from 'src/app/services/Interface/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {

  constructor( private _authService: AuthService, private _alertService: AlertService, private router: Router ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const currentUser = this._authService.getCurrentUser()
    
    if (!currentUser.roles.includes('ADMIN')) {
      this.router.navigate([`/${Route.DASHBOARD}`]);
      this._alertService.alertError('You do not have permission to access this path')
      return false;
    }
    
    return true;

  }
}
