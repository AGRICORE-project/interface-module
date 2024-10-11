import { Year } from './year';
import { ProductGroup } from './product-group';
import { ProductGroupElement } from './product-group-element';

export interface AgriculturalProduction {
  productGroupId: number;
  productGroup: ProductGroupElement;
  organicProductionType: number;
  cultivatedArea: number;
  irrigatedArea: number;
  cropProduction: number;
  quantitysold: number;
  valueSales: number;
  yearId: number;
  year: string;
  farmId: number;
  farm: string;
  variableCosts: number;
  landValue: number;
  sellingPrice: number;
}
