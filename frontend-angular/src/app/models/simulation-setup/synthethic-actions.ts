import { Farm } from './farm';
import { ProductGroup } from './product-group';

// Import / Export model for synthetic population or population
export interface SyntheticActions {
  description: string;
  name: string;
  yearNumber: number;
  population: Population;
}

export interface PopulationActions {
  description: string;
  farms: Farm[];
  productGroups: ProductGroup[];
}

export interface Population {
  description: string;
  farms: Farm[];
  productGroups: ProductGroup[];
}
