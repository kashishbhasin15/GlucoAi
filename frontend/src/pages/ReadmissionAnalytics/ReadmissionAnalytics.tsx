
import { useState } from 'react';

import AnalyticsShell from '../../components/AnalyticsShell/AnalyticsShell';
import GlassPanel from '../../components/GlassPanel/GlassPanel';
import MetricBarChart from '../../components/MetricBarChart/MetricBarChart';

import { useAnalytics } from '../../hooks/useAnalytics';

import type { RateRow } from '../../types';

import './ReadmissionAnalytics.css';

export default function ReadmissionAnalytics() {

  const {
    data,
    loading,
    error,
    reload
  } = useAnalytics();

  const [hideSmall, setHideSmall] =
    useState(false);


  // Optional minimum encounter filter
  const filterRows = (
    rows: RateRow[] = []
  ) =>

    hideSmall

      ? rows.filter(
          row => (row.n ?? 0) >= 500
        )

      : rows;


  // Gender-specific readmission rates
  const femaleRate = data?.readmitByGender.find(
    row => row.name === 'Female'
  );

  const maleRate = data?.readmitByGender.find(
    row => row.name === 'Male'
  );


  // Highest-rate emergency group in current selection
  const topEmergencyGroup = [

    ...filterRows(
      data?.readmitByEmergency
    )

  ].sort(
    (a, b) => b.value - a.value
  )[0];


  const kpis = [
    {
      label: 'Overall 30-Day Readmission',

      value: data

        ? `${data.overallReadmitRate.toFixed(2)}%`

        : '—',

      hint: 'All historical encounters'
    },

    {
      label: 'Highest-Rate Emergency Group',

      value: topEmergencyGroup?.name ?? '—',

      hint: topEmergencyGroup

        ? `${
            topEmergencyGroup.value.toFixed(2)
          }% · n=${
            topEmergencyGroup.n?.toLocaleString()
          }`

        : 'No matching group'
    },

    {
      label: 'Female Readmission Rate',

      value: femaleRate

        ? `${femaleRate.value.toFixed(2)}%`

        : '—',

      hint: femaleRate

        ? `${femaleRate.n?.toLocaleString()} encounters`

        : ''
    },

    {
      label: 'Male Readmission Rate',

      value: maleRate

        ? `${maleRate.value.toFixed(2)}%`

        : '—',

      hint: maleRate

        ? `${maleRate.n?.toLocaleString()} encounters`

        : ''
    }
  ];


  return (
    <AnalyticsShell

      title="Readmission Analytics"

      description="Explore recorded 30-day readmission rates across demographic groups, hospital stay durations, admission types and previous emergency visits. Encounter counts provide context for interpreting smaller groups."

      kpis={kpis}

      filter={
        <label>

          <input
            type="checkbox"
            checked={hideSmall}
            onChange={event =>
              setHideSmall(event.target.checked)
            }
          />

          {' '}
          Hide groups with fewer than 500 encounters

        </label>
      }

      loading={loading}
      error={error}
      onRetry={reload}
    >

      <div className="ra-grid">

        <GlassPanel
          title="30-Day Readmission Rate by Gender"
        >

          <MetricBarChart
            data={filterRows(
              data?.readmitByGender
            )}
            label="Readmission rate"
            unit="%"
            color="#E8A1CA"
            showCounts
          />

        </GlassPanel>


        <GlassPanel
          title="Readmission Rate by Hospital Stay Duration"
        >

          <MetricBarChart
            data={filterRows(
              data?.readmitByStay
            )}
            label="Readmission rate"
            unit="%"
            color="#8BB9FF"
            showCounts
          />

        </GlassPanel>


        <GlassPanel
          title="Readmission Rate by Admission Type"
        >

          <MetricBarChart
            data={filterRows(
              data?.readmitByAdmission
            )}
            label="Readmission rate"
            unit="%"
            color="#B9A4F0"
            showCounts
          />

        </GlassPanel>


        <GlassPanel
          title="Readmission Rate by Previous Emergency Visits"
        >

          <MetricBarChart
            data={filterRows(
              data?.readmitByEmergency
            )}
            label="Readmission rate"
            unit="%"
            color="#F4B83F"
            showCounts
          />

        </GlassPanel>

      </div>

    </AnalyticsShell>
  );
}
