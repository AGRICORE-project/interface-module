import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreatePopulationComponent } from 'src/app/dialogs/simulation-setup/create-population/create-population.component';
// import { MaterialFileInputModule } from 'ngx-material-file-input';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FlexModule } from '@ngbracket/ngx-layout';
import { MatCardModule } from '@angular/material/card';
import { Synthetic } from 'src/app/models/simulation-setup/synthetic';
import { FormGroup } from '@angular/forms';
import { Subscription, forkJoin, switchMap } from 'rxjs';
import { PopuplationsService } from 'src/app/services/Abm/popuplations.service';
import { SyntheticActions } from 'src/app/models/simulation-setup/synthethic-actions';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Year } from 'src/app/models/simulation-setup/year';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EditPopulationComponent } from 'src/app/dialogs/simulation-setup/edit-population/edit-population.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-synthetic-population',
  templateUrl: './synthetic-population.component.html',
  styleUrls: ['./sytnethic-population.component.scss'],
  standalone: true,
  imports: [
    MatCardModule,
    FlexModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
  ],
})
export class SyntheticPopulationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('searchInput') searchInput: ElementRef<HTMLInputElement>;
  @Input({ required: true }) populationIntheritedForm!: FormGroup;

  displayedColumns: string[] = ['name', 'year', 'description', 'actions', 'run'];
  dataSource = new MatTableDataSource<Synthetic>([]);
  @ViewChild(MatPaginator) paginator: MatPaginator;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  syntheticsList: Synthetic[];

  $formSubscription: Subscription;
  isLoading: boolean = false;

  _populationService: PopuplationsService = inject(PopuplationsService);
  _alertService: AlertService = inject(AlertService);

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchTableData();
    this.$formSubscription = this.populationIntheritedForm.controls['population'].valueChanges.subscribe((value) => {
      // if the form is cleared, unselect all synthetics, this happens on reset stepper or unselect population
      if (!value) this.syntheticsList.forEach((synthetic) => (synthetic.selected = false));
      // update table select icons
      this.dataSource.data = this.syntheticsList;
    });
  }

  fetchTableData(): void {
    this._populationService
      .getSynthetics()
      .pipe(
        // First get populations, then request for every population its linked years
        switchMap((populations) => {
          this.syntheticsList = populations;
          return forkJoin<Year[][]>(populations.map((population) => this.getYearById(population.populationId)));
        }),
      )
      .subscribe({
        next: (yearsList) => {
          // merge synthethic with year
          this.syntheticsList = this.mergePopulationWithYears(yearsList);
          // set table
          this.dataSource.data = this.syntheticsList;
        },
        error: (err) => this._alertService.alertError(err.error.message ?? err),
      });
  }

  openCreateDialog(): void {
    this.dialog.open(CreatePopulationComponent);
  }

  openEditDialog(synthetic: Synthetic) {
    this.dialog
      .open(EditPopulationComponent, {
        data: synthetic,
      })
      .afterClosed()
      .subscribe((synthethic: Synthetic) => {
        if (!synthethic) return;
        const index = this.syntheticsList.findIndex((s) => s.id === synthethic.id);
        const updatedSynthethic = {
          ...this.syntheticsList[index],
          name: synthethic.name,
          description: synthethic.description,
        };
        this.syntheticsList[index] = updatedSynthethic;
        this.dataSource.data = this.syntheticsList;
      });
  }

  duplicateSynthetic(synthetic: Synthetic) {
    const { year } = synthetic;
    this._populationService.duplicateSynthetic(synthetic.id).subscribe({
      next: (res) => {
        const newSynthetic = {
          ...res,
          year,
        };
        this.syntheticsList.push(newSynthetic);
        this.dataSource.data = this.syntheticsList;
        this._alertService.alertSuccess('Synthetic population duplicated successfully');
      },
      error: (err) => this._alertService.alertError(err.error.message ?? err),
    });
  }

  exportSynthetic(synthetic: Synthetic): void {
    if (!synthetic) return;
    this.isLoading = true;
    this._populationService
      .exportSynthetic(synthetic.id)
      .subscribe((res) => {
        // create a blob object from the response
        const blob = new Blob([JSON.stringify(res)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        // create a link for our popup
        const link = document.createElement('a');
        link.href = url;
        link.download = `${synthetic.description}.json`;
        // trigger the download
        link.click();
      })
      .add(() => (this.isLoading = false));
  }

  importSynthetic(): void {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.click();
    fileInput.onchange = () => {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        this.isLoading = true;
        const synthethic: SyntheticActions = JSON.parse(reader.result as string);
        if (!synthethic) {
          this._alertService.alertError('Invalid synthetic file');
          return;
        }
        this._populationService
          .importSynthetic(synthethic)
          .subscribe({
            // on success, refresh the table
            next: () => this.fetchTableData(),
            error: () => this._alertService.alertError('Error importing population'),
          })
          .add(() => (this.isLoading = false));
      };
    };
  }

  selectSynthetic(synthetic: Synthetic) {
    const index = this.syntheticsList.findIndex((s) => s.id === synthetic.id);
    this.syntheticsList[index].selected = !this.syntheticsList[index].selected;
    // if selected, set the population in the form else clear it
    this.syntheticsList[index].selected
      ? this.populationIntheritedForm.controls['population'].setValue(synthetic)
      : this.populationIntheritedForm.controls['population'].setValue(null);
  }

  get hasSelectedSynthetic() {
    return this.syntheticsList.some((s) => s.selected);
  }

  /*
   * Merge the population with related years, data comes that way
   */
  private mergePopulationWithYears(yearsList: Year[][]) {
    return this.syntheticsList.map((population, index) => {
      const year: Year = yearsList[index].find((year) => year.populationId === population.populationId);
      return {
        ...population,
        year,
      };
    });
  }

  /*
   * Get years array by population id
   */
  private getYearById(populationId: number) {
    return this._populationService.getYears(populationId);
  }

  ngOnDestroy(): void {
    this.$formSubscription.unsubscribe();
  }
}
