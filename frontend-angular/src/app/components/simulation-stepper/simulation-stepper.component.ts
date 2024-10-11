import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { SimulationSetupService } from '../../services/Interface/simulation-setup.service';
import { SimulationSetup } from '../../models/simulation-setup/simulation-setup';
import { map, Observable, Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { LaunchSimulationComponent } from './launch-simulation/launch-simulation.component';
import { PoliciesSelectionComponent } from './policies-selection/policies-selection.component';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';
import { SyntheticPopulationComponent } from './synthetic-population/synthetic-population.component';
import { MatIconModule } from '@angular/material/icon';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { SimulationConfigurationComponent } from './simulation-configuration/simulation-configuration.component';
import { ProductGroupingComponent } from './product-grouping/product-grouping.component';

@Component({
  selector: 'app-simulation-stepper',
  templateUrl: './simulation-stepper.component.html',
  styleUrls: ['./simulation-stepper.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {
        showError: true,
        displayDefaultIndicatorType: true,
      },
    },
  ],
  standalone: true,
  imports: [
    MatStepperModule,
    MatIconModule,
    SyntheticPopulationComponent,
    FlexModule,
    MatButtonModule,
    ReactiveFormsModule,
    PoliciesSelectionComponent,
    SimulationConfigurationComponent,
    ProductGroupingComponent,
    LaunchSimulationComponent,
    AsyncPipe,
  ],
})
export class SimulationStepperComponent implements OnInit, OnDestroy {
  @ViewChild('stepper') stepper: MatStepper;
  simulationSetup: SimulationSetup;
  stepperOrientation: Observable<any>;
  $simulation: Observable<SimulationSetup>;
  subscription: Subscription;

  arrLastSelectedIndex: number[] = [0];

  populationForm: UntypedFormGroup = this._formBuilder.group({
    population: [null, [Validators.required]],
  });
  policiesForm: UntypedFormGroup = this._formBuilder.group({
    additionalPolicies: this._formBuilder.array([]),
  });
  configurationForm: UntypedFormGroup = this._formBuilder.group({
    simulationHorizon: ['', [Validators.required]],
    shortTermBranch: ['main', [Validators.required]],
    longTermBranch: ['main', [Validators.required]],
    queueSuffix: [''],
    ignoreLP: [false],
    ignoreLMM: [false],
    compress: [false],
  });

  constructor(
    private _formBuilder: FormBuilder,
    public _simulationSetupService: SimulationSetupService,
    breakpointObserver: BreakpointObserver,
  ) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 1399px)').pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.$simulation = this._simulationSetupService.getSimulationSetup();
    // On simulation changes update simulation setup
    this.subscription = this.$simulation.subscribe({
      next: (simulation) => (this.simulationSetup = simulation),
    });
  }

  updateSimulationData(event: any) {
    // Get last index of the stepper changed
    const lastStepIndex = event.previouslySelectedIndex;

    // Save the index of the current step
    const index = event.selectedIndex;
    this.arrLastSelectedIndex.push(index);

    // Set form values to simulation subject when next is triggered or on a step change
    switch (lastStepIndex) {
      case 0:
        this.simulationSetup.syntheticPopulation = this.populationForm.value;
        break;
      /* case 1:
        does not need to be updated 
        break; */
      case 2:
        this.simulationSetup.policiesList = this.policiesForm.value;
        break;
      case 3:
        this.simulationSetup.configuration = this.configurationForm.value;
        break;
      default:
        break;
    }
    this._simulationSetupService.updateSimulationSetup(this.simulationSetup);
  }

  resetSimulation() {
    this._simulationSetupService.resetSimulationSetup();
    this.populationForm.reset();
    this.policiesForm.reset();
    this.configurationForm.reset();
    this.stepper.reset();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.resetSimulation();
  }
}
