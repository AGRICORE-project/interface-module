import { AgriculturalProduction } from './agricultural-production';
import { FarmYearSubsidy } from './farm-subsidy';
import { HoldersFarmYearDatum } from './holders-farm-year';
import { LivestockProduction } from './livestock-production';
import { SyntheticPopulation } from './synthetic-population';

export interface Year {
  id: number;
  yearNumber: number;
  populationId: number;
  population: string;
  farmYearSubsidies: FarmYearSubsidy[];
  holdersFarmYearData: HoldersFarmYearDatum[];
  simulationScenarios: string[];
  syntheticPopulations: SyntheticPopulation[];
  agriculturalProductions: AgriculturalProduction[];
  livestockProductions: LivestockProduction[];
}
