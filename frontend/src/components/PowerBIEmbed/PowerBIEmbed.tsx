import { BarChart3, Lock } from 'lucide-react';
import NeumorphicCard from '../NeumorphicCard/NeumorphicCard';
import './PowerBIEmbed.css';
export interface PowerBIEmbedProps { pageName: string; reportId?: string; embedUrl?: string; accessToken?: string }
/** Integration-ready shell. Mount powerbi-client here once a secure embed token flow exists. No data is published publicly. */
export default function PowerBIEmbed({ pageName, reportId, embedUrl, accessToken }: PowerBIEmbedProps) {
  const rows: [string, string][] = [['Report page', pageName], ['Report ID', reportId ?? 'Not configured'], ['Embed URL', embedUrl ?? 'Not configured'], ['Access', accessToken ? 'Token supplied' : 'Not configured']];
  return (
    <div className="pbi">
      <NeumorphicCard className="pbi__info">
        <BarChart3 size={34} color="#F4B83F" /><h3>Power BI report preview</h3>
        <p className="pbi__msg">Power BI integration will be enabled after configuration.</p>
        <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
        <small><Lock size={12} /> Authentication and embedding are intentionally not attempted in the frontend-only phase.</small>
      </NeumorphicCard>
      <div className="pbi__canvas" aria-hidden="true">
        {Array.from({ length: 6 }, (_, i) => <span key={i} className="pbi__sk" />)}
      </div>
    </div>
  );
}
