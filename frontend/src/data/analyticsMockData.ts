import type { AgeGroupStat, RateRow } from '../types';
/** DEMO DATA — illustrative values only, except the four historical reference values below. */
export const referenceStats = [
  { label: 'Total Hospital Encounters', value: '≈102K' }, { label: 'Unique Patients', value: '≈72K' },
  { label: '30-Day Readmission Rate', value: '11.16%' }, { label: 'Average Hospital Stay', value: '4.40 days' },
];
export const ageGroupStats: AgeGroupStat[] = [
  { age: '0–20', encounters: 1100, share: 1.1, readmitRate: 6.1, avgStay: 2.9, avgMeds: 12.4, avgLab: 38.2, avgProcs: 1.0 },
  { age: '20–30', encounters: 1650, share: 1.6, readmitRate: 9.4, avgStay: 3.3, avgMeds: 13.1, avgLab: 39.5, avgProcs: 1.1 },
  { age: '30–40', encounters: 3800, share: 3.7, readmitRate: 9.8, avgStay: 3.8, avgMeds: 14.0, avgLab: 41.0, avgProcs: 1.2 },
  { age: '40–50', encounters: 9700, share: 9.5, readmitRate: 10.2, avgStay: 4.0, avgMeds: 15.2, avgLab: 42.6, avgProcs: 1.3 },
  { age: '50–60', encounters: 17200, share: 16.9, readmitRate: 10.7, avgStay: 4.2, avgMeds: 16.0, avgLab: 43.8, avgProcs: 1.4 },
  { age: '60–70', encounters: 22500, share: 22.1, readmitRate: 11.3, avgStay: 4.4, avgMeds: 16.8, avgLab: 44.9, avgProcs: 1.5 },
  { age: '70–80', encounters: 26100, share: 25.6, readmitRate: 12.1, avgStay: 4.7, avgMeds: 17.1, avgLab: 45.7, avgProcs: 1.5 },
  { age: '80–90', encounters: 16900, share: 16.6, readmitRate: 12.4, avgStay: 4.9, avgMeds: 16.5, avgLab: 44.1, avgProcs: 1.4 },
  { age: '90+', encounters: 2900, share: 2.9, readmitRate: 12.0, avgStay: 5.0, avgMeds: 15.4, avgLab: 41.9, avgProcs: 1.3 },
];
/** Landing scene only — illustrative proportions, not patient statistics. Clockwise from the top. */
export const donutSegments = [
  { span: 28, color: '#F4B83F', kind: 'matte', out: 0 }, { span: 55, color: '#E8A1CA', kind: 'matte', out: 0 },
  { span: 95, color: '#3F46F0', kind: 'glossy', out: 0 }, { span: 72, color: '#8BB9FF', kind: 'matte', out: 0 },
  { span: 20, color: '#B9A4F0', kind: 'frost', out: 0.9 }, { span: 25, color: '#D8D1E7', kind: 'glass', out: 1.25 },
  { span: 65, color: '#4448F5', kind: 'grain', out: 0 },
] as const;
export const statusSegments = [
  { label: 'Within 30 Days', value: 11.2, color: '#F4B83F' }, { label: 'After 30 Days', value: 35.3, color: '#B9A4F0' },
  { label: 'No Recorded Readmission', value: 53.5, color: '#4448F5' },
];
export const genderSegments = [{ label: 'Female', value: 53.8, color: '#E8A1CA' }, { label: 'Male', value: 46.2, color: '#8BB9FF' }];
export const weeklyTrend = [
  { day: 'Mon', encounters: 15200, readmit: 11.6, avgStay: 4.5 }, { day: 'Tue', encounters: 14800, readmit: 11.2, avgStay: 4.4 },
  { day: 'Wed', encounters: 14900, readmit: 11.0, avgStay: 4.4 }, { day: 'Thu', encounters: 14500, readmit: 11.3, avgStay: 4.3 },
  { day: 'Fri', encounters: 14300, readmit: 10.9, avgStay: 4.3 }, { day: 'Sat', encounters: 14000, readmit: 10.7, avgStay: 4.2 },
  { day: 'Sun', encounters: 14300, readmit: 11.4, avgStay: 4.5 },
];
const r = (name: string, value: number, n: number): RateRow => ({ name, value, n });
export const stayDist: RateRow[] = [13000, 17500, 17800, 14100, 10500, 7600, 6300, 4700, 3200, 2400, 1900, 1600, 1300, 1100].map((v, i) => ({ name: `${i + 1}d`, value: v }));
export const readmitByGender = [r('Female', 11.3, 54900), r('Male', 11.0, 47100)];
export const readmitByStay = [r('1–2 d', 8.9, 30500), r('3–4 d', 10.4, 31900), r('5–6 d', 11.9, 18100), r('7–8 d', 13.1, 11000), r('9–10 d', 14.2, 5100), r('11–14 d', 15.0, 5400)];
export const readmitByAdmission = [r('Emergency', 11.6, 54000), r('Urgent', 11.9, 18000), r('Elective', 9.8, 19000), r('Other', 10.5, 11000)];
export const readmitByInpatient = [r('0', 9.8, 67000), r('1', 13.9, 19000), r('2', 17.6, 7600), r('3–5', 22.4, 5600), r('6+', 31.0, 400)];
export const readmitByEmergency = [r('0 Visits', 10.4, 90000), r('1–2 Visits', 15.8, 9000), r('3–5 Visits', 21.5, 2200), r('6–10 Visits', 28.0, 400), r('11+ Visits', 33.0, 90)];
export const analyticsBundle = { referenceStats, ageGroupStats, genderSegments, statusSegments, weeklyTrend, stayDist, readmitByGender, readmitByStay, readmitByAdmission, readmitByInpatient, readmitByEmergency };
export type AnalyticsBundle = typeof analyticsBundle;
