import { FadnProduct } from './fadn-product';
import { ProductGroup } from './product-group';

export interface FadnProductRelation {
  productGroupId: number;
  productGroup: ProductGroup;
  fadnProductId: number;
  fadnProduct: FadnProduct;
  populationId: number;
  population: string;
}
