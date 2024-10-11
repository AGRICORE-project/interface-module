import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@ngbracket/ngx-layout';
import { Subscription } from 'rxjs';
import { ProductGroup } from 'src/app/models/simulation-setup/product-group';
import { SimulationSetupService } from 'src/app/services/Interface/simulation-setup.service';

@Component({
  selector: 'app-add-compensation-dialog',
  templateUrl: './add-compensation-dialog.component.html',
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
export class AddCompensationDialog implements OnInit, OnDestroy {
  productForm: UntypedFormGroup = this._formBuilder.group({
    productGroup: [''],
    economicCompensation: [''],
  });

  $subscription: Subscription;
  products: ProductGroup[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<AddCompensationDialog>,
    private _simulationSetupService: SimulationSetupService,
  ) {}

  ngOnInit() {
    this.$subscription = this._simulationSetupService.getCurrentSimulationProduct().subscribe({ next: (value) => (this.products = value) });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  handleSubmit() {
    // console.log(this.productForm);
    this.dialogRef.close(this.productForm);
  }
}
