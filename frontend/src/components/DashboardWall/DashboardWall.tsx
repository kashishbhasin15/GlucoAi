import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import ThreeDBarChart from '../ThreeDBarChart/ThreeDBarChart';
import { ageGroupStats, weeklyTrend } from '../../data/analyticsMockData';
import { toAgeBars } from '../../utils/chartData';
import './DashboardWall.css';

type Row = (typeof weeklyTrend)[number];
function Tip({ active, payload }: { active?: boolean; payload?: { payload: Row }[] }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="dw-tip">
      <strong>{d.day}</strong>
      <span>Encounters <b>{d.encounters.toLocaleString()}</b></span>
      <span>Readmission <b>{d.readmit}%</b></span>
      <span>Avg stay <b>{d.avgStay} days</b></span>
      <em>Demo data</em>
    </div>
  );
}
function Gauge({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="dw-gauge">
      <svg viewBox="0 0 100 56" aria-hidden="true">
        <path d="M10 52 A40 40 0 0 1 90 52" pathLength={100} className="dw-gauge__track" />
        <path d="M10 52 A40 40 0 0 1 90 52" pathLength={100} style={{ stroke: color, strokeDasharray: `${pct} 100`, filter: `drop-shadow(0 0 4px ${color})` }} />
      </svg>
      <strong style={{ color }}>{value}</strong><span>{label}</span>
    </div>
  );
}
export default function DashboardWall() {
  return (
    <div className="dw">
      <section className="dw-panel dw-bars"><ThreeDBarChart title="Hospital Encounters by Age Group" data={toAgeBars(ageGroupStats)} /></section>
      <section className="dw-panel dw-line">
        <h3>Encounters by Weekday <em>(demo)</em></h3>
        <div className="dw-line__chart">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyTrend} margin={{ top: 6, right: 8, left: -14, bottom: 0 }}>
              <defs><linearGradient id="dwFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F4B83F" stopOpacity={0.45} /><stop offset="1" stopColor="#F4B83F" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid stroke="rgba(255,255,255,.07)" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: '#9DB0C9', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[13000, 16000]} tickFormatter={(v: number) => `${v / 1000}k`} tick={{ fill: '#9DB0C9', fontSize: 11 }} axisLine={false} tickLine={false} width={44} />
              <Tooltip content={<Tip />} cursor={{ stroke: '#F4B83F', strokeOpacity: 0.4 }} />
              <Area type="monotone" dataKey="encounters" stroke="#F4B83F" strokeWidth={2.5} fill="url(#dwFill)" dot={{ r: 3.5, fill: '#0a0f1a', stroke: '#FFD27A', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#F4B83F' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="dw-panel dw-gauges">
        <h3>Key rates <em>(reference)</em></h3>
        <div className="dw-gauges__row">
          <Gauge label="30-day readmit" value="11.16%" pct={44.6} color="#F4B83F" />
          <Gauge label="Avg stay" value="4.40 d" pct={31} color="#8BB9FF" />
          <Gauge label="Visits / patient" value="1.42" pct={47} color="#7845E8" />
        </div>
      </section>
    </div>
  );
}
