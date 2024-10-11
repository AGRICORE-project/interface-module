import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/Interface/auth.service';
import { subsResponse } from '../../models/subscription-response';
import { Country } from 'src/app/models/countries';
import  CountriesJSON from 'src/assets/countries.json'
import { FormErrorsService } from '../../services/Interface/form-errors.service';
import { UserService } from '../../services/Interface/user.service';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { AlertService } from '../../services/Interface/alert-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
    selector: 'app-profile-edit',
    templateUrl: './profile-edit.component.html',
    styleUrls: ['./profile-edit.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, FlexModule, MatIconModule, NgIf, MatCardModule, MatDialogContent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, NgFor, MatOptionModule, MatDialogActions, MatButtonModule, MatDialogClose, MatProgressSpinnerModule]
})
export class ProfileEditComponent implements OnInit {

  currentUser!: User;
  response!: subsResponse;
  countries!: Country[];
  loading: boolean = false;
  userForm: FormGroup = this.fb.group({
    fullName: [null, [Validators.required, Validators.minLength(6)]],
    email: [null, [Validators.required, Validators.email]],
    country: [null, [Validators.required]],
    institution: [null, [Validators.required]],
  })

  constructor(public dialog: MatDialogRef<ProfileEditComponent>, private fb: FormBuilder, private _authService: AuthService, 
    private _errorService: FormErrorsService, private _userService: UserService, private _alertService: AlertService) { }

  ngOnInit(): void {
    this.countries = CountriesJSON
    this.currentUser = this._authService.getCurrentUser();
    this.userForm.patchValue( this.currentUser )
  }

  get fullNameError() :string { return this._errorService.fullNameErr(this.userForm) }
  get emailError() :string { return this._errorService.emailErr(this.userForm) }
  get countryError() :string { return this._errorService.fieldRequired(this.userForm, 'country') }
  get institutionError() :string { return this._errorService.institutionErr(this.userForm) }

  updateCurrentUser() {
    this.loading = true;
    this._userService.updateUser(this.userForm.value).subscribe({
      next: () => this._authService.storeCurrentUser().subscribe({
          next: () =>  this.handleUpdateUser(),
          error: (err) => this.handleMessage(err, 'error'),
        }),
      error: (err) => this.handleMessage(err, 'error'),
      complete: () => this.loading = false
    })
  }

  handleUpdateUser() {
    if (this.currentUser.email !== this.userForm.value.email) {
      this._authService.logout();
      this._alertService.alertSuccess('User updated, log in again with new credentials');
    } else {
      this._alertService.alertSuccess('User updated');
    }
    this.dialog.close();
  } 

  hasError( field: string ){
    return this.userForm.controls[field].errors &&
      this.userForm.controls[field].touched;
  }

  private handleMessage(msg: any, state: string){
    this.response = {
      message: msg,
      class: `card-${state}`
    }
  }
}
