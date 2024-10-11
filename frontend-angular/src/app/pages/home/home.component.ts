import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { Route } from '../../models/route-names';
import { NavigationCardComponent } from '../../components/navigation-card/navigation-card.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    standalone: true,
    imports: [NavigationCardComponent]
})
export class HomeComponent implements OnInit {

  public simulationRoute: string = '../' + Route.SIMULATION_SETUP

  constructor() { }

  ngOnInit(): void {
  }

}
