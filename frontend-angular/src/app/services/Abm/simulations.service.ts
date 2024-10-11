import { Injectable, inject } from '@angular/core';
import { AbmApiBaseService } from '../Base/abm-api-base.service';
import { Observable, map } from 'rxjs';
import { Log, SimulationScenario } from 'src/app/models/simulation-setup/simulation-scenario';

@Injectable({
  providedIn: 'root',
})
export class SimulationsService {
  _apiAbmService: AbmApiBaseService = inject(AbmApiBaseService);

  constructor() {}

  getSimulationScenarios(): Observable<SimulationScenario[]> {
    return this._apiAbmService.get<SimulationScenario[]>('/simulationScenario/getWithSimulationRuns').pipe(map((res) => res));
  }

  getSimulationLogs(id: number): Observable<Log[]> {
    return this._apiAbmService.get<any>(`/simulationRun/${id}/logMessage/get`);
  }

  deleteSimulation(id: number): Observable<any> {
    return this._apiAbmService.delete<any>(`/simulationScenario/${id}`, null, true);
  }
}
