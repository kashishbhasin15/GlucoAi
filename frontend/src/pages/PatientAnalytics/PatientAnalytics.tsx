
import { useState } from 'react';

import AnalyticsShell from '../../components/AnalyticsShell/AnalyticsShell';
import GlassPanel from '../../components/GlassPanel/GlassPanel';
import MetricBarChart from '../../components/MetricBarChart/MetricBarChart';

import { useAnalytics } from '../../hooks/useAnalytics';

import {
  BANDS,
  filterBand,
  wavg,
  combineCounts
} from '../../utils/chartData';

import './PatientAnalytics.css';

export default function PatientAnalytics() {

  const {
    data,
    loading,
    error,
    reload
  } = useAnalytics();

  const [band, setBand] =
    useState(BANDS[0]);


  // Filter age groups
  const rows = data
    ? filterBand(data.ageGroupStats, band)
    : [];


  const pick = (
    key: 'avgStay' | 'avgMeds' | 'readmitRate'
  ) =>

    rows.map(row => ({
      name: row.age,
      value: row[key],
      n: row.encounters
    }));


  // Filter hospital stay distribution
  const stayDistribution = !data

    ? []

    : band === 'All ages'

      ? data.stayDist

      : combineCounts(
          rows.map(
            row => data.stayDistByAge[row.age] ?? []
          )
        );


  const kpis = [
    {
      label: 'Encounters in Selection',
      value: rows.reduce(
        (sum, row) => sum + row.encounters,
        0
      ).toLocaleString(),
      hint: band
    },
    {
      label: 'Average Hospital Stay',
      value: `${wavg(rows, 'avgStay').toFixed(2)} d`,
      hint: band
    },
    {
      label: 'Average Medications',
      value: wavg(rows, 'avgMeds').toFixed(1),
      hint: band
    },
    {
      label: '30-Day Readmission',
      value: `${
        wavg(rows, 'readmitRate').toFixed(2)
      }%`,
      hint: band
    }
  ];


  return (
    <AnalyticsShell

      title="Patient Analytics"

      description="Explore hospital stay, medication usage and recorded readmission patterns across patient age groups in the 1999–2008 historical healthcare dataset."

      kpis={kpis}

      filter={
        <>
          <span className="shell__chip">
            Age group
          </span>

          {BANDS.map(item => (

            <button
              key={item}
              aria-pressed={band === item}
              onClick={() => setBand(item)}
            >
              {item}
            </button>

          ))}
        </>
      }

      loading={loading}
      error={error}
      onRetry={reload}
    >

      <div className="pa-grid">

        <GlassPanel
          title="Average Hospital Stay by Age Group"
        >
          <MetricBarChart
            data={pick('avgStay')}
            label="Avg stay"
            unit=" days"
            color="#8BB9FF"
          />
        </GlassPanel>


        <GlassPanel
          title="Hospital Stay Distribution"
        >
          <MetricBarChart
            data={stayDistribution}
            label="Encounters"
            color="#E8A1CA"
          />
        </GlassPanel>


        <GlassPanel
          title="Average Medications by Age Group"
        >
          <MetricBarChart
            data={pick('avgMeds')}
            label="Avg medications"
            color="#B9A4F0"
          />
        </GlassPanel>


        <GlassPanel
          title="30-Day Readmission Rate by Age Group"
        >
          <MetricBarChart
            data={pick('readmitRate')}
            label="Readmission rate"
            unit="%"
            color="#F4B83F"
          />
        </GlassPanel>

      </div>

    </AnalyticsShell>
  );
}
