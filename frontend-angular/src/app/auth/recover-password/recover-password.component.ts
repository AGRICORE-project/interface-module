import { Component, OnInit } from '@angular/core';
import { Route } from 'src/app/models/route-names';
import { RouterLink } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { RecoverThirdStageComponent } from '../../components/recover-password/recover-third-stage/recover-third-stage.component';
import { RecoverSecondStageComponent } from '../../components/recover-password/recover-second-stage/recover-second-stage.component';
import { RecoverFirstStageComponent } from '../../components/recover-password/recover-first-stage/recover-first-stage.component';
import { NgSwitch, NgSwitchDefault, NgSwitchCase } from '@angular/common';


@Component({
    selector: 'app-recover-password',
    templateUrl: './recover-password.component.html',
    standalone: true,
    imports: [NgSwitch, NgSwitchDefault, RecoverFirstStageComponent, NgSwitchCase, RecoverSecondStageComponent, RecoverThirdStageComponent, MatDividerModule, RouterLink]
})
export class RecoverPasswordComponent implements OnInit {

  stage: number = 1;
  token: string = '';
  recoverEmail: string = '';
  singInRoute: string = '../' + Route.LOGIN

  constructor() { }

  ngOnInit(): void {
  }

  setUserEmail(email: string): void {
    this.recoverEmail = email;
  }

  setRecoverToken(token: string): void {
    this.token = token;
  }

  updateStageView(stage: number): void {
    this.stage = stage;
  }
}
