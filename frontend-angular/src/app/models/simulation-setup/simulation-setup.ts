import { PopulationPolicy } from './population-policy';
import { Synthetic } from './synthetic';

export class SimulationSetup {
  syntheticPopulation!: {
    population: Synthetic;
  };
  policiesList!: { additionalPolicies: PopulationPolicy[] };
  configuration!: {
    simulationHorizon: string;
    shortTermBranch: string;
    longTermBranch: string;
    queueSuffix?: string;
    ignoreLP?: boolean;
    ignoreLMM?: boolean;
    compress?: boolean;
  };
  // simulationHorizon!: SimulationHorizon
  // solverBiophysical: SolverBiophysical
  // kpi: Kpi[]
}
