import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Route } from 'src/app/models/route-names';
import { PasswordMatcher } from 'src/app/shared/utils/password-matcher.validator';
import { FormErrorsService } from '../../services/Interface/form-errors.service';
import countriesJSON from '../../../assets/countries.json'
import { Country } from 'src/app/models/countries';
import { AuthService } from 'src/app/services/Interface/auth.service';
import { UserSignUp } from '../../models/register-user';
import { subsResponse } from 'src/app/models/subscription-response';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { NgIf, NgFor } from '@angular/common';
@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    standalone: true,
    imports: [NgIf, MatCardModule, ReactiveFormsModule, FlexModule, MatFormFieldModule, MatInputModule, MatSelectModule, NgFor, MatOptionModule, MatButtonModule, MatDividerModule, RouterLink]
})

export class SignUpComponent implements OnInit {

  loginRoute: string = '../' + Route.LOGIN

  countries: Country[] = []

  response?: subsResponse;
  
  registerForm: FormGroup = this.fb.group({
    fullName   : ['', [Validators.required, Validators.minLength(6)]],
    email   : ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', [Validators.required, Validators.minLength(8)]],
    country: ['', [Validators.required]],
    institution: ['', [Validators.required]],
  },
  { validators: PasswordMatcher('password', 'password2')} as AbstractControlOptions );

  constructor( private fb: FormBuilder, private _errorService: FormErrorsService, private _authService: AuthService) {}

  ngOnInit(): void {
    this.countries = countriesJSON
  }

  get fullNameError(): string { return this._errorService.fullNameErr(this.registerForm) }
  get emailError(): string { return this._errorService.emailErr(this.registerForm) }
  get passwordError(): string { return this._errorService.passwordErr(this.registerForm) }
  get confirmPassError(): string { return this._errorService.confirmPassworddErr(this.registerForm) }
  get countryError(): string { return this._errorService.fieldRequired(this.registerForm, 'country') }
  get institutionError(): string { return this._errorService.institutionErr(this.registerForm) }

  hasError( field: string ) {
    return this.registerForm.controls[field].errors &&
      this.registerForm.controls[field].touched;
  }

  submitRegister() {
    const user: UserSignUp = this.registerForm.value 

    this._authService.registerUser(user).subscribe({ 
      next: (res) => {
        this.handleMessage(res, 'success')
        this.registerForm.reset();
      },  
      error: (err) => this.handleMessage(err.error.message, 'error')
    })
  }

  private handleMessage(msg: any, state: string){
    this.response = {
      message: msg,
      class: `card-${state}`
    }
  }
}


