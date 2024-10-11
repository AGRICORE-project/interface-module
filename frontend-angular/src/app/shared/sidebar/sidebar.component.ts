import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, inject } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/Interface/auth.service';
import { UserService } from 'src/app/services/Interface/user.service';
import { Route } from '../../models/route-names';
import { BreadcrumbModule } from 'xng-breadcrumb';
import { MatBadgeModule } from '@angular/material/badge';
import { NgIf, TitleCasePipe } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { RouterLinkActive, RouterLink, RouterOutlet } from '@angular/router';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Subscription } from 'rxjs';
import { LaunchSimulationService } from 'src/app/services/Abm/launch-simulation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: true,
  imports: [
    MatSidenavModule,
    FlexModule,
    RouterLinkActive,
    RouterLink,
    MatIconModule,
    MatExpansionModule,
    NgIf,
    MatBadgeModule,
    BreadcrumbModule,
    RouterOutlet,
    TitleCasePipe,
  ],
})
export class SidebarComponent implements OnInit /*, AfterContentChecked */, OnDestroy {
  homeRoute: string = Route.HOME;
  setupRoute: string = Route.SIMULATION_SETUP;
  visualizationRoute: string = Route.VISUALIZATION;
  simulationsRoute: string = Route.SIMULATIONS;
  usersRoute: string = Route.USERS;
  myPoliciesRoute: string = Route.POLICIES + '/' + Route.MY_POLICIES;
  generalPoliciesRoute: string = Route.POLICIES + '/' + Route.GENERAL_POLICIES;

  currentUser: User;

  newUsersBadge: number;
  hideUserBadge: boolean = false;
  newUsersSubscription: Subscription;

  simulationsBadge: number;
  hideSimulationBadge: boolean = false;
  simulationsSubscription: Subscription;

  _launchSimulationService: LaunchSimulationService = inject(LaunchSimulationService);

  constructor(
    private _authService: AuthService,
    private _userService: UserService,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this.checkNewUsers();
    this.checkRunningSimulations();
  }

  checkNewUsers(): void {
    if (this.currentUser?.roles.includes('ADMIN')) {
      this.newUsersSubscription = this._userService.newUsers.subscribe((value) => {
        // Set user badge and hide badge if there are no new users
        this.newUsersBadge = value;
        value !== 0 ? (this.hideUserBadge = false) : (this.hideUserBadge = true);
      });
    }
  }

  checkRunningSimulations(): void {
    this.simulationsSubscription = this._launchSimulationService.simulationsRunning.subscribe((value) => {
      // Set simulation badge and hide badge if there are no running simulations
      this.simulationsBadge = value;
      value !== 0 ? (this.hideSimulationBadge = false) : (this.hideSimulationBadge = true);
    });
  }

  /* Fixes https://angular.io/errors/NG0100 */
  // TODO: check better way to fix this
  ngAfterContentChecked() {
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.cd.detach();
    this.newUsersSubscription.unsubscribe();
    this.simulationsSubscription.unsubscribe();
  }
}
