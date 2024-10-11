import { Routes } from '@angular/router';

import { Route } from './models/route-names';

import { AuthComponent } from './auth/auth.component';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import { RecoverPasswordComponent } from './auth/recover-password/recover-password.component';
import { HomeComponent } from './pages/home/home.component';
import { PagesComponent } from './pages/pages.component';
import { SimulationSetupComponent } from './pages/simulation-setup/simulation-setup.component';
import { VisualizationComponent } from './pages/visualization/visualization.component';
import { MySimulationsComponent } from './pages/my-simulations/my-simulations.component';
import { MyCatalogueComponent } from './pages/policies/my-catalogue/my-catalogue.component';
import { GeneralCatalogueComponent } from './pages/policies/general-catalogue/general-catalogue.component';
import { UsersComponent } from './pages/users/users.component';

import { AdminGuard } from './shared/guards/admin.guard';
import { LoggedGuard } from './shared/guards/logged.guard';


export const routes: Routes = [

    { path: Route.DASHBOARD, component: PagesComponent, canActivate: [LoggedGuard],
      children : [
        { path: '', redirectTo: Route.HOME, pathMatch: "full" },
        { path: Route.HOME, component: HomeComponent },
        { path: Route.SIMULATION_SETUP, component: SimulationSetupComponent },
        { path: Route.VISUALIZATION, component: VisualizationComponent },
        { path: Route.SIMULATIONS, component: MySimulationsComponent },
        { path: Route.POLICIES, children: [
          { path: Route.MY_POLICIES, component: MyCatalogueComponent },
          { path: Route.GENERAL_POLICIES, component: GeneralCatalogueComponent }
        ]},
        { path: Route.USERS, component: UsersComponent, canActivate: [AdminGuard] },
      ]
    },
    { path: Route.AUTHENTICATION, component: AuthComponent,
      children : [
        { path: '', redirectTo: Route.LOGIN, pathMatch: 'full' },
        { path: Route.LOGIN, component: SignInComponent },
        { path: Route.SIGNUP, component: SignUpComponent },
        { path: Route.RECOVER_PASSWORD, component: RecoverPasswordComponent }
      ]
    },
    { path: '', redirectTo: Route.AUTHENTICATION, pathMatch: "full" },
];

export class AppRoutingModule { }
