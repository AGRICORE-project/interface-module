import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

@Component({
  selector: 'app-create-population',
  template: `
    <h3 mat-dialog-title>Synthetic population generator</h3>

    <div mat-dialog-content class="dialog-content">
      <div class="create-population">
        <p class="dialog-subtitle">Create a new create-population</p>
        <hr class="mb20" />
        <p>
          Synthetic population generation is a semi-assisted process that need to be done in the notebooks defined in Jupyter. Please use the next
          link to access this notebooks.
        </p>
        <div fxLayoutAlign="flex-end center" fxLayoutGap="20">
          <button mat-raised-button color="primary">Access Jupyter</button>
        </div>
      </div>

      <div class="data-sources-selection">
        <p class="dialog-subtitle">Data sources selection</p>
        <hr class="mb20" />
        <p>
          Key variables to be included int he population depend on the agent specification. This includes farm area, crop distribution, geolocation...
          To see the full list of parameters, please check next link.
        </p>
        <div fxLayoutAlign="flex-end center" fxLayoutGap="20">
          <button mat-raised-button color="primary"><a href="https://ardit.agricore-project.eu/login" target="_blank">ARDIT link</a></button>
        </div>
      </div>
    </div>

    <div mat-dialog-actions fxLayoutAlign="center center">
      <button mat-button mat-dialog-close>Close</button>
    </div>
  `,
  styles: [
    `
      a {
        color: white !important;
      }
      div.dialog-content {
        padding: 22px 24px 20px 24px !important;
      }
    `,
  ],
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, FlexModule, MatButtonModule, MatDialogActions, MatDialogClose],
})
export class CreatePopulationComponent {}
