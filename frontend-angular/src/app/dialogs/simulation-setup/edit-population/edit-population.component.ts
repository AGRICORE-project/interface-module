import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FlexModule } from '@ngbracket/ngx-layout';
import { Synthetic } from 'src/app/models/simulation-setup/synthetic';
import { PopuplationsService } from 'src/app/services/Abm/popuplations.service';
import { AlertService } from 'src/app/services/Interface/alert-service.service';

@Component({
  selector: 'app-edit-population',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogContent,
    FlexModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
    <h3 mat-dialog-title>Edit population {{ synthetic.name }}</h3>

    <div mat-dialog-content>
      <div fxLayoutAlign="center center" class="p20">
        <form [formGroup]="editForm">
          <div>
            <mat-form-field class="w100" appearance="outline">
              <mat-label>Name</mat-label>
              <input matInput formControlName="name" placeholder="Edit name" />
            </mat-form-field>
          </div>
          <div class="years-selected">
            <mat-form-field class="w100" appearance="outline">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" placeholder="Edit description"></textarea>
            </mat-form-field>
          </div>
        </form>
      </div>
    </div>

    <div mat-dialog-actions fxLayoutAlign="flex-end center">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="isDisabled" (click)="updateSynthetic()">Update</button>
    </div>
  `,
  styles: ``,
})
export class EditPopulationComponent {
  _populationService: PopuplationsService = inject(PopuplationsService);
  _alertService: AlertService = inject(AlertService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public synthetic: Synthetic,
    public dialog: MatDialogRef<EditPopulationComponent>,
    private fb: FormBuilder,
  ) {}

  editForm: FormGroup = this.fb.group({
    name: [this.synthetic.name, [Validators.required]],
    description: [this.synthetic.description, [Validators.required]],
  });

  get isDisabled() {
    return this.editForm.invalid || this.editForm.pristine;
  }

  updateSynthetic() {
    this._populationService.updateSynthetic(this.synthetic.id, this.editForm.value).subscribe({
      next: (res) => {
        this._alertService.alertSuccess('Synthetic population updated successfully');
        this.dialog.close(res);
      },
      error: (err) => this._alertService.alertError(err.error.message ?? err),
    });
  }
}
