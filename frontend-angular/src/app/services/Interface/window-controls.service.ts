import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class WindowControlsService {

  // COMMENTS FOR NOW JUST TO PREVENT LAYOUT ISSUES ON WEB APP DEPLOY
 
  // private electronAPI;
  
  constructor(private _authService: AuthService) { 
      // try {this.electronAPI = (<any>window).electronAPI } 
      // catch (e) {throw e; }
  }

  resizeWindow(width: number, height: number, resize: boolean = true): void {
    // this.electronAPI.send('window:resize', [width, height, resize] );
  }

  setMinSize(width: number, height: number): void {
    // this.electronAPI.send('window:minSize', [width, height]);
  }

  closeApp(): void {
    // this._authService.logout().subscribe();
    // this.electronAPI.send('window:close');
  }

  minimizeApp(): void {
    // this.electronAPI.send('window:minimize');
  }

  maximizeApp(): void {
    // this.electronAPI.send('window:maximize');
  }

  goBack(): void {
    // this.electronAPI.send('window:goBack');
  }

  goForward(): void {
    // this.electronAPI.send('window:goForward');
  }


}
