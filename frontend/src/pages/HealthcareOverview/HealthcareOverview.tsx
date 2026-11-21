// import { useState } from 'react';
// import AnalyticsShell from '../../components/AnalyticsShell/AnalyticsShell';
// import GlassPanel from '../../components/GlassPanel/GlassPanel';
// import ThreeDBarChart from '../../components/ThreeDBarChart/ThreeDBarChart';
// import ThreeDDonutChart from '../../components/ThreeDDonutChart/ThreeDDonutChart';
// import { useAnalytics } from '../../hooks/useAnalytics';
// import { toAgeBars } from '../../utils/chartData';
// import './HealthcareOverview.css';
// export default function HealthcareOverview() {
//   const { data, loading, error, reload } = useAnalytics();
//   const [age, setAge] = useState<string | null>(null);
//   const sel = data?.ageGroupStats.find(a => a.age === age);
//   const ref = data?.referenceStats ?? [];
//   const kpis = sel
//     ? [{ label: 'Hospital Encounters', value: sel.encounters.toLocaleString(), hint: `Age ${sel.age} · demo` }, { label: 'Unique Patients', value: 'n/a', hint: 'All ages only' }, { label: '30-Day Readmission Rate', value: `${sel.readmitRate}%`, hint: 'Demo' }, { label: 'Average Hospital Stay', value: `${sel.avgStay} d`, hint: 'Demo' }]
//     : ref.map(r => ({ label: r.label, value: r.value, hint: 'Historical reference' }));
//   return (
//     <AnalyticsShell title="Healthcare Overview" description="A high-level view of hospital encounters, patient demographics and readmission status in a historical diabetes research dataset." kpis={kpis}
//       filter={<><span className="shell__chip">Age group</span><button aria-pressed={age === null} onClick={() => setAge(null)}>All</button>{data?.ageGroupStats.map(a => <button key={a.age} aria-pressed={age === a.age} onClick={() => setAge(a.age)}>{a.age}</button>)}</>}
//       loading={loading} error={error} onRetry={reload} biPage="Healthcare Overview">
//       {data && (
//         <div className="ho-grid">
//           <GlassPanel flush className="ho-bars"><ThreeDBarChart title="Hospital Encounters by Age Group" data={toAgeBars(data.ageGroupStats)} selected={age} /></GlassPanel>
//           <GlassPanel flush className="ho-chart"><ThreeDDonutChart title="Encounters by Gender" segments={data.genderSegments} /></GlassPanel>
//           <GlassPanel flush className="ho-chart"><ThreeDDonutChart title="Readmission Status" segments={data.statusSegments} hole={0.55} /></GlassPanel>
//         </div>
//       )}
//     </AnalyticsShell>
//   );
// }











import { useState } from 'react';

import AnalyticsShell from '../../components/AnalyticsShell/AnalyticsShell';
import GlassPanel from '../../components/GlassPanel/GlassPanel';
import ThreeDBarChart from '../../components/ThreeDBarChart/ThreeDBarChart';
import ThreeDDonutChart from '../../components/ThreeDDonutChart/ThreeDDonutChart';

import {
  useOverviewAnalytics
} from '../../hooks/useOverviewAnalytics';

import { toAgeBars } from '../../utils/chartData';

import './HealthcareOverview.css';

export default function HealthcareOverview() {

  const {
    data,
    loading,
    error,
    reload
  } = useOverviewAnalytics();

  const [age, setAge] =
    useState<string | null>(null);

  // Selected age group statistics
  const selectedAge = data?.ageGroupStats.find(
    item => item.age === age
  );

  // Selected age group details
  const selectedDetails =
    age ? data?.ageDetails[age] : undefined;

  // KPI cards
  const kpis = selectedAge && selectedDetails

    ? [
        {
          label: 'Hospital Encounters',
          value: selectedAge.encounters.toLocaleString(),
          hint: `Age ${selectedAge.age}`
        },
        {
          label: 'Unique Patients',
          value: selectedDetails.uniquePatients.toLocaleString(),
          hint: `Age ${selectedAge.age}`
        },
        {
          label: '30-Day Readmission Rate',
          value: `${selectedAge.readmitRate.toFixed(2)}%`,
          hint: `Age ${selectedAge.age}`
        },
        {
          label: 'Average Hospital Stay',
          value: `${selectedAge.avgStay.toFixed(2)} days`,
          hint: `Age ${selectedAge.age}`
        }
      ]

    : (data?.referenceStats ?? []).map(item => ({
        label: item.label,
        value: item.value,
        hint: 'Historical dataset · 1999–2008'
      }));

  // Dynamic gender distribution
  const genderSegments =
    selectedDetails?.genderSegments ??
    data?.genderSegments ??
    [];

  // Dynamic readmission distribution
  const statusSegments =
    selectedDetails?.statusSegments ??
    data?.statusSegments ??
    [];

  return (
    <AnalyticsShell

      title="Healthcare Overview"

      description="Explore hospital encounters, patient demographics and readmission patterns across 130 US hospitals using historical diabetes healthcare records from 1999–2008."

      kpis={kpis}

      filter={
        <>
          <span className="shell__chip">
            Age group
          </span>

          <button
            aria-pressed={age === null}
            onClick={() => setAge(null)}
          >
            All
          </button>

          {data?.ageGroupStats.map(item => (

            <button
              key={item.age}
              aria-pressed={age === item.age}
              onClick={() => setAge(item.age)}
            >
              {item.age}
            </button>

          ))}
        </>
      }

      loading={loading}
      error={error}
      onRetry={reload}
    >

      {data && (

        <div className="ho-grid">

          {/* Hospital encounters by age */}

          <GlassPanel flush className="ho-bars">

            <ThreeDBarChart
              title="Hospital Encounters by Age Group"
              data={toAgeBars(data.ageGroupStats)}
              selected={age}
              demo={false}
            />

          </GlassPanel>

          {/* Gender distribution */}

          <GlassPanel flush className="ho-chart">

            <ThreeDDonutChart
              title={
                age
                  ? `Encounters by Gender · ${age}`
                  : 'Encounters by Gender'
              }
  segments={genderSegments.filter(s => s.value > 0)}
              demo={false}
            />

          </GlassPanel>

          {/* Readmission distribution */}

          <GlassPanel flush className="ho-chart">

            <ThreeDDonutChart
              title={
                age
                  ? `Readmission Status · ${age}`
                  : 'Readmission Status'
              }
              segments={statusSegments}
              hole={0.55}
              demo={false}
            />

          </GlassPanel>

        </div>

      )}

    </AnalyticsShell>
  );
}
