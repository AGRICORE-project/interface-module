import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { OverallStatus, SimulationScenario, SimulationStage } from 'src/app/models/simulation-setup/simulation-scenario';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { SimulationsDetailsTopComponent } from '../simulations-details/simulations-details.component';
import { PopuplationsService } from 'src/app/services/Abm/popuplations.service';
import { SimulationsService } from 'src/app/services/Abm/simulations.service';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { MatDialog } from '@angular/material/dialog';
import { SimulationLogsComponent } from 'src/app/dialogs/simulation-logs/simulation-logs.component';

@Component({
  selector: 'app-simulations-table',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule, MatButtonModule, MatProgressSpinnerModule, SimulationsDetailsTopComponent, FlexLayoutModule],
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  templateUrl: './simulations-table.component.html',
  styleUrl: './simulations-table.component.scss',
})
export class SimulationsTableComponent implements OnInit {
  _populationService: PopuplationsService = inject(PopuplationsService);
  _simulationsService: SimulationsService = inject(SimulationsService);
  _alertService: AlertService = inject(AlertService);
  dialog: MatDialog = inject(MatDialog);

  @Input({ required: true }) dataSource: MatTableDataSource<SimulationScenario>;
  @Input({ required: true }) isLoading: boolean;
  @Input() canExport: boolean = false;

  displayedColumns: string[];
  displayedColumnsExpanded: string[];
  STATUS_EMUM = OverallStatus;
  STAGE_ENUM = SimulationStage;

  ngOnInit(): void {
    this.displayedColumns = ['population', 'initial_year', 'horizon', 'models', 'status', 'current_stage', 'current_substage', 'export'];
    // if (this.canExport) this.displayedColumns.push('export');
    this.displayedColumnsExpanded = [...this.displayedColumns];
  }

  exportPopulation(simulationScenario: SimulationScenario): void {
    this._populationService.exportPopulation(simulationScenario.populationId).subscribe((res) => {
      // create a blob object from the response
      const blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      // create a link for our popup
      const link = document.createElement('a');
      link.href = url;
      link.download = `population-${simulationScenario.populationId}.json`;
      // trigger the download
      link.click();
    });
  }

  deleteSimulation(simulationScenario: SimulationScenario): void {
    // show a confirmation dialog
    const confirmed = confirm('Deleting this simulation will also remove the population associated to it. Do you confirm?');
    if (!confirmed) return;
    this._simulationsService.deleteSimulation(simulationScenario.id).subscribe({
      next: () => {
        this._alertService.alertSuccess('Simulation deleted successfully');
        this.dataSource.data = this.dataSource.data.filter((scenario) => scenario.id !== simulationScenario.id);
      },
      error: (err) => this._alertService.alertError('Failed to delete simulation', err.error.message || err),
    });
  }

  openLogsDialog(element: SimulationScenario) {
    this.dialog.open(SimulationLogsComponent, {
      width: '85vw',
      maxWidth: '85vw',
      data: element.simulationRun.id,
    });
  }
}
