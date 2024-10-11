import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { SimulationSetup } from 'src/app/models/simulation-setup/simulation-setup';
import { SimulationSetupService } from 'src/app/services/Interface/simulation-setup.service';
import { JsonPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { LaunchSimulationService } from 'src/app/services/Abm/launch-simulation.service';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NewSimulationScenario } from 'src/app/models/simulation-setup/simulation-scenario';

@Component({
  selector: 'app-launch-simulation',
  templateUrl: './launch-simulation.component.html',
  styleUrls: ['./launch-simulation.component.scss'],
  standalone: true,
  imports: [MatCardModule, FlexModule, MatButtonModule, MatIconModule, JsonPipe, MatProgressSpinnerModule],
})
export class LaunchSimulationComponent implements OnInit, OnDestroy {
  _simulationSetupService: SimulationSetupService = inject(SimulationSetupService);
  _launchSimulationService: LaunchSimulationService = inject(LaunchSimulationService);
  _alertService: AlertService = inject(AlertService);
  simulationSetup: SimulationSetup;
  simulationSubscription: Subscription;
  isLoading: boolean = false;
  isLaunched: boolean = false;
  scenario: NewSimulationScenario;

  constructor() {}

  ngOnInit(): void {
    this.simulationSubscription = this._simulationSetupService.getSimulationSetup().subscribe((simulationSetup) => {
      this.simulationSetup = simulationSetup;
      this.isLaunched = false;
      // check if simulation setup has a synthetic population, policies and configuration
      if (Object.keys(this.simulationSetup).length < 3) return;
      // set simulation body scenario
      const { id } = this.simulationSetup.syntheticPopulation.population;
      const { longTermBranch, shortTermBranch, simulationHorizon, queueSuffix, ignoreLP, ignoreLMM, compress } = this.simulationSetup.configuration;
      const additionalPolicies = this.simulationSetup.policiesList.additionalPolicies;
      this.scenario = {
        syntheticPopulationId: id,
        horizon: simulationHorizon,
        longTermModelBranch: longTermBranch,
        shortTermModelBranch: shortTermBranch,
        queueSuffix: queueSuffix || '',
        ignoreLMM: !!ignoreLMM,
        ignoreLP: !!ignoreLP,
        compress: !!compress,
        additionalPolicies: additionalPolicies.map((x) => ({ ...x, economicCompensation: x.isCoupled ? 0 : x.economicCompensation })),
      };
    });
  }

  launchSimulation(): void {
    if (!this.scenario) {
      this._alertService.alertError('Simulation setup is not valid');
      return;
    }
    this.isLoading = true;

    this._launchSimulationService
      .launchSimulation(this.scenario)
      .subscribe({
        next: () => {
          this.isLaunched = true;
          const currentSimulations = this._launchSimulationService.getSimulationsRunning();
          this._launchSimulationService.simulationsRunningSubject.next(currentSimulations + 1);
          this._alertService.alertSuccess('Simulation launched successfully');
        },
        error: (err) => this._alertService.alertError(err),
      })
      .add(() => (this.isLoading = false));
  }

  ngOnDestroy(): void {
    this.simulationSubscription.unsubscribe();
  }
}
