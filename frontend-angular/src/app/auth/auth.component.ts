import { Component, OnInit } from '@angular/core';
import { WindowControlsService } from '../services/Interface/window-controls.service';
import { RouterOutlet } from '@angular/router';
import { MiniHeaderComponent } from '../shared/mini-header/mini-header.component';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss'],
    standalone: true,
    imports: [MiniHeaderComponent, RouterOutlet]
})
export class AuthComponent implements OnInit {
  
  constructor(private _windowControlsService: WindowControlsService) { }

  ngOnInit(): void {
    this._windowControlsService.setMinSize(520, 920)
    this._windowControlsService.resizeWindow(520, 920, false)
  }
}
