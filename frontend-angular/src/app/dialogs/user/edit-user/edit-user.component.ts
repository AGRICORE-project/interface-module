import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Country } from 'src/app/models/countries';
import { subsResponse } from 'src/app/models/subscription-response';
import { User } from 'src/app/models/user';
import { FormErrorsService } from 'src/app/services/Interface/form-errors.service';
import { UserService } from 'src/app/services/Interface/user.service';
import  CountriesJSON from 'src/assets/countries.json'
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
    selector: 'app-edit-user',
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss'],
    standalone: true,
    imports: [MatDialogTitle, FlexModule, MatIconModule, NgIf, MatCardModule, MatDialogContent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, NgFor, MatDialogActions, MatButtonModule, MatDialogClose]
})
export class EditUserComponent implements OnInit {

  response!: subsResponse;
  countries!: Country[];
  user: User;

  userForm: FormGroup = this.fb.group({
    fullName: [null, [Validators.required, Validators.minLength(6)]],
    email: [null, [Validators.required, Validators.email]],
    role: [null, [Validators.required]],
    verified: [[{value: null, disabled: true}], [Validators.required]],
    country: [null, [Validators.required]],
    institution: [null, [Validators.required]],
  })

  constructor(public dialog: MatDialogRef<EditUserComponent>, private fb: FormBuilder, private _errorService: FormErrorsService, 
    private _userService: UserService, @Inject(MAT_DIALOG_DATA) public data: {email: string}) { }

  ngOnInit(): void {
    this.countries = CountriesJSON
    this.getUser();
  }
  
  get fullNameError() :string { return this._errorService.fullNameErr(this.userForm) }
  get emailError() :string { return this._errorService.emailErr(this.userForm) }
  get countryError() :string { return this._errorService.fieldRequired(this.userForm, 'country') }
  get roleError() :string { return this._errorService.fieldRequired(this.userForm, 'role') }
  get verifiedError() :string { return this._errorService.fieldRequired(this.userForm, 'verified') }
  get institutionError() :string { return this._errorService.institutionErr(this.userForm) }

  getUser(): void {
    this._userService.getUser(this.data.email).subscribe({ 
      next: res => {
        this.user = res
        this.userForm.patchValue(this.user)
        // Set just the actual role and not an array (inherited from ARDIT)
        this.userForm.get('role').patchValue(this.user.roles[0])
      },
      error: err => this.handleMessage(`Could not find the selected user: ${err}`, 'error')
    })
  }

  updateUser() {
    this._userService.updateUser(this.userForm.value).subscribe({
      next: (res) => this.dialog.close(res),
      error: (err) => this.handleMessage(err, 'error'),
    })
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
