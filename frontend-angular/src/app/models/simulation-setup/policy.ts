import { PolicyGroupRelation } from './policy-group-relation';

export interface Policy {
  id: number;
  policyIdentifier: string;
  isCoupled: boolean;
  general: boolean;
  policyDescription: string;
  policyGroupRelations: PolicyGroupRelation[];
}
