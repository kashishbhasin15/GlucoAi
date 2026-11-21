
import {
  useCallback,
  useEffect,
  useState
} from 'react';

import {
  getAnalytics
} from '../services/analyticsService';

import type {
  AnalyticsBundle
} from '../data/analyticsTypes';

export function useAnalytics() {

  const [data, setData] =
    useState<AnalyticsBundle | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [attempt, setAttempt] =
    useState(0);

  const reload = useCallback(() => {
    setAttempt(previous => previous + 1);
  }, []);

  useEffect(() => {

    const controller = new AbortController();

    setLoading(true);
    setError(null);

    getAnalytics(controller.signal)

      .then(result => {

        if (!controller.signal.aborted) {
          setData(result);
        }

      })

      .catch(() => {

        if (!controller.signal.aborted) {
          setError(
            'Unable to load analytics. Please check that the Flask backend is running.'
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
