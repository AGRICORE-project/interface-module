import { Component, Input, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { MatSelectModule } from '@angular/material/select';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GithubService } from 'src/app/services/Github/github.service';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { Branch } from 'src/app/models/simulation-setup/branch';
import { SimulationSetupService } from 'src/app/services/Interface/simulation-setup.service';
import { SimulationSetup } from 'src/app/models/simulation-setup/simulation-setup';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-simulation-configuration',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    FlexLayoutModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatIconModule,
    MatCheckboxModule,
  ],
  templateUrl: './simulation-configuration.component.html',
  styleUrl: './simulation-configuration.component.scss',
})
export class SimulationConfigurationComponent implements OnInit {
  @Input() configurationInheritedForm: FormGroup;
  private _gitHubService: GithubService = inject(GithubService);
  private _alertService: AlertService = inject(AlertService);
  private _simulationSetupService: SimulationSetupService = inject(SimulationSetupService);
  private simulationSetup: SimulationSetup;

  isDisabled = signal(false);
  shortTermBranches: Branch[];
  longTermBranches: Branch[];

  constructor() {}

  ngOnInit(): void {
    this.getShortTermRepository();
    this.getLongTermRepository();
    this._simulationSetupService.getSimulationSetup().subscribe({
      next: (res) => {
        if (!res) return;
        this.simulationSetup = res;
      },
    });
  }

  getLongTermRepository(): void {
    const LONG_REPOSITORY = 'agricore-financial-optimization-module-long-term';
    this._gitHubService.getAllBranches(LONG_REPOSITORY).subscribe({
      next: (res) => (this.longTermBranches = res),
      error: (err) => this._alertService.alertError(err),
    });
  }

  getShortTermRepository(): void {
    const SHORT_REPOSITORY = 'agricore-model-short-period';
    this._gitHubService.getAllBranches(SHORT_REPOSITORY).subscribe({
      next: (res) => (this.shortTermBranches = res),
      error: (err) => this._alertService.alertError(err),
    });
  }

  onIgnoreLpChange(event: any): void {
    if (event.checked) {
      this.configurationInheritedForm.get('ignoreLMM').setValue(true);
      this.isDisabled.set(true);
    } else {
      this.isDisabled.set(false);
      this.configurationInheritedForm.get('ignoreLMM').setValue(false);
    }
  }

  get yearValue() {
    return this.simulationSetup.syntheticPopulation?.population?.year?.yearNumber.toString() ?? '';
  }
}
