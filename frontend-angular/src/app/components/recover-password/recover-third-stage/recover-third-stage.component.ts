import { Component, Input, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Route } from 'src/app/models/route-names';
import { subsResponse } from 'src/app/models/subscription-response';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { AuthService } from 'src/app/services/Interface/auth.service';
import { FormErrorsService } from 'src/app/services/Interface/form-errors.service';
import { PasswordMatcher } from 'src/app/shared/utils/password-matcher.validator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-recover-third-stage',
    templateUrl: './recover-third-stage.component.html',
    styleUrls: ['./recover-third-stage.component.scss'],
    standalone: true,
    imports: [NgIf, MatCardModule, ReactiveFormsModule, FlexModule, MatFormFieldModule, MatInputModule, MatButtonModule]
})
export class RecoverThirdStageComponent implements OnInit {
  
  @Input() email: string;
  @Input() token: string;
  hide: boolean = true;
  response!: subsResponse;

  formThirdStage: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    password2: ['', [Validators.required, Validators.minLength(8)]],

  },{ validators: PasswordMatcher('password', 'password2')} as AbstractControlOptions );

  
  constructor( private fb: FormBuilder, private _errorService: FormErrorsService, private _authService: AuthService, private _router: Router, private _alertService: AlertService) { }

  ngOnInit(): void {
  }

  get passwordError(): string { return this._errorService.passwordErr(this.formThirdStage) }
  get confirmPassError(): string { return this._errorService.confirmPassworddErr(this.formThirdStage) }

  hasError( field: string ) {
    return this.formThirdStage.controls[field].errors &&
          this.formThirdStage.controls[field].touched;
  }
  
  submitForm() {
    if ( this.formThirdStage.invalid ) {
        return;
    }
    const newPassword = this.formThirdStage.value.password;
    this._authService.resetPassword(this.token, newPassword, this.email).subscribe({
      next: (res) => {
        this.formThirdStage.reset();
        this._alertService.alertSuccess('Password updated successfully, you can now login');
        this._router.navigate([`/${Route.AUTHENTICATION}/${Route.LOGIN}`])
      },
      error: (err) => this.handleMessage(err.error.message || err, 'error')
    });
  }

  private handleMessage(msg: any, state: string){
    this.response = {
      message: msg,
      class: `card-${state}`
    }
  }
}
