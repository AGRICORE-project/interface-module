import { NgIf } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { FlexModule } from '@ngbracket/ngx-layout';
import { Observable, Subscription, forkJoin, switchMap } from 'rxjs';
import { FadnProduct } from 'src/app/models/simulation-setup/fadn-product';
import { ProductGroup } from 'src/app/models/simulation-setup/product-group';
import { FadnProductRelation } from 'src/app/models/simulation-setup/fadn-relation';
import { PopuplationsService } from 'src/app/services/Abm/popuplations.service';
import { AlertService } from 'src/app/services/Interface/alert-service.service';
import { SimulationSetupService } from 'src/app/services/Interface/simulation-setup.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { ModelCategoryEditComponent } from 'src/app/dialogs/model-category-edit/model-category-edit/model-category-edit.component';

@Component({
  selector: 'app-product-grouping',
  templateUrl: './product-grouping.component.html',
  styleUrls: ['./product-grouping.component.scss'],
  standalone: true,
  imports: [
    FlexModule,
    NgIf,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class ProductGroupingComponent implements OnInit, OnDestroy {
  @Input({ required: true }) populationIntheritedForm!: FormGroup;
  _populationsService: PopuplationsService = inject(PopuplationsService);
  _alertService: AlertService = inject(AlertService);
  _simulationSetupService: SimulationSetupService = inject(SimulationSetupService);

  productGroup: ProductGroup[];
  modelSpecificCategories: string[] = [];
  FadnRelationsList: FadnProductRelation[][];
  productFadn: FadnProduct[];
  showModelAlert: boolean = true;
  isLoading: boolean = true;
  dataSource: MatTableDataSource<ProductGroup> = new MatTableDataSource();
  formSubscription: Subscription;

  displayedColumns: string[] = ['custom_group', 'fadn_products', 'product_rica', 'model_specific_categories'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private dialog: MatDialog) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // if synthetic population is updated, reinitialize the component
    this.formSubscription = this.populationIntheritedForm.valueChanges.subscribe(() => this.ngOnInit());
  }

  ngOnInit(): void {
    this.fetchData();
  }

  openEditModal(productGroup: ProductGroup) {
    this.dialog.open(ModelCategoryEditComponent, {
      data: productGroup,
    });
  }

  private mergeProducts(productGroup: ProductGroup[]): ProductGroup[] {
    if (!productGroup) return [];
    /* Group by name */
    const productGroupByName = productGroup.reduce((acc: { [key: string]: ProductGroup[] }, curr) => {
      const key = curr.name;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(curr);
      return acc;
      /* return format
       * {
       *  "name1": [productGroup1],
       *  "name2": [productGroup2]
       * }
       */
    }, {});

    const productGroupByNameArray = Object.entries(productGroupByName);
    const productGroupByNameArrayMerged = productGroupByNameArray.map(([name, groups]) => {
      // merge the productsIncludedInOriginalDataset
      const mergedProductGroup = groups.reduce((acc: ProductGroup, curr: ProductGroup) => {
        acc.productsIncludedInOriginalDataset = acc.productsIncludedInOriginalDataset.concat(`;${curr.productsIncludedInOriginalDataset}`);
        return acc;
      });
      return mergedProductGroup;
    });

    return productGroupByNameArrayMerged;
  }

  private fetchData() {
    const { populationId } = this.populationIntheritedForm.get('population')?.value || '';
    if (!populationId) return;
    {
      // Get FADN products first
      this.getFadnProducts().subscribe((res) => (this.productFadn = res));
      // Get Product Groups
      this.getProductGroups(populationId)
        .pipe(
          switchMap((productGroup) => {
            // make a list of all modelSpecificCategories in one array
            const modelSpecificCategories = productGroup.reduce((acc: string[], curr) => {
              acc = acc.concat(curr.modelSpecificCategories);
              return acc;
            }, []);
            // remove duplicates and null values
            this.modelSpecificCategories = Array.from(new Set(modelSpecificCategories)).filter((category) => category);
            // Once we have the product groups, group them by name
            this.productGroup = this.mergeProducts(productGroup);
            // Get FADN relations for each product group
            return forkJoin<FadnProductRelation[][]>(productGroup.map((product) => this.getFadnRelations(product.id)));
          }),
        )
        .subscribe({
          next: (FadnRelationsList) => {
            // Once we have the FADN relations, merge them with the product groups
            const products = this.mergeFadn(FadnRelationsList);
            this.dataSource.data = products;
            this._simulationSetupService.updateCurrentSimulationProducts(products);

            this.isLoading = false;
          },
          error: (err) => this._alertService.alertError(err.message),
        });
    }
  }

  private mergeFadn(FadnRelations: FadnProductRelation[][]): ProductGroup[] {
    // add fadnProducts to each productGroup

    if (!FadnRelations || !this.productFadn) return this.productGroup;

    const productGroup = this.productGroup.map((productGroup, index) => {
      const fadnProducts = FadnRelations[index]?.map((relation) => {
        const fadnProduct = this.productFadn.find((product) => product.id === relation?.fadnProductId);
        return fadnProduct;
      });
      productGroup.fadnProducts = fadnProducts;
      return productGroup;
    });
    return productGroup;
  }

  private getProductGroups(id: number): Observable<ProductGroup[]> {
    return this._populationsService.getProductGropus(id);
  }
  private getFadnRelations(productId: number): Observable<FadnProductRelation[]> {
    return this._populationsService.getFadnRelations(productId);
  }
  private getFadnProducts(): Observable<FadnProduct[]> {
    return this._populationsService.getFadnProducts();
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}
