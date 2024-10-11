import { FadnProduct } from './fadn-product';
import { PolicyGroupRelation } from './policy-group-relation';

export interface ProductGroup {
  id: number;
  name: string;
  fadnProductRelations: string[];
  policyGroupRelations: PolicyGroupRelation[];
  modelSpecificCategories: string[];
  productType: number;
  originalNameDatasource: string;
  productsIncludedInOriginalDataset: string;
  arable: boolean;
  populationId: number;
  population: string;
  fadnProducts?: FadnProduct[];
}
