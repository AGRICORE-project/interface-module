import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/Interface/auth.service';
import { WindowControlsService } from 'src/app/services/Interface/window-controls.service';
import { MatDialog } from '@angular/material/dialog';
import { ProfileEditComponent } from 'src/app/dialogs/profile-edit/profile-edit.component';
import { LowerCasePipe, TitleCasePipe } from '@angular/common';
import { CheckConnectionsComponent } from '../../components/check-connections/check-connections.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: true,
    imports: [FlexModule, MatIconModule, MatButtonModule, CheckConnectionsComponent, LowerCasePipe, TitleCasePipe]
})
export class HeaderComponent implements OnInit {

  currentUser?: User;

  constructor(private _windowControlsService: WindowControlsService, private _authService: AuthService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this._authService.currentUser.subscribe( res => this.currentUser = res )
  }

  closeApp(): void {
    this._windowControlsService.closeApp();
  }

  minimizeApp(): void {
    this._windowControlsService.minimizeApp();
  }

  maximizeApp(): void {
    this._windowControlsService.maximizeApp();
  }

  goBack(): void {
    this._windowControlsService.goBack();
  }

  goForward(): void {
    this._windowControlsService.goForward();
  }

  openEditProfileDialog() {
    this.dialog.open(ProfileEditComponent);
  }

  logout(): void {
    this._authService.logout().subscribe();
  }


}

