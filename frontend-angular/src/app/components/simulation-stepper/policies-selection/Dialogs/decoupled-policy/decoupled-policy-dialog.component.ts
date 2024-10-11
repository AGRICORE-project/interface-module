import { Component, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';

@Component({
  selector: 'app-decoupled-policy-dialog',
  templateUrl: './decoupled-policy-dialog.component.html',
  styleUrls: ['./decoupled-policy-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    FlexLayoutModule,
    MatOptionModule,
    MatSelectModule,
    MatButtonModule,
  ],
})
export class DecoupledPolicyDialog {
  policyForm: UntypedFormGroup = this._formBuilder.group({
    policyIdentifier: [''],
    policyDescription: [''],
    modelLabel: [''],
    economicCompensation: [''],
    startYearNumber: [''],
    endYearNumber: [''],
    isCoupled: [false],
    populationId: [this.data.populationId],
    coupledCompensations: this._formBuilder.array([]),
  });

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<DecoupledPolicyDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { populationId: number },
  ) {}

  handleSubmit() {
    this.dialogRef.close(this.policyForm);
  }
}
