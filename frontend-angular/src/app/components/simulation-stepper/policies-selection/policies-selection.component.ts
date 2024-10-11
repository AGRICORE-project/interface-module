import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormArray } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgIf, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout';
import { PopuplationsService } from 'src/app/services/Abm/popuplations.service';
import { PopulationPolicy } from 'src/app/models/simulation-setup/population-policy';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DecoupledPolicyDialog } from './Dialogs/decoupled-policy/decoupled-policy-dialog.component';
import { CoupledPolicyDialog } from './Dialogs/coupled-policy/coupled-policy-dialog.component';

type PopulationTableType = PopulationPolicy & { economicCompensationRepresentation: string };
@Component({
  selector: 'app-policies-selection',
  templateUrl: './policies-selection.component.html',
  styleUrls: ['./policies-selection.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatCardModule,
    NgIf,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatPaginatorModule,
    DatePipe,
    MatButtonModule,
    MatDialogModule,
  ],
})
export class PoliciesSelectionComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() populationForm: FormGroup;
  @Input() policiesForm: FormGroup;

  $formSubscription: Subscription;
  $formAdditionPoliciesSubscription: Subscription;

  displayedColumns: string[] = [
    'policyIdentifier',
    'policyDescription',
    'modelLabel',
    'economicCompensationRepresentation',
    'startYearNumber',
    'endYearNumber',
  ];

  populationPolicies: BehaviorSubject<PopulationPolicy[]> = new BehaviorSubject<PopulationPolicy[]>(null);
  populationPoliciesTable: MatTableDataSource<PopulationTableType> = new MatTableDataSource();

  additionalPolicies: BehaviorSubject<PopulationPolicy[]> = new BehaviorSubject<PopulationPolicy[]>(null);
  additionalPoliciesTable: MatTableDataSource<PopulationTableType> = new MatTableDataSource();

  @ViewChild('populationPaginator') populationPaginator!: MatPaginator;
  @ViewChild('populationSort') populationSort!: MatSort;

  @ViewChild('additionalPaginator') additionalPaginator!: MatPaginator;
  @ViewChild('additionalSort') additionalSort!: MatSort;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef;

  constructor(
    // private _policiesService: PoliciesService,
    private _alertService: AlertService,
    private _populationService: PopuplationsService,
    private dialog: MatDialog,
    private _formBuilder: FormBuilder,
  ) {}

  ngAfterViewInit() {
    this.populationPoliciesTable.paginator = this.populationPaginator;
    this.populationPoliciesTable.sort = this.populationSort;

    this.additionalPoliciesTable.paginator = this.additionalPaginator;
    this.additionalPoliciesTable.sort = this.additionalSort;
  }

  ngOnInit(): void {
    // Subscribe to subject onchanges and update table content
    this.populationPolicies.subscribe((res) => (this.populationPoliciesTable.data = res?.map((x) => this.transformPolicyForTable(x))));
    this.additionalPolicies.subscribe((res) => {
      this.additionalPoliciesTable.data = res?.map((x) => this.transformPolicyForTable(x));
    });

    this.loadProductPolicies();

    // Subscribe to form changes
    this.$formSubscription = this.populationForm.valueChanges.subscribe(() => {
      this.loadProductPolicies();
    });

    this.$formAdditionPoliciesSubscription = this.policiesForm.valueChanges.subscribe(() => {
      this.additionalPolicies.next(this.policiesForm.get('additionalPolicies').value);
    });
  }

  transformPolicyForTable(policy: PopulationPolicy): PopulationTableType {
    return {
      ...policy,
      economicCompensationRepresentation: policy.isCoupled
        ? policy.coupledCompensations
            .map((y) => `${y.productGroup}:${y.economicCompensation}`)
            .join(policy.coupledCompensations?.length > 1 ? ';' : '')
        : policy.economicCompensation.toString(),
    };
  }

  loadProductPolicies() {
    this._populationService.getPopulationPolicies(this.populationForm.controls['population'].value['populationId']).subscribe({
      next: (res) =>
        this.populationPolicies.next(
          res.map((x) => ({ ...x, modelLabel: x.modelLabel === 'Basic' || x.modelLabel === 'Greening' ? x.modelLabel : '' })),
        ),
      error: (err) => this._alertService.alertError(err.error.message),
    });
  }

  ngOnDestroy(): void {
    this.populationPolicies.unsubscribe();
    this.additionalPolicies.unsubscribe();
    this.$formSubscription.unsubscribe();
    this.$formAdditionPoliciesSubscription.unsubscribe();
  }

  openDecoupledPolicyForm() {
    const dialogRef = this.dialog.open(DecoupledPolicyDialog, {
      data: { populationId: this.populationForm.controls['population'].value['populationId'] },
    });
    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          const additionalPolicies = this.policiesForm.get('additionalPolicies') as UntypedFormArray;
          additionalPolicies.push(value);
        }
      },
    });
  }

  openCoupledPolicyForm() {
    const dialogRef = this.dialog.open(CoupledPolicyDialog, {
      data: { populationId: this.populationForm.controls['population'].value['populationId'] },
    });
    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          const additionalPolicies = this.policiesForm.get('additionalPolicies') as UntypedFormArray;
          additionalPolicies.push(value);
        }
      },
    });
  }

  exportAdditionalPolicies() {
    const data = this.policiesForm.get('additionalPolicies').value;

    const jsonStr = JSON.stringify(data);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'additionalPolicies.json';
    anchor.click();

    window.URL.revokeObjectURL(url); // Clean up the URL object
  }

  triggerFileInputClick(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const fileContent = e.target?.result as string;
        try {
          const json = JSON.parse(fileContent);
          // Process the JSON data
          console.log(json);
          const additionalPolicies = this.policiesForm.get('additionalPolicies') as UntypedFormArray;
          additionalPolicies.clear();
          for (const entry of json) {
            const additionalPolicy = this._formBuilder.group({
              policyIdentifier: [entry.policyIdentifier],
              policyDescription: [entry.policyDescription],
              modelLabel: [entry.modelLabel === 'Basic' || entry.modelLabel === 'Greening' ? entry.modelLabel : ''],
              economicCompensation: [entry.economicCompensation],
              startYearNumber: [entry.startYearNumber],
              endYearNumber: [entry.endYearNumber],
              coupledCompensations: [entry.coupledCompensations],
              isCoupled: [entry.isCoupled],
              populationId: [entry.populationId],
            });
            additionalPolicies.push(additionalPolicy);
          }
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      };
      reader.readAsText(file);
    }
  }
}
