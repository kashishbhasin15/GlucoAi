
import type { AgeGroupStat, RateRow } from '../types';

export interface ChartSegment {
  label: string;
  value: number;
  color: string;
}

export interface ReferenceStat {
  label: string;
  value: string;
}

export interface AgeDetails {
  uniquePatients: number;
  genderSegments: ChartSegment[];
  statusSegments: ChartSegment[];
}

export interface OverviewAnalytics {
  referenceStats: ReferenceStat[];
  ageGroupStats: AgeGroupStat[];
  genderSegments: ChartSegment[];
  statusSegments: ChartSegment[];
  ageDetails: Record<string, AgeDetails>;
}

export interface AnalyticsBundle {
  overallReadmitRate: number;

  ageGroupStats: AgeGroupStat[];

  stayDist: RateRow[];

  stayDistByAge: Record<string, RateRow[]>;

  inpatientByAge: Record<string, RateRow[]>;

  readmitByGender: RateRow[];

  readmitByStay: RateRow[];

  readmitByAdmission: RateRow[];

  readmitByInpatient: RateRow[];

  readmitByEmergency: RateRow[];
}
