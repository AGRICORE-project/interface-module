import { AgriculturalProduction } from './agricultural-production';
import { FarmYearSubsidy } from './farm-subsidy';
import { HoldersFarmYearDatum } from './holders-farm-year';
import { LivestockProduction } from './livestock-production';

export interface Farm {
  lat: number;
  long: number;
  altitude: number;
  regionLevel1: number;
  regionLevel1Name: string;
  regionLevel2: number;
  regionLevel2Name: string;
  regionLevel3: number;
  regionLevel3Name: string;
  farmCode: string;
  technicalEconomicOrientation: number;
  agriculturalProductions: AgriculturalProduction[];
  livestockProductions: LivestockProduction[];
  populationId: number;
  population: string;
  farmYearSubsidies: FarmYearSubsidy[];
  holdersFarmYearData: HoldersFarmYearDatum[];
}
