import { Year } from './year';
import { ProductGroup } from './product-group';
import { ProductGroupElement } from './product-group-element';

export interface LivestockProduction {
  productGroupId: number;
  productGroup: ProductGroupElement;
  farmId: number;
  farm: string;
  yearId: number;
  year: string;
  numberOfAnimals: number;
  dairyCows: number;
  numberOfAnimalsSold: number;
  valueSoldAnimals: number;
  numberAnimalsForSlaughtering: number;
  valueSlaughteredAnimals: number;
  numberAnimalsRearingBreading: number;
  valueAnimalsRearingBreading: number;
  milkTotalProduction: number;
  milkProductionSold: number;
  milkTotalSales: number;
  milkVariableCosts: number;
  woolTotalProduction: number;
  woolProductionSold: number;
  eggsTotalSales: number;
  eggsTotalProduction: number;
  eggsProductionSold: number;
  manureTotalSales: number;
  variableCosts: number;
  sellingPrice: number;
}
