import { Component, OnDestroy, OnInit, ViewChild, inject, signal } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout';
import { LaunchSimulationService } from 'src/app/services/Abm/launch-simulation.service';
import { SimulationsService } from 'src/app/services/Abm/simulations.service';
import { Observable, Subscription, interval, map, startWith } from 'rxjs';
import { OverallStatus, SimulationScenario } from 'src/app/models/simulation-setup/simulation-scenario';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { SimulationsTableComponent } from 'src/app/components/simulations-table/simulations-table.component';

@Component({
  selector: 'app-my-simulations',
  templateUrl: './my-simulations.component.html',
  standalone: true,
  imports: [FlexModule, MatIconModule, MatCardModule, MatPaginatorModule, SimulationsTableComponent],
})
export class MySimulationsComponent implements OnInit, OnDestroy {
  progressTable = signal(new MatTableDataSource<SimulationScenario>());
  finishedTable = signal(new MatTableDataSource<SimulationScenario>());

  _launchSimulationService: LaunchSimulationService = inject(LaunchSimulationService);
  _simulationsService: SimulationsService = inject(SimulationsService);
  _alertService: AlertService = inject(AlertService);
  interval: Observable<number> = interval(15000).pipe(startWith(0));
  simulationsSubscription: Subscription;
  isLoading: boolean = false;

  @ViewChild('progressPaginator') progressPaginator!: MatPaginator;
  @ViewChild('finishedPaginator') finishedPaginator!: MatPaginator;

  ngAfterViewInit() {
    this.progressTable.update((table) => {
      table.paginator = this.progressPaginator;
      return table;
    });
    this.finishedTable.update((table) => {
      table.paginator = this.finishedPaginator;
      return table;
    });
  }

  ngOnInit(): void {
    // set the number of running simulations to 0
    this._launchSimulationService.simulationsRunningSubject.next(0);
    this.getSimulationsData();
  }

  /*
   * Get the list of simulations by first getting a summary of all the simulations
   * and then getting the details of each simulation every 15 seconds
   */
  getSimulationsData(): void {
    this.isLoading = true;

    this.simulationsSubscription = this.interval.subscribe(() => {
      this._simulationsService
        .getSimulationScenarios()
        .pipe(
          map((scenarios) => {
            // filter scenarios that do not have a simulation run and sort it by id in descending order
            const filteredScenarios = scenarios.filter((scenario) => scenario.simulationRun).sort((a, b) => b.id - a.id);
            // preserve the expanded state of each scenario
            this.preserveExpandedState(filteredScenarios);
            // return the filtered scenarios
            return filteredScenarios;
          }),
        )
        .subscribe({
          next: (scenarios) => {
            this.progressTable.update((table) => {
              table.data = scenarios.filter((scenario) => scenario.simulationRun?.overallStatus === OverallStatus.IN_PROGRESS);
              return table;
            });
            this.finishedTable.update((table) => {
              table.data = scenarios.filter((scenario) => scenario.simulationRun?.overallStatus !== OverallStatus.IN_PROGRESS);
              return table;
            });
          },
        })
        .add(() => (this.isLoading = false));
    });
  }

  /*
   * On table data update, preserve the expanded state of each scenario
   * otherwise rows will collapse on every update
   */
  preserveExpandedState(scenarios: SimulationScenario[]): void {
    this.progressTable().data.forEach((scenario) => {
      const index = scenarios.findIndex((s) => s.id === scenario.id);
      if (index > -1) scenarios[index].expanded = scenario.expanded;
    });
    this.finishedTable().data.forEach((scenario) => {
      const index = scenarios.findIndex((s) => s.id === scenario.id);
      if (index > -1) scenarios[index].expanded = scenario.expanded;
    });
  }

  ngOnDestroy(): void {
    this.simulationsSubscription.unsubscribe();
  }
}
