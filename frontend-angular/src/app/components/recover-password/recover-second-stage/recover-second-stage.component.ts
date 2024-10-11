import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
    selector: 'app-recover-second-stage',
    templateUrl: './recover-second-stage.component.html',
    styleUrls: ['./recover-second-stage.component.scss'],
    standalone: true,
    imports: [NgIf, MatCardModule, ReactiveFormsModule, FlexModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule]
})
export class RecoverSecondStageComponent implements OnInit {

  @Output() onUpdateStage: EventEmitter<number> = new EventEmitter<number>()
  @Output() onSetToken: EventEmitter<string> = new EventEmitter<string>()
  @Input() email: string;

  response!: subsResponse;

  formSecondStage: FormGroup = this.fb.group({
    token: ['', [Validators.required]]
  })

  constructor( private fb: FormBuilder, private errorService: FormErrorsService, private _authService: AuthService) { }

  ngOnInit(): void {
  }

  get tokenError(): string { 
    return this.errorService.tokenErr(this.formSecondStage)
  }

  hasError( field: string ) {
    return this.formSecondStage.controls[field].errors &&
          this.formSecondStage.controls[field].touched;
  }
  
  submitForm() {
    if ( this.formSecondStage.invalid ) {
        return;
    }

    const token = this.formSecondStage.value.token;
    this._authService.confirmToken(token, this.email).subscribe({
      next: (res) => {
        this.onUpdateStage.emit(3);
        this.onSetToken.emit(token);
        this.formSecondStage.reset();
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
