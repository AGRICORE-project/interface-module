import { Farm } from './farm';
import { FadnProductRelation } from './fadn-relation';
import { Year } from './year';
import { ProductGroup } from './product-group';
import { PolicyGroupRelation } from './policy-group-relation';
import { SyntheticPopulation } from './synthetic-population';

export interface Population {
  description: string;
  farms: Farm[];
  years: Year[];
  fadnProductRelations: FadnProductRelation[];
  productGroups: ProductGroup[];
  policyGroupRelations: PolicyGroupRelation[];
  syntheticPopulations: SyntheticPopulation[];
  simulationScenarios: string[];
}
