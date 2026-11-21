import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { RateRow } from '../../types';
import './MetricBarChart.css';
interface Props { data: RateRow[]; label: string; unit?: string; color?: string; height?: number; domain?: [number, number | 'auto']; showCounts?: boolean }
function Tip({ active, payload, unit, label }: { active?: boolean; payload?: { payload: RateRow }[]; unit: string; label: string }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="mb-tip"><strong>{d.name}</strong><span>{label}<b>{d.value.toLocaleString()}{unit}</b></span>
      {d.n !== undefined && <span>Encounters<b>{d.n.toLocaleString()}</b></span>}
      {d.n !== undefined && d.n < 500 && <em>Small sample — interpret with caution</em>}<em>Demo data</em></div>
  );
}
export default function MetricBarChart({ data, label, unit = '', color = '#8BB9FF', height = 230, domain, showCounts }: Props) {
  const [hot, setHot] = useState<number | null>(null);
  const id = `mb-${color.slice(1)}`;
  if (!data.length) return <div className="mb-empty" style={{ height }}>No data for this filter. Choose a different selection.</div>;
  return (
    <div role="img" aria-label={label}>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }} onMouseLeave={() => setHot(null)}>
            <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={color} /><stop offset="1" stopColor="#7845E8" /></linearGradient></defs>
            <CartesianGrid stroke="rgba(216,209,231,.1)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#D8D1E7', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={domain} tick={{ fill: '#B3A9D1', fontSize: 11 }} axisLine={false} tickLine={false} width={44} tickFormatter={(v: number) => (v >= 1000 ? `${v / 1000}k` : `${v}`)} />
            <Tooltip content={<Tip unit={unit} label={label} />} cursor={{ fill: 'rgba(255,255,255,.05)' }} />
            <Bar dataKey="value" radius={[8, 8, 0, 0]} onMouseEnter={(_, i) => setHot(i)} isAnimationActive>
              {data.map((_, i) => <Cell key={i} fill={`url(#${id})`} fillOpacity={hot === null || hot === i ? 1 : 0.35} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {showCounts && <p className="mb-counts">Encounters: {data.map(d => `${d.name} → ${(d.n ?? 0).toLocaleString()}`).join(' · ')}</p>}
    </div>
  );
}
