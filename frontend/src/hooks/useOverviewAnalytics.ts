
import { useEffect, useState, useCallback } from 'react';

import {
  getOverviewAnalytics
} from '../services/analyticsService';

import type {
  OverviewAnalytics
} from '../data/analyticsTypes';

export function useOverviewAnalytics() {
  const [data, setData] =
    useState<OverviewAnalytics | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    setAttempt(previous => previous + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getOverviewAnalytics(controller.signal)
      .then(result => {
        if (!controller.signal.aborted) {
          setData(result);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError(
            'Unable to load healthcare analytics. Please check that the Flask backend is running.'
          );
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [attempt]);

  return {
    data,
    loading,
    error,
    reload
  };
}
