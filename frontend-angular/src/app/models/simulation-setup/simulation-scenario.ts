import { PopulationPolicy } from './population-policy';

export interface SimulationScenario {
  id: number;
  populationId: number;
  yearId: number;
  shortTermModelBranch: string;
  longTermModelBranch: string;
  horizon: number;
  queueSuffix?: string;
  simulationRun: SimulationRun | null;
  expanded?: boolean;
  logs?: Log[];
}

export interface SimulationRun {
  id: number;
  simulationScenarioId: number;
  overallStatus: OverallStatus;
  currentStage: number;
  currentYear: number;
  currentSubstage: SimulationStage;
  currentStageProgress: number;
  currentSubStageProgress: number;
}

export interface Log {
  simulationRunId: number;
  timeStamp: number;
  source: string;
  logLevel: number;
  title: string;
  description: string;
  id: number;
}

export interface NewSimulationScenario {
  syntheticPopulationId: number;
  shortTermModelBranch: string;
  longTermModelBranch: string;
  horizon: string;
  queueSuffix?: string;
  ignoreLP?: boolean;
  ignoreLMM?: boolean;
  compress?: boolean;
  additionalPolicies: PopulationPolicy[];
}

export enum OverallStatus {
  IN_PROGRESS = 1,
  CANCELLED = 2,
  COMPLETED = 3,
  ERROR = 4,
}

export enum SimulationStage {
  DATA_PREPARATION = 1,
  LONGPERIOD = 2,
  LANDMARKET = 3,
  SHORTPERIOD = 4,
  REALISATION = 5,
}

export const LogLevelEnum = {
  TRACE: 5,
  DEBUG: 10,
  INFO: 20,
  SUCCESS: 25,
  WARNING: 30,
  ERROR: 40,
  CRITICAL: 50,
} as const;
