
import { useState } from 'react';

import AnalyticsShell from '../../components/AnalyticsShell/AnalyticsShell';
import GlassPanel from '../../components/GlassPanel/GlassPanel';
import MetricBarChart from '../../components/MetricBarChart/MetricBarChart';

import { useAnalytics } from '../../hooks/useAnalytics';

import {
  BANDS,
  filterBand,
  wavg,
  combineRates
} from '../../utils/chartData';

import './HospitalAnalytics.css';

export default function HospitalAnalytics() {

  const {
    data,
    loading,
    error,
    reload
  } = useAnalytics();

  const [band, setBand] =
    useState(BANDS[0]);


  const rows = data
    ? filterBand(data.ageGroupStats, band)
    : [];


  const pick = (
    key: 'avgLab' | 'avgMeds' | 'avgProcs'
  ) =>

    rows.map(row => ({
      name: row.age,
      value: row[key],
      n: row.encounters
    }));


  // Filter readmission rates by prior inpatient visits
  const inpatientRates = !data

    ? []

    : band === 'All ages'

      ? data.readmitByInpatient

      : combineRates(
          rows.map(
            row => data.inpatientByAge[row.age] ?? []
          )
        );


  const inpatientOrder = [
    '0', '1', '2', '3–5', '6+'
  ];

  const sortedInpatientRates = [...inpatientRates].sort(
    (a, b) =>
      inpatientOrder.indexOf(a.name) -
      inpatientOrder.indexOf(b.name)
  );


  const kpis = [
    {
      label: 'Average Lab Procedures',
      value: wavg(rows, 'avgLab').toFixed(1),
      hint: band
    },
    {
      label: 'Average Medications',
      value: wavg(rows, 'avgMeds').toFixed(1),
      hint: band
    },
    {
      label: 'Average Other Procedures',
      value: wavg(rows, 'avgProcs').toFixed(2),
      hint: band
    },
    {
      label: 'Encounters in Selection',
      value: rows.reduce(
        (sum, row) => sum + row.encounters,
        0
      ).toLocaleString(),
      hint: band
    }
  ];


  return (
    <AnalyticsShell

      title="Hospital Analytics"

      description="Explore historical hospital resource utilization, laboratory procedures, medication usage and the relationship between prior inpatient visits and recorded readmission."

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

      <div className="ha-grid">

        <GlassPanel
          title="Average Laboratory Procedures by Age Group"
        >
          <MetricBarChart
            data={pick('avgLab')}
            label="Avg lab procedures"
            color="#8BB9FF"
            domain={[0, 'auto']}
          />
        </GlassPanel>


        <GlassPanel
          title="Hospital Resource Utilization Comparison"
          badge="Individual scales"
        >

          <MetricBarChart
            height={105}
            data={pick('avgLab')}
            label="Laboratory procedures"
            color="#8BB9FF"
          />

          <MetricBarChart
            height={105}
            data={pick('avgMeds')}
            label="Medications"
            color="#E8A1CA"
          />

          <MetricBarChart
            height={105}
            data={pick('avgProcs')}
            label="Other procedures"
            color="#F4B83F"
          />

        </GlassPanel>


        <GlassPanel
          className="ha-wide"
          title="30-Day Readmission Rate by Previous Inpatient Visits"
          badge="Encounter counts shown"
        >

          <MetricBarChart
            data={sortedInpatientRates}
            label="Readmission rate"
            unit="%"
            color="#B9A4F0"
            showCounts
          />

        </GlassPanel>

      </div>

    </AnalyticsShell>
  );
}
