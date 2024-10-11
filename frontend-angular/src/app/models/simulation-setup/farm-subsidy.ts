import { Policy } from './policy';

export interface FarmYearSubsidy {
  value: number;
  farmId: number;
  farm: string;
  yearId: number;
  year: string;
  policyId: number;
  policy: Policy;
}
