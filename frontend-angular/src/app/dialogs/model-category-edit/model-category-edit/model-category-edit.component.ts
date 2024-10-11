import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';
import { PopuplationsService } from 'src/app/services/Abm/popuplations.service';
import { ProductGroup } from 'src/app/models/simulation-setup/product-group';

@Component({
  selector: 'app-model-category-edit',
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
    <h3 mat-dialog-title>Edit model specific category</h3>

    <div mat-dialog-content>
      <div class="p20">
        <form [formGroup]="editForm">
          <mat-form-field class="w100" appearance="outline">
            <mat-label>Model specific category</mat-label>
            <input matInput formControlName="model" placeholder="Edit name" />
            <mat-hint>Format must be Arable,Cereal</mat-hint>
            @if (patternError) {
              <mat-error>Invalid format</mat-error>
            }
          </mat-form-field>
        </form>
      </div>
    </div>

    <div mat-dialog-actions fxLayoutAlign="flex-end center">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-raised-button color="primary" [disabled]="isDisabled" (click)="updateModel()">Update</button>
    </div>
  `,
  styles: ``,
})
export class ModelCategoryEditComponent {
  _alertService: AlertService = inject(AlertService);
  _populationsService: PopuplationsService = inject(PopuplationsService);

  constructor(
    @Inject(MAT_DIALOG_DATA) public productGroup: ProductGroup,
    public dialog: MatDialogRef<ModelCategoryEditComponent>,
    private fb: FormBuilder,
  ) {}

  get isDisabled() {
    return this.editForm.invalid || this.editForm.pristine;
  }

  get patternError() {
    return this.editForm.controls['model'].hasError('pattern');
  }

  editForm: FormGroup = this.fb.group({
    model: [this.productGroup.modelSpecificCategories, [Validators.required, Validators.pattern(/^[a-zA-Z,]+$/)]],
  });

  updateModel() {
    const model: string[] = this.editForm.controls['model'].value.split(',');
    this._populationsService.updateProductGroupCategories(this.productGroup.id, model).subscribe({
      next: () => {
        this._alertService.alertSuccess('Model specific category updated');
        this.productGroup.modelSpecificCategories = model;
        this.dialog.close(this.productGroup);
      },
      error: (err) => {
        this._alertService.alertError('Error updating model specific category', err.error.message || err.message);
      },
    });
  }
}
