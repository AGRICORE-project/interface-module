import { Component, Input, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';

@Component({
    selector: 'app-navigation-card',
    templateUrl: './navigation-card.component.html',
    styleUrls: ['./navigation-card.component.scss'],
    standalone: true,
    imports: [MatCardModule, FlexModule, MatButtonModule, RouterLink]
})
export class NavigationCardComponent implements OnInit {
  
  @Input() title!: string;
  @Input() message!: string;
  @Input() route!: string;

  constructor() { }

  ngOnInit(): void {
  }

}
