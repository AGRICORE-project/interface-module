import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, ReactiveFormsModule, UntypedFormArray, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { AddCompensationDialog } from './add-compensation-dialog/add-compensation-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-coupled-policy-dialog',
  templateUrl: './coupled-policy-dialog.component.html',
  styleUrls: ['./coupled-policy-dialog.component.scss'],
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
    MatIconModule,
    CommonModule,
  ],
})
export class CoupledPolicyDialog {
  policyForm: UntypedFormGroup = this._formBuilder.group({
    policyIdentifier: [''],
    policyDescription: [''],
    modelLabel: [''],
    economicCompensation: [''],
    startYearNumber: [''],
    endYearNumber: [''],
    isCoupled: [true],
    populationId: [this.data.populationId],
    coupledCompensations: this._formBuilder.array([]),
  });

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<CoupledPolicyDialog>,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: { populationId: number },
  ) {}

  handleSubmit() {
    this.dialogRef.close(this.policyForm);
  }

  addEconomicCompensation() {
    const newDialog = this.dialog.open(AddCompensationDialog);
    newDialog.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          const coupledCompensations = this.policyForm.get('coupledCompensations') as UntypedFormArray;
          coupledCompensations.push(value);
        }
      },
    });
  }

  get coupledCompensations(): FormArray {
    return this.policyForm.get('coupledCompensations') as FormArray;
  }
}
