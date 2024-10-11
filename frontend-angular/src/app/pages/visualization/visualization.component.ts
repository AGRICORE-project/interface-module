import { Component } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';

@Component({
    selector: 'app-visualization',
    templateUrl: './visualization.component.html',
    styleUrls: ['./visualization.component.scss'],
    standalone: true,
    imports: [FlexModule, MatButtonModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatCardModule, SafePipe]
})
export class VisualizationComponent {

  supersetUrl: string = `${environment.superset}`;

  constructor() { }

  ngOnInit(): void {}

}