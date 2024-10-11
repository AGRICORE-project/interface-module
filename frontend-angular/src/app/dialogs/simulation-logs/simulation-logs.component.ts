import { Component, Inject, OnDestroy, OnInit, ViewChild, WritableSignal, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { Log, LogLevelEnum } from 'src/app/models/simulation-setup/simulation-scenario';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { SimulationsService } from 'src/app/services/Abm/simulations.service';
import { Observable, Subscription, interval, startWith } from 'rxjs';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { MatProgressSpinner, MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-simulation-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSelectModule,
    FlexLayoutModule,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    ScrollingModule,
    DatePipe,
    MatProgressSpinnerModule,
  ],
  template: `
    <div fxLayout="row wrap" fxLayoutAlign="center start" class="p20">
      @if (isLoading) {
        <mat-spinner diameter="50"></mat-spinner>
      } @else {
        <div class="select-container">
          <mat-form-field appearance="outline">
            <mat-label>Select a status</mat-label>
            <mat-select (selectionChange)="updateLogs($event.value)" [value]="LEVEL_ENUM.INFO">
              <mat-option value="ALL" defaul>ALL</mat-option>
              @for (value of levelKey; track $index) {
                <mat-option [value]="LEVEL_ENUM[value]">{{ value }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        <cdk-virtual-scroll-viewport class="log-container" itemSize="0">
          <div class="table-container">
            <table>
              @if (!shownLogs()?.length) {
                <tr>
                  <td><b>*</b> No logs for the selected status</td>
                </tr>
              }
              <tr *cdkVirtualFor="let log of shownLogs()" class="log-item">
                <td>{{ log.timeStamp | date: 'dd/MM/yyyy HH:mm:ss' }}</td>
                <td>[{{ log.source }}]</td>
                <td class="text-center">[{{ getLogLevelKey(LEVEL_ENUM, log.logLevel) }}]</td>
                <td>
                  <strong> > </strong> {{ log.title }}
                  @if (log.description) {
                    [ {{ +' ' + log.description }} ]
                  }
                </td>
              </tr>
            </table>
          </div>
        </cdk-virtual-scroll-viewport>
      }
    </div>
    <small class="mb10">Logs are updated every 10 seconds</small>

    <div mat-dialog-actions fxLayoutAlign="flex-end center">
      <button mat-button mat-dialog-close color="primary">Close</button>
    </div>
  `,
  styles: `
    small {
      text-align: right;
      padding-right: 20px; 
      color: #333;
    }
    table {
      width: 100%;
      padding-left: 10px;
      border-collapse: collapse !important;
    }
    .table-container {
      padding-left: 10px 5px 0px 10px
    }
    td:nth-child(1) {
      // Date column
      width: 160px;
    }
    td:nth-child(2) {
      // Source column
      width: 140px;
    }
    td:nth-child(3) {
      // Level column
      width: 85px;
    }
    tr {
      height: 30px;
      vertical-align: top !important;
      border-bottom: 1px solid #ddd;
    }
    .select-container {
      margin-right: 20px;
    }
    mat-card {
      padding: 10px;
    }
    mat-form-field {
      max-width: 200px;
    }
    mat-card-title {
      font-size: 18px;
      color: #333;
      font-weight: 500;
    }
    button {
      color: white !important;
    }
    .log-container {
      display: flex;
      flex: 1;
      height: 600px;
      color: black;
      border: 1px solid black;
    }
    .log-item {
      min-height: 50px;
      padding-left: 10px;
    }
  `,
})
export class SimulationLogsComponent implements OnInit, OnDestroy {
  
  _simulationsService: SimulationsService = inject(SimulationsService);
  _alertService: AlertService = inject(AlertService);
  @ViewChild(CdkVirtualScrollViewport, { static: false }) cdkVirtualScrollViewport: CdkVirtualScrollViewport;

  LEVEL_ENUM = LogLevelEnum;
  levelKey = Object.keys(LogLevelEnum) as Array<keyof typeof LogLevelEnum>;

  // logs: WritableSignal<Log[]> = signal([]);
  logs: Log[] = [];
  sortedLogs: WritableSignal<Log[]> = signal([]); // logs to be shown in the table
  shownLogs: WritableSignal<Log[]> = signal([]); // logs to be shown in the table
  isLoading: boolean = false;
  currentLevel: string = '20'; // default level is INFO

  logSubscription: Subscription;
  interval: Observable<number> = interval(10000).pipe(startWith(0));

  constructor(@Inject(MAT_DIALOG_DATA) public id: number) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.logSubscription = this.interval.subscribe(() => {
      this._simulationsService
        .getSimulationLogs(this.id)
        .subscribe({
          next: (logs) => {
            // if logs are empty or logs are the same as the previous ones, do nothing
            if (!logs?.length || JSON.stringify(logs) === JSON.stringify(this.logs)) return;
            // set mutated logs
            this.logs = logs;
            // sort logs by timestamp DESC
            this.sortedLogs.set([...this.logs].sort((a, b) => (a.timeStamp > b.timeStamp ? 1 : -1)));
            // scroll to bottom of the table
            this.cdkVirtualScrollViewport?.scrollTo({ bottom: 0 });
            // update logs to be shown
            this.updateLogs();
          },
          error: (err) => this._alertService.alertError(err.error?.message || err),
        })
        .add(() => (this.isLoading = false));
    });
  }

  ngOnDestroy(): void {
    this.logSubscription.unsubscribe();
  }

  getLogLevelKey<TEnumKey extends string, TEnumVal extends number>(LEVEL_ENUM: { [key in TEnumKey]: TEnumVal }, level: TEnumVal): string {
    const keys = (Object.keys(LEVEL_ENUM) as TEnumKey[]).filter((x) => LEVEL_ENUM[x] === level);
    return keys.length > 0 ? keys[0] : '';
  }

  /*
   * update the logs to be shown based on the current level selected
   * if no level is selected, the default level is INFO
   */
  updateLogs(level: string = null) {
    if (level) this.currentLevel = level;
    if (this.currentLevel === 'ALL') this.shownLogs.set(this.sortedLogs());
    else this.shownLogs.set(this.sortedLogs().filter((log) => log.logLevel >= Number(this.currentLevel)));
  }
}
