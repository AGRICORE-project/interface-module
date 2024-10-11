import { Component, OnInit, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { interval, Observable, PartialObserver, startWith, Subscription } from 'rxjs';
import { ApiIdentifiers, ConnectionList, ConnectionState } from 'src/app/models/connection-state';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/Interface/auth.service';
import { ConnectionsService } from 'src/app/services/Interface/connections.service';
import { FormErrorsService } from 'src/app/services/Interface/form-errors.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { NgIf, DatePipe } from '@angular/common';

@Component({
  selector: 'app-check-connections',
  templateUrl: './check-connections.component.html',
  styleUrls: ['./check-connections.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogTitle,
    MatDialogContent,
    MatCardModule,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogActions,
    MatDialogClose,
    DatePipe,
  ],
})
export class CheckConnectionsComponent implements OnInit, OnDestroy {
  @ViewChild('connectionDialog') connectionDialog = {} as TemplateRef<any>;

  headerIconClass: string;
  headerIcon: string;
  timerValue: number = 15000;
  loading: boolean = false;
  response: any;
  currentUser: User;
  connectionsList: ConnectionList = {
    interfaceApi: {} as ConnectionState,
    abmApi: {} as ConnectionState,
  };
  connectionsFetched = this.connectionsList.interfaceApi || this.connectionsList.abmApi;

  ipForm: FormGroup = this._fb.group({
    abmIp: [''],
  });

  hasError(field: string) {
    return this.ipForm.controls[field].errors && this.ipForm.controls[field].touched;
  }

  get getIpError(): string {
    return this._errorService.ipErr(this.ipForm);
  }

  // Obserbvable interface API
  intervalInterface: Observable<number> = interval(this.timerValue).pipe(startWith(0));
  interfaceObserver: PartialObserver<any> = {
    next: () => {
      this._connectionService.interfaceHeartBeat().subscribe({
        next: () => this.handleConnectionChange('interfaceApi', 'Connected to Interface API', true),
        error: (err) => this.handleConnectionChange('interfaceApi', 'Not connected to Interface API', false, err.error?.message || err),
      });
    },
  };
  interfaceSubscription: Subscription;

  // Obserbvable ABM API
  intervalAbm: Observable<number> = interval(this.timerValue).pipe(startWith(0));
  ambObserver: PartialObserver<any> = {
    next: () => {
      this._connectionService.abmHeartBeat().subscribe({
        next: () => this.handleConnectionChange('abmApi', 'Connected to ABM API', true),
        error: (err) => this.handleConnectionChange('abmApi', 'Not connected to ABM API', false, err.error?.message || err),
      });
    },
  };
  abmSubscription: Subscription;

  constructor(
    private _errorService: FormErrorsService,
    private _fb: FormBuilder,
    private _connectionService: ConnectionsService,
    private dialog: MatDialog,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this._authService.getCurrentUser();
    this.ipForm.get('abmIp').setValue(this.currentUser.apiUrl);

    //initial values
    this.handleConnectionChange('interfaceApi', 'Connecting to Interface API', false);
    this.handleConnectionChange('abmApi', 'Connecting to ABM API', false);
  }

  ngAfterViewInit(): void {
    this.interfaceSubscription = this.intervalInterface.subscribe(this.interfaceObserver);
    this.abmSubscription = this.intervalAbm.subscribe(this.ambObserver);
  }

  openConnectionDialog(): void {
    this.dialog.open(this.connectionDialog, {
      width: '500px',
    });
  }

  handleIpSubmit(): void {
    const ip = this.ipForm.value.abmIp;
    this._authService
      .setUserAbmURL(ip)
      .subscribe({
        next: () =>
          this._authService.storeCurrentUser().subscribe({
            next: () => this.handleMessage('Ip succesfully updated', 'success'),
            error: (err) => this.handleMessage(err.error?.message || err, 'error'),
          }),
        error: (err) => this.handleMessage(err.error?.message || err, 'error'),
      })
      .add(() => (this.loading = false));
  }

  handleConnectionChange(apiName: ApiIdentifiers, message: string, connected: boolean, errorMessage?: string): void {
    this.connectionsList[apiName] = {
      message: message,
      connected: connected,
      errorMessage: errorMessage ?? null,
      class: connected ? 'connect-success' : 'connect-error',
    };

    // set app header icon and class if all connections are connected or we show the disconnected icon and class
    const allConnected = Object.values(this.connectionsList).every((api) => api.connected);
    this.headerIcon = allConnected ? 'wifi' : 'wifi_off';
    this.headerIconClass = allConnected ? 'connect-success' : 'connect-error';
  }

  private handleMessage(msg: any, state: string) {
    this.response = {
      message: msg,
      class: `card-${state}`,
    };
  }

  ngOnDestroy(): void {
    this.interfaceSubscription.unsubscribe();
    this.abmSubscription.unsubscribe();
  }
}
