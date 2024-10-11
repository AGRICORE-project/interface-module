import { Year } from './year';
import { Population } from './populations';

export interface Synthetic {
  id: number;
  description: string;
  populationId: number;
  population?: Population;
  yearId: number;
  year?: Year;
  name: string;
  selected?: boolean;
}
