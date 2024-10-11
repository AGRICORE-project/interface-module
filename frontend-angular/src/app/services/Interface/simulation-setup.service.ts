import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SimulationSetup } from '../../models/simulation-setup/simulation-setup';
import { ProductGroup } from 'src/app/models/simulation-setup/product-group';

@Injectable({
  providedIn: 'root',
})
export class SimulationSetupService {
  simulationSetup: SimulationSetup = new SimulationSetup();
  public simulationSetupSubject: BehaviorSubject<SimulationSetup> = new BehaviorSubject(this.simulationSetup);
  public currentSimulationProducts: BehaviorSubject<ProductGroup[]> = new BehaviorSubject<ProductGroup[]>(null);

  constructor() {}

  getSimulationSetup(): Observable<SimulationSetup> {
    return this.simulationSetupSubject.asObservable();
  }

  getSimulationSetupValue(): SimulationSetup {
    return this.simulationSetupSubject.value;
  }

  updateSimulationSetup(simulation: SimulationSetup) {
    this.simulationSetupSubject.next(simulation);
    localStorage.setItem('simulation-setup', JSON.stringify(this.simulationSetupSubject.value));
  }

  resetSimulationSetup() {
    this.simulationSetupSubject.next(new SimulationSetup());
    localStorage.setItem('simulation-setup', JSON.stringify(this.simulationSetupSubject.value));
  }

  getCurrentSimulationProduct() {
    return this.currentSimulationProducts.asObservable();
  }

  updateCurrentSimulationProducts(products: ProductGroup[]) {
    this.currentSimulationProducts.next(products);
  }
}
