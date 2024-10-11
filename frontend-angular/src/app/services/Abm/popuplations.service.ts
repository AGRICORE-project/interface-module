import { Injectable, inject } from '@angular/core';
import { AbmApiBaseService } from '../Base/abm-api-base.service';
import { Observable, map } from 'rxjs';
import { Synthetic } from 'src/app/models/simulation-setup/synthetic';
import { Year } from 'src/app/models/simulation-setup/year';
import { ProductGroup } from 'src/app/models/simulation-setup/product-group';
import { FadnProductRelation } from 'src/app/models/simulation-setup/fadn-relation';
import { FadnProduct } from 'src/app/models/simulation-setup/fadn-product';
import { PopulationActions, SyntheticActions } from 'src/app/models/simulation-setup/synthethic-actions';
import { HttpParams } from '@angular/common/http';
import { PopulationPolicy } from 'src/app/models/simulation-setup/population-policy';

@Injectable({
  providedIn: 'root',
})
export class PopuplationsService {
  _apiAbmService: AbmApiBaseService = inject(AbmApiBaseService);

  constructor() {}

  getSynthetics(): Observable<Synthetic[]> {
    return this._apiAbmService.get<Synthetic[]>('/synthetic/get').pipe(
      map((res) => {
        const syntheticList: Synthetic[] = res;
        return syntheticList;
      }),
    );
  }

  updateSynthetic(id: number, body: Partial<Synthetic>): Observable<Synthetic> {
    const params = new HttpParams().appendAll({
      name: body.name,
      description: body.description,
    });

    return this._apiAbmService.put<Synthetic>(`/synthetic/${id}`, {}, params).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  duplicateSynthetic(id: number): Observable<Synthetic> {
    return this._apiAbmService.post<Synthetic>(`/synthetic/${id}/duplicate`).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  getYears(populationId: number): Observable<Year[]> {
    return this._apiAbmService.get<Year[]>(`/population/${populationId}/years/get`).pipe(
      map((res) => {
        const yearList: Year[] = res;
        return yearList;
      }),
    );
  }

  getProductGropus(populationId: number): Observable<ProductGroup[]> {
    return this._apiAbmService.get<ProductGroup[]>(`/population/${populationId}/productGroup/get`).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  getFadnRelations(productId: number): Observable<FadnProductRelation[]> {
    return this._apiAbmService.get<FadnProductRelation[]>(`/productGroup/${productId}/FADNProductRelation/get`).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  getFadnProducts(): Observable<FadnProduct[]> {
    return this._apiAbmService.get<FadnProduct[]>(`/FADNProducts/get`).pipe(
      map((res) => {
        return res;
      }),
    );
  }

  exportPopulation(populationId: number) {
    return this._apiAbmService.get<PopulationActions>(`/population/${populationId}/export`).pipe(map((res) => res));
  }

  importSynthetic(synthetic: SyntheticActions) {
    return this._apiAbmService.post<Synthetic>(`/synthetic/import`, synthetic).pipe(map((res) => res));
  }

  exportSynthetic(syntheticId: number) {
    return this._apiAbmService.get<SyntheticActions>(`/synthetic/export/${syntheticId}`).pipe(map((res) => res));
  }

  updateProductGroupCategories(id: number, categories: string[]): Observable<ProductGroup> {
    const params = new HttpParams().appendAll({
      categories,
    });

    return this._apiAbmService.put<ProductGroup>(`/Utils/UpdateProductGroupCategories/${id}`, {}, params).pipe(map((res) => res));
  }

  getPopulationPolicies(populationId: number): Observable<PopulationPolicy[]> {
    return this._apiAbmService.get<PopulationPolicy[]>(`/population/${populationId}/policies/getForUI`).pipe(map((res) => res));
  }
}
