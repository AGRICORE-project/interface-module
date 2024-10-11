import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Route } from 'src/app/models/route-names';
import { subsResponse } from 'src/app/models/subscription-response';
import { AuthService } from 'src/app/services/Interface/auth.service';
import { FormErrorsService } from 'src/app/services/Interface/form-errors.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-recover-first-stage',
    templateUrl: './recover-first-stage.component.html',
    styleUrls: ['./recover-first-stage.component.scss'],
    standalone: true,
    imports: [NgIf, MatCardModule, ReactiveFormsModule, FlexModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class RecoverFirstStageComponent implements OnInit {

  @Output() onUpdateStage: EventEmitter<number> = new EventEmitter<number>();
  @Output() onSetEmail: EventEmitter<string> = new EventEmitter<string>();
  response!: subsResponse;
  recoverForm: FormGroup = this.fb.group({
    email   : ['', [Validators.required, Validators.email]]
  })

  constructor( private fb: FormBuilder, private errorService: FormErrorsService, private _authService: AuthService) { }

  ngOnInit(): void {
  }

  get emailError(): string {
    return this.errorService.emailErr(this.recoverForm)
  }

  hasError( field: string ) {
    return this.recoverForm.controls[field].errors &&
          this.recoverForm.controls[field].touched;
  }
  
  submitRecover() {
    if ( this.recoverForm.invalid ) {
        return;
    }

    this._authService.recoverPassword(this.recoverForm.value.email).subscribe({
      next: (res) => {
        this.onUpdateStage.emit(2);
        this.onSetEmail.emit(this.recoverForm.value.email);
        this.recoverForm.reset();
      },
      error: (err) => this.handleMessage(err.error.message, 'error')
    });
  }

  private handleMessage(msg: any, state: string){
    this.response = {
      message: msg,
      class: `card-${state}`
    }
  }
  
}