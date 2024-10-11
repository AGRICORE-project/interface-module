import { PolicyGroupRelation } from './policy-group-relation';

export interface ProductGroupElement {
  name: string;
  fadnProductRelations: string[];
  policyGroupRelations: PolicyGroupRelation[];
  productType: number;
  originalNameDatasource: string;
  productsIncludedInOriginalDataset: string;
  arable: boolean;
  populationId: number;
  population: string;
}
