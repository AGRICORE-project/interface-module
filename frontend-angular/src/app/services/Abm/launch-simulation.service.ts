import { Injectable, inject } from '@angular/core';
import { AbmApiBaseService } from '../Base/abm-api-base.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewSimulationScenario } from 'src/app/models/simulation-setup/simulation-scenario';

@Injectable({
  providedIn: 'root',
})
export class LaunchSimulationService {
  _apiService: AbmApiBaseService = inject(AbmApiBaseService);
  public simulationsRunningSubject: BehaviorSubject<number>;
  public simulationsRunning: Observable<number>;

  constructor() {
    this.simulationsRunningSubject = new BehaviorSubject<number>(0);
    this.simulationsRunning = this.simulationsRunningSubject.asObservable();
  }

  launchSimulation(scenario: NewSimulationScenario) {
    return this._apiService.post(`/simulationScenario/add`, scenario);
  }

  getSimulationsRunning(): number {
    return this.simulationsRunningSubject.value;
  }
}
