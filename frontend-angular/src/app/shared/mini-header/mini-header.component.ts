import { Component, OnInit } from '@angular/core';
import { WindowControlsService } from '../../services/Interface/window-controls.service';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
    selector: 'app-mini-header',
    templateUrl: './mini-header.component.html',
    styleUrls: ['./mini-header.component.scss'],
    standalone: true,
    imports: [FlexModule, MatIconModule]
})
export class MiniHeaderComponent implements OnInit {

  constructor(private windowControlsService: WindowControlsService) { }

  ngOnInit(): void {
  }

  closeApp(): void {
    this.windowControlsService.closeApp();
  }

  minimizeApp(): void {
    this.windowControlsService.minimizeApp();
  }

}
