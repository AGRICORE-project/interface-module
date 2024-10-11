export interface PopulationPolicy {
  populationId: number;
  policyIdentifier: string;
  isCoupled: boolean;
  policyDescription: string;
  economicCompensation: number;
  modelLabel: string;
  startYearNumber: number;
  endYearNumber: number;
  coupledCompensations: CoupledCompensationForUI[];
}

export interface CoupledCompensationForUI {
  productGroup: string;
  economicCompensation: number;
}
