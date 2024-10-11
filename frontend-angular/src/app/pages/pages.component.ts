import { Component, OnInit } from '@angular/core';
import { WindowControlsService } from '../services/Interface/window-controls.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    standalone: true,
    imports: [HeaderComponent, SidebarComponent]
})
export class PagesComponent implements OnInit {

  constructor(private windowControlsService: WindowControlsService) { }

  ngOnInit(): void {
    this.windowControlsService.resizeWindow(1920, 1080, true);
    this.windowControlsService.setMinSize(1024, 720)
    this.windowControlsService.maximizeApp();
  }

}
