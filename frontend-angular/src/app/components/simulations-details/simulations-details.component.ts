import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { Log, SimulationRun, SimulationStage } from 'src/app/models/simulation-setup/simulation-scenario';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { SimulationLogsComponent } from 'src/app/dialogs/simulation-logs/simulation-logs.component';

@Component({
  selector: 'app-simulations-details',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FlexLayoutModule, MatButtonModule, MatIconModule, SimulationLogsComponent],
  template: `
    <div class="form-fields">
      <!-- <div class="field-wrapper">
        <p class="field-label">Population ID:</p>
        <mat-form-field appearance="outline" class="readonly">
          <input matInput [value]="simulationRun.id" readonly />
        </mat-form-field>
      </div> -->

      <div class="top-row" fxLayout="row wrap" fxLayoutAlign="space-around center" class="mb20">
        <div class="field-wrapper">
          <p class="field-label">Current year:</p>
          <mat-form-field appearance="outline" class="readonly">
            <input matInput [value]="simulationRun.currentYear" readonly />
          </mat-form-field>
        </div>

        <div class="field-wrapper">
          <p class="field-label">Current stage:</p>
          <mat-form-field appearance="outline" class="readonly">
            <input matInput [value]="STAGE_ENUM[simulationRun.currentStage]" readonly />
          </mat-form-field>
        </div>
        <div class="field-wrapper">
          <p class="field-label">Current stage progress:</p>
          <mat-form-field appearance="outline" class="readonly">
            <input matInput [value]="simulationRun.currentStageProgress + '%'" readonly />
          </mat-form-field>
        </div>
      </div>

      <div class="bottom-row" fxLayout="row wrap" fxLayoutAlign="space-around center">
        <div class="field-wrapper">
          <p class="field-label">Current substage:</p>
          <mat-form-field appearance="outline" class="readonly">
            <input matInput [value]="simulationRun.currentSubstage" readonly />
          </mat-form-field>
        </div>

        <div class="field-wrapper">
          <p class="field-label">Current substage progress:</p>
          <mat-form-field appearance="outline" class="readonly">
            <input matInput [value]="simulationRun.currentSubStageProgress + '%'" readonly />
          </mat-form-field>
        </div>

        <button mat-raised-button color="primary" (click)="openLogsDialog()">Show logs <mat-icon>description</mat-icon></button>
      </div>
    </div>
  `,
  styles: `
    h3 {
      font-size: 18px !important;
    }
    mat-form-field {
      max-width: 200px !important;
    }
    button {
      width: 200px;
      padding: 20px;
    }
  `,
})
export class SimulationsDetailsTopComponent {
  @Input({ required: true }) simulationRun!: SimulationRun;
  STAGE_ENUM = SimulationStage;

  constructor(private dialog: MatDialog) {}

  openLogsDialog() {
    this.dialog.open(SimulationLogsComponent, {
      width: '85vw',
      maxWidth: '85vw',
      data: this.simulationRun.id,
    });
  }
}
