// import { useState, type ReactNode } from 'react';
// import AnalyticsSidebar from '../AnalyticsSidebar/AnalyticsSidebar';
// import GlassPanel from '../GlassPanel/GlassPanel';
// import NeumorphicCard from '../NeumorphicCard/NeumorphicCard';
// import PowerBIEmbed from '../PowerBIEmbed/PowerBIEmbed';
// import type { Kpi } from '../../types';
// import './AnalyticsShell.css';
// interface Props { title: string; description: string; kpis?: Kpi[]; filter?: ReactNode; loading: boolean; error: string | null; onRetry: () => void; biPage: string; children: ReactNode }
// export default function AnalyticsShell({ title, description, kpis, filter, loading, error, onRetry, biPage, children }: Props) {
//   const [tab, setTab] = useState<'3d' | 'bi'>('3d');
//   return (
//     <div className="shell">
//       <AnalyticsSidebar />
//       <div className="shell__main">
//         <NeumorphicCard className="shell__head"><h1>{title}</h1><p>{description}</p></NeumorphicCard>
//         <div className="shell__tabs" role="tablist">
//           {([['3d', 'Interactive 3D View'], ['bi', 'Power BI Report']] as const).map(([k, l]) => <button key={k} role="tab" aria-selected={tab === k} className={tab === k ? 'is-on' : ''} onClick={() => setTab(k)}>{l}</button>)}
//         </div>
//         {tab === 'bi' ? <PowerBIEmbed pageName={biPage} /> : error ? (
//           <NeumorphicCard className="shell__err"><h3>Couldn’t load this dashboard</h3><p>{error}</p><button onClick={onRetry}>Try again</button></NeumorphicCard>
//         ) : loading ? (
//           <div className="shell__skel" aria-busy="true" aria-label="Loading dashboard"><div className="shell__skrow">{[0, 1, 2, 3].map(i => <span key={i} />)}</div><span className="shell__skbig" /><span className="shell__skbig" /></div>
//         ) : (
//           <>
//             {kpis && <div className="shell__kpis">{kpis.map(k => <GlassPanel key={k.label}><small>{k.label}</small><strong>{k.value}</strong>{k.hint && <em>{k.hint}</em>}</GlassPanel>)}</div>}
//             {filter && <div className="shell__filter">{filter}</div>}
//             {children}
//           </>
//         )}
//       </div>
//     </div>
//   );
// }






import type { ReactNode } from 'react';

import AnalyticsSidebar from '../AnalyticsSidebar/AnalyticsSidebar';
import GlassPanel from '../GlassPanel/GlassPanel';
import NeumorphicCard from '../NeumorphicCard/NeumorphicCard';

import type { Kpi } from '../../types';

import './AnalyticsShell.css';

interface Props {
  title: string;
  description: string;
  kpis?: Kpi[];
  filter?: ReactNode;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  children: ReactNode;

  // Temporary compatibility for remaining pages
  biPage?: string;
}

export default function AnalyticsShell({
  title,
  description,
  kpis,
  filter,
  loading,
  error,
  onRetry,
  children
}: Props) {
  return (
    <div className="shell">

      <AnalyticsSidebar />

      <div className="shell__main">

        <NeumorphicCard className="shell__head">
          <h1>{title}</h1>
          <p>{description}</p>
        </NeumorphicCard>

        {error ? (
          <NeumorphicCard className="shell__err">
            <h3>Couldn’t load this dashboard</h3>

            <p>{error}</p>

            <button onClick={onRetry}>
              Try again
            </button>
          </NeumorphicCard>

        ) : loading ? (

          <div
            className="shell__skel"
            aria-busy="true"
            aria-label="Loading dashboard"
          >
            <div className="shell__skrow">
              {[0, 1, 2, 3].map(i => (
                <span key={i} />
              ))}
            </div>

            <span className="shell__skbig" />
            <span className="shell__skbig" />
          </div>

        ) : (

          <>
            {kpis && (
              <div className="shell__kpis">
                {kpis.map(k => (
                  <GlassPanel key={k.label}>

                    <small>{k.label}</small>

                    <strong>{k.value}</strong>

                    {k.hint && <em>{k.hint}</em>}

                  </GlassPanel>
                ))}
              </div>
            )}

            {filter && (
              <div className="shell__filter">
                {filter}
              </div>
            )}

            {children}
          </>

        )}

      </div>
    </div>
  );
}

