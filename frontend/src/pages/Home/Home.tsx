// import { useEffect, useRef, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { BarChart3, Brain, Code2, HeartPulse, Sparkles } from 'lucide-react';
// import DonutScene, { type Progress } from '../../components/DonutScene/DonutScene';
// import DashboardWall from '../../components/DashboardWall/DashboardWall';
// import NeumorphicCard from '../../components/NeumorphicCard/NeumorphicCard';
// import { AIOrb, NeuralNet, OrbitRings } from '../../components/AIVisuals/AIVisuals';
// import { referenceStats } from '../../data/analyticsMockData';
// import './Home.css';
// gsap.registerPlugin(ScrollTrigger);

// const explore = [['Healthcare Overview', '/analytics/overview', 'bars'], ['Patient Analytics', '/analytics/patients', 'line'], ['Hospital Analytics', '/analytics/hospital', 'area'], ['Readmission Analytics', '/analytics/readmission', 'ring']] as const;
// const tech = [[BarChart3, 'Power BI', 'Four report pages for guided exploration.'], [Brain, 'Machine Learning', 'Screening and readmission models.'], [Sparkles, 'Gemini AI', 'Plain-language explanations of findings.'], [Code2, 'React', 'A fast, interactive 3D front end.'], [HeartPulse, 'Healthcare Data Analytics', 'Encounter-level patterns made visible.']] as const;

// function Mini({ kind }: { kind: string }) {
//   return (
//     <svg viewBox="0 0 100 50" className="mini" aria-hidden="true">
//       {kind === 'bars' && [14, 28, 20, 38, 30].map((h, i) => <rect key={i} x={8 + i * 18} y={46 - h} width="12" height={h} rx="3" className="mini__bar" style={{ animationDelay: `${i * 0.2}s` }} />)}
//       {kind === 'line' && <polyline points="4,40 24,26 44,32 64,14 96,20" className="mini__line" />}
//       {kind === 'area' && <><path d="M4 44 L24 28 L48 34 L72 16 L96 24 L96 46 L4 46Z" className="mini__area" /><polyline points="4,44 24,28 48,34 72,16 96,24" className="mini__line" /></>}
//       {kind === 'ring' && <circle cx="50" cy="25" r="18" className="mini__ring" />}
//     </svg>
//   );
// }
// export default function Home() {
//   const wrap = useRef<HTMLDivElement>(null);
//   const progress = useRef<Progress>({ v: 0 }).current;
//   const [donutOn, setDonutOn] = useState(true);
//   useEffect(() => {
//     if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
//       progress.v = 1; setDonutOn(false); if (wrap.current) wrap.current.style.height = '100vh';
//       gsap.set(['.home-hero__left', '.home-hero__right'], { autoAlpha: 1 }); gsap.set(['.home-intro', '.home-donut-layer'], { autoAlpha: 0 }); return;
//     }
//     const ctx = gsap.context(() => {
//       const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: wrap.current, start: 'top top', end: 'bottom bottom', scrub: 1, onUpdate: self => setDonutOn(self.progress < 0.8) } });
//       tl.to('.home-intro', { autoAlpha: 0, y: -40, duration: 0.8 }, 0)
//         .to(progress, { v: 1, duration: 2.6 }, 0)
//         .to('.home-grid', { autoAlpha: 1, duration: 1 }, 1.4)
//         .to('.home-donut-layer', { autoAlpha: 0, duration: 0.9 }, 2.3)
//         .fromTo('.home-hero__left', { autoAlpha: 0, x: -140 }, { autoAlpha: 1, x: 0, duration: 1 }, 2.6)
//         .fromTo('.home-hero__right', { autoAlpha: 0, x: 140 }, { autoAlpha: 1, x: 0, duration: 1 }, 2.6)
//         .to({}, { duration: 0.6 });
//     }, wrap);
//     return () => ctx.revert();
//   }, [progress]);
//   return (
//     <div className="home">
//       <div className="home-scroll" ref={wrap}>
//         <div className="home-stage">
//           <div className="home-grid" />
//           <div className="home-donut-layer">{donutOn && <DonutScene progress={progress} />}</div>
//           <div className="home-intro"><h1>GLUCOAI</h1><p>Visualizing Diabetes. Empowering Healthcare.</p><span className="home-intro__scroll">Scroll to Explore</span></div>
//           <section className="home-hero">
//             <NeumorphicCard className="home-hero__left">
//               <span className="home-eyebrow">AI-POWERED DIABETES INTELLIGENCE</span>
//               <h2>Turning Diabetes Data Into Smarter Healthcare Decisions.</h2>
//               <p>Explore hospital encounters, understand readmission trends, discover patient patterns, and experience intelligent healthcare analytics through interactive visualization.</p>
//               <div className="home-hero__btns"><Link to="/analytics/overview" className="home-btn home-btn--primary">Explore Analytics</Link><Link to="/prediction" className="home-btn">AI Predictions</Link></div>
//               <svg className="home-ecg" viewBox="0 0 300 40" aria-hidden="true"><polyline points="0,20 60,20 75,20 85,4 95,36 105,20 160,20 175,20 185,8 195,32 205,20 300,20" /></svg>
//             </NeumorphicCard>
//             <div className="home-hero__right"><DashboardWall /></div>
//           </section>
//         </div>
//       </div>

//       <section className="home-sec" aria-labelledby="stats-h">
//         <h2 id="stats-h">Healthcare statistics</h2><p className="home-note">Historical reference values from an existing research project — not live hospital activity.</p>
//         <div className="home-cols">{referenceStats.map(s => <NeumorphicCard tilt key={s.label} className="home-stat"><strong>{s.value}</strong><span>{s.label}</span></NeumorphicCard>)}</div>
//       </section>
//       <section className="home-sec" aria-labelledby="exp-h">
//         <h2 id="exp-h">Explore analytics</h2>
//         <div className="home-cols">{explore.map(([t, to, k]) => <Link key={to} to={to}><NeumorphicCard tilt className="home-explore"><Mini kind={k} /><h3>{t}</h3><span>Open dashboard</span></NeumorphicCard></Link>)}</div>
//       </section>
//       <section className="home-sec" aria-labelledby="ai-h">
//         <h2 id="ai-h">AI intelligence</h2>
//         <div className="home-cols home-cols--2">
//           <NeumorphicCard tilt className="home-ai"><NeuralNet /><h3>Diabetes Risk Screening</h3><p>A research-based screening model, previewed with a guided questionnaire.</p><Link to="/prediction/diabetes" className="home-btn">Explore</Link></NeumorphicCard>
//           <NeumorphicCard tilt className="home-ai"><OrbitRings /><h3>Hospital Readmission Prediction</h3><p>A future model for estimating 30-day readmission risk from encounter data.</p><Link to="/prediction/readmission" className="home-btn">Explore</Link></NeumorphicCard>
//           <NeumorphicCard tilt className="home-ai"><OrbitRings />
//           <h2>Hospital Stay Prediction</h2><p>Estimate the length of a hospital stay for patients with diabetes using admission details.</p><Link to="/prediction/hospital-stay" className="home-btn">Explore</Link></NeumorphicCard>
//         </div>
//       </section>
//       <section className="home-sec" aria-labelledby="tech-h">
//         <h2 id="tech-h">Technology</h2>
//         <div className="home-cols home-cols--5">{tech.map(([Icon, t, d], i) => <NeumorphicCard tilt key={t} className="home-tech" style={{ animationDelay: `${i * 0.4}s` }}><Icon size={26} color="#F4B83F" /><h3>{t}</h3><p>{d}</p></NeumorphicCard>)}</div>
//       </section>
//     </div>
//   );
// }



import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BarChart3,
  Brain,
  Code2,
  HeartPulse,
  Sparkles,
  BedDouble,
} from 'lucide-react';

import DonutScene, { type Progress } from '../../components/DonutScene/DonutScene';
import DashboardWall from '../../components/DashboardWall/DashboardWall';
import NeumorphicCard from '../../components/NeumorphicCard/NeumorphicCard';
import { NeuralNet, OrbitRings } from '../../components/AIVisuals/AIVisuals';
import { referenceStats } from '../../data/analyticsMockData';

import './Home.css';

gsap.registerPlugin(ScrollTrigger);

const explore = [
  ['Healthcare Overview', '/analytics/overview', 'bars'],
  ['Patient Analytics', '/analytics/patients', 'line'],
  ['Hospital Analytics', '/analytics/hospital', 'area'],
  ['Readmission Analytics', '/analytics/readmission', 'ring'],
] as const;

const tech = [
  [BarChart3, 'Power BI', 'Four report pages for guided exploration.'],
  [Brain, 'Machine Learning', 'Screening and readmission models.'],
  [Sparkles, 'Gemini AI', 'Plain-language explanations of findings.'],
  [Code2, 'React', 'A fast, interactive 3D front end.'],
  [HeartPulse, 'Healthcare Data Analytics', 'Encounter-level patterns made visible.'],
] as const;

function Mini({ kind }: { kind: string }) {
  return (
    <svg viewBox="0 0 100 50" className="mini" aria-hidden="true">
      {kind === 'bars' &&
        [14, 28, 20, 38, 30].map((h, i) => (
          <rect
            key={i}
            x={8 + i * 18}
            y={46 - h}
            width="12"
            height={h}
            rx="3"
            className="mini__bar"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}

      {kind === 'line' && (
        <polyline
          points="4,40 24,26 44,32 64,14 96,20"
          className="mini__line"
        />
      )}

      {kind === 'area' && (
        <>
          <path
            d="M4 44 L24 28 L48 34 L72 16 L96 24 L96 46 L4 46Z"
            className="mini__area"
          />
          <polyline
            points="4,44 24,28 48,34 72,16 96,24"
            className="mini__line"
          />
        </>
      )}

      {kind === 'ring' && (
        <circle cx="50" cy="25" r="18" className="mini__ring" />
      )}
    </svg>
  );
}

export default function Home() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useRef<Progress>({ v: 0 }).current;
  const [donutOn, setDonutOn] = useState(true);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      progress.v = 1;
      setDonutOn(false);

      if (wrap.current) wrap.current.style.height = '100vh';

      gsap.set(['.home-hero__left', '.home-hero__right'], {
        autoAlpha: 1,
      });

      gsap.set(['.home-intro', '.home-donut-layer'], {
        autoAlpha: 0,
      });

      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: self => setDonutOn(self.progress < 0.8),
        },
      });

      timeline
        .to('.home-intro', { autoAlpha: 0, y: -40, duration: 0.8 }, 0)
        .to(progress, { v: 1, duration: 2.6 }, 0)
        .to('.home-grid', { autoAlpha: 1, duration: 1 }, 1.4)
        .to('.home-donut-layer', { autoAlpha: 0, duration: 0.9 }, 2.3)
        .fromTo(
          '.home-hero__left',
          { autoAlpha: 0, x: -140 },
          { autoAlpha: 1, x: 0, duration: 1 },
          2.6
        )
        .fromTo(
          '.home-hero__right',
          { autoAlpha: 0, x: 140 },
          { autoAlpha: 1, x: 0, duration: 1 },
          2.6
        )
        .to({}, { duration: 0.6 });
    }, wrap);

    return () => ctx.revert();
  }, [progress]);

  return (
    <div className="home">
      <div className="home-scroll" ref={wrap}>
        <div className="home-stage">
          <div className="home-grid" />

          <div className="home-donut-layer">
            {donutOn && <DonutScene progress={progress} />}
          </div>

          <div className="home-intro">
            <h1>GLUCOAI</h1>
            <p>Visualizing Diabetes. Empowering Healthcare.</p>
            <span className="home-intro__scroll">Scroll to Explore</span>
          </div>

          <section className="home-hero">
            <NeumorphicCard className="home-hero__left">
              <span className="home-eyebrow">
                AI-POWERED DIABETES INTELLIGENCE
              </span>

              <h2>
                Turning Diabetes Data Into Smarter Healthcare Decisions.
              </h2>

              <p>
                Explore hospital encounters, understand readmission trends,
                discover patient patterns, and experience intelligent
                healthcare analytics through interactive visualization.
              </p>

              <div className="home-hero__btns">
                <Link to="/analytics/overview" className="home-btn home-btn--primary">
                  Explore Analytics
                </Link>
                <Link to="/prediction" className="home-btn">
                  AI Predictions
                </Link>
              </div>

              <svg className="home-ecg" viewBox="0 0 300 40" aria-hidden="true">
                <polyline points="0,20 60,20 75,20 85,4 95,36 105,20 160,20 175,20 185,8 195,32 205,20 300,20" />
              </svg>
            </NeumorphicCard>

            <div className="home-hero__right">
              <DashboardWall />
            </div>
          </section>
        </div>
      </div>

      <section className="home-sec" aria-labelledby="stats-h">
        <h2 id="stats-h">Healthcare statistics</h2>
        <p className="home-note">
          Historical reference values from an existing research project —
          not live hospital activity.
        </p>

        <div className="home-cols">
          {referenceStats.map(stat => (
            <NeumorphicCard tilt key={stat.label} className="home-stat">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </NeumorphicCard>
          ))}
        </div>
      </section>

      <section className="home-sec" aria-labelledby="exp-h">
        <h2 id="exp-h">Explore analytics</h2>

        <div className="home-cols">
          {explore.map(([title, path, kind]) => (
            <Link key={path} to={path}>
              <NeumorphicCard tilt className="home-explore">
                <Mini kind={kind} />
                <h3>{title}</h3>
                <span>Open dashboard</span>
              </NeumorphicCard>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-sec" aria-labelledby="ai-h">
        <h2 id="ai-h">AI intelligence</h2>

        <div className="home-cols home-cols--3">
          <NeumorphicCard tilt className="home-ai">
            <NeuralNet />
            <h3>Diabetes Risk Screening</h3>
            <p>
              A research-based screening model, previewed with a guided questionnaire.
            </p>
            <Link to="/prediction/diabetes" className="home-btn">
              Explore
            </Link>
          </NeumorphicCard>

          <NeumorphicCard tilt className="home-ai">
            <OrbitRings />
            <h3>Hospital Readmission Prediction</h3>
            <p>
              A future model for estimating 30-day readmission risk from encounter data.
            </p>
            <Link to="/prediction/readmission" className="home-btn">
              Explore
            </Link>
          </NeumorphicCard>

          <NeumorphicCard tilt className="home-ai">
            <div className="home-ai__icon">
              <BedDouble size={64} strokeWidth={1.5} />
            </div>

            <h3>Hospital Stay Prediction</h3>
            <p>
              Estimate the length of a hospital stay for patients with diabetes
              using admission details.
            </p>
            <Link to="/prediction/hospital-stay" className="home-btn">
              Explore
            </Link>
          </NeumorphicCard>
        </div>
      </section>

      <section className="home-sec" aria-labelledby="tech-h">
        <h2 id="tech-h">Technology</h2>

        <div className="home-cols home-cols--5">
          {tech.map(([Icon, title, description], index) => (
            <NeumorphicCard
              tilt
              key={title}
              className="home-tech"
              style={{ animationDelay: `${index * 0.4}s` }}
            >
              <Icon size={26} color="#F4B83F" />
              <h3>{title}</h3>
              <p>{description}</p>
            </NeumorphicCard>
          ))}
        </div>
      </section>
    </div>
  );
}
