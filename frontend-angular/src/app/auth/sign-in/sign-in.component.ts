import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { Route } from 'src/app/models/route-names';
import { FormErrorsService } from 'src/app/services/Interface/form-errors.service';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { AuthService } from '../../services/Interface/auth.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  standalone: true,
  imports: [
    NgIf,
    MatCardModule,
    ReactiveFormsModule,
    FlexModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    RouterLinkActive,
    RouterLink,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDividerModule,
  ],
})
export class SignInComponent implements OnInit {
  hide: boolean = true;
  loading: boolean = false;
  error: any;

  recoverRoute: string = '../' + Route.RECOVER_PASSWORD;
  signUpRoute: string = '../' + Route.SIGNUP;

  loginForm: FormGroup = this._fb.group({
    email: ['admin1@gmail.com', [Validators.required]],
    password: ['admin1', [Validators.required]],
  });

  constructor(
    private _fb: FormBuilder,
    private _errorService: FormErrorsService,
    private _router: Router,
    private _authService: AuthService,
  ) {}

  ngOnInit(): void {}

  get emailError(): string {
    return this._errorService.emailErr(this.loginForm);
  }
  get passwordError(): string {
    return this._errorService.passwordErr(this.loginForm);
  }

  hasError(field: string) {
    return this.loginForm.controls[field].errors && this.loginForm.controls[field].touched;
  }

  submitLogin() {
    const user = this.loginForm.value;

    if (this.loginForm.invalid) return;

    this.loading = true;
    this._authService
      .signIn(user.email, user.password)
      .subscribe({
        next: () =>
          this._authService.storeCurrentUser().subscribe({
            next: () => {
              this._router.navigateByUrl(Route.DASHBOARD), this.loginForm.reset();
            },
            error: (err) => {
              this.error = err.error?.message || err;
            },
          }),
        error: (err) => (this.error = err.error?.message ?? err.message),
      })
      .add(() => (this.loading = false));
  }
}
