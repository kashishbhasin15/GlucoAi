
import axios from 'axios';

import type {
  OverviewAnalytics,
  AnalyticsBundle
} from '../data/analyticsTypes';

import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000
});


// Healthcare Overview
export async function getOverviewAnalytics(
  signal?: AbortSignal
): Promise<OverviewAnalytics> {

  const response = await api.get<OverviewAnalytics>(
    '/analytics/overview',
    { signal }
  );

  return response.data;
}


// Patient, Hospital and Readmission Analytics
export async function getAnalytics(
  signal?: AbortSignal
): Promise<AnalyticsBundle> {

  const response = await api.get<AnalyticsBundle>(
    '/analytics',
    { signal }
  );

  return response.data;
}
