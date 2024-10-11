import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Country } from 'src/app/models/countries';
import { Policy } from 'src/app/models/simulation-setup/policy';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { PoliciesService } from 'src/app/services/Interface/policies.service';
import CountriesJSON from 'src/assets/countries.json';
import { FormErrorsService } from '../../services/Interface/form-errors.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout';
import { NgIf, NgFor } from '@angular/common';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
  selector: 'app-personal-policy',
  templateUrl: './personal-policy.component.html',
  styleUrls: ['./personal-policy.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    NgFor,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatNativeDateModule,
    MatDatepickerModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class PersonalPolicyComponent implements OnInit {
  countries: Country[] = CountriesJSON;

  newPolicy!: Policy;

  policyForm: FormGroup = this.fb.group({
    createdAt: [''],
    title: ['', [Validators.required]],
    type: [null, [Validators.required]],
    derogationDate: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    disabled: ['active', [Validators.required]],
    country: ['', [Validators.required]],
    xmlFile: ['', [Validators.required, Validators.minLength(50)]],
  });

  constructor(
    private _alertService: AlertService,
    private fb: FormBuilder,
    private _policiesService: PoliciesService,
    private _errorService: FormErrorsService,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    public dialog: MatDialogRef<PersonalPolicyComponent>,
  ) {}

  ngOnInit(): void {
    if (this.data.id) this.populateForm();
  }

  get titleError(): string {
    return this._errorService.fieldRequired(this.policyForm, 'title');
  }
  get typeError(): string {
    return this._errorService.fieldRequired(this.policyForm, 'type');
  }
  get deroagtionError(): string {
    return this._errorService.fieldRequired(this.policyForm, 'derogationDate');
  }
  get startDateError(): string {
    return this._errorService.fieldRequired(this.policyForm, 'startDate');
  }
  get countryError(): string {
    return this._errorService.fieldRequired(this.policyForm, 'country');
  }
  get xmlError(): string {
    return this._errorService.xmlFileErr(this.policyForm);
  }

  hasError(field: string) {
    return this.policyForm.controls[field].errors && this.policyForm.controls[field].touched;
  }

  createNewPolicy(): void {
    this.newPolicy = this.policyForm.value;
    this.newPolicy.general = false;
    this._policiesService.createPolicy(this.newPolicy).subscribe({
      next: (res) => {
        this.dialog.close(res);
        this._alertService.alertSuccess('New policy created');
      },
      error: (err) => this._alertService.alertError(err.error.message),
    });
  }

  populateForm(): void {
    let currentPolicy: Policy;
    this._policiesService.getPolicyById(this.data.id).subscribe({
      next: (res) => (currentPolicy = res),
      complete: () => this.policyForm.patchValue(currentPolicy),
    });
  }

  updatePolicy(): void {
    // Create new Policy and set updated values
    let updatedPolicy: Policy = this.policyForm.value;
    updatedPolicy.id = this.data.id;

    this._policiesService.updatePolicy(updatedPolicy.id, updatedPolicy).subscribe({
      next: (res) => {
        this.dialog.close(res);
        this._alertService.alertSuccess('Policy succesfully updated');
      },
      error: (err) => this._alertService.alertError(err.error.message),
    });
  }
}
