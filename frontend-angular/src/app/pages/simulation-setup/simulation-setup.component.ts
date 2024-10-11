import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { SimulationSetupService } from '../../services/Interface/simulation-setup.service';
import { saveAs } from 'file-saver';
import { SimulationSetup } from 'src/app/models/simulation-setup/simulation-setup';
import { SimulationStepperComponent } from '../../components/simulation-stepper/simulation-stepper.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-simulation-setup',
  templateUrl: './simulation-setup.component.html',
  styleUrls: ['./simulation-setup.component.scss'],
  standalone: true,
  imports: [FlexModule, MatButtonModule, MatIconModule, SimulationStepperComponent],
})
export class SimulationSetupComponent /*implements OnInit, OnDestroy*/ {
  // simulationSetup: SimulationSetup;
  // reader: FileReader = new FileReader();
  // constructor(private _simulationSetupService: SimulationSetupService, private _alertService: AlertService) { }
  // ngOnInit(): void {
  //   this.simulationSetup = this._simulationSetupService.getSimulationSetupValue();
  // }
  // // downloadSetup(): void {
  //   this.simulationSetup = this._simulationSetupService.getSimulationSetupValue();
  //   // check if simulation is empty
  //   if (!Object.keys(this.simulationSetup).length) {
  //     this._alertService.alertError('Simulation is empty')
  //     return;
  //   }
  //   let blob = new Blob([JSON.stringify(this.simulationSetup)], {type:  'application/json'});
  //   saveAs(blob, "simulation.json");
  // }
  // loadSetupFile(event: any) {
  //   const [file] = event.target.files;
  //   // Get file data and update simulation
  //   this.reader.onloadend = (e) => {
  //     const simulation = this.reader.result as string
  //     this.simulationSetup = JSON.parse(simulation)
  //     this._simulationSetupService.updateSimulationSetup(this.simulationSetup)
  //     this._alertService.alertSuccess('Uploaded simulation data')
  //   }
  //   this.reader.readAsText(file)
  // }
  // ngOnDestroy(): void {
  //   this.reader = null
  // }
}
