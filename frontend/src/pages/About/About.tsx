import NeumorphicCard from '../../components/NeumorphicCard/NeumorphicCard';
import { NeuralNet, OrbitRings } from '../../components/AIVisuals/AIVisuals';
import './About.css';
const flow = ['Healthcare Data', 'Power BI Analytics', 'Predictive Models', 'Gemini AI Insights', 'React Website'];
const cards: [string, string][] = [
  ['Project objective', 'Make diabetes-related hospital data easier to explore, question and understand through interactive visualization.'],
  ['Historical dataset', 'About 102K hospital encounters from roughly 72K patients, a historical research dataset rather than live hospital activity.'],
  ['Four Power BI dashboards', 'Healthcare Overview, Patient Analytics, Hospital Analytics and Readmission Analytics, mirrored here with demo data until reports are embedded.'],
  ['Machine learning', 'Two separate tasks: a pretrained LightGBM diabetes screening model built on questionnaire data, and a future 30-day readmission model on hospital encounter data. They use different datasets and prediction goals.'],
  ['Gemini AI insights', 'A future assistant to explain dashboards and summarize aggregated patterns. Requests will go through a secure backend; no keys live in the browser.'],
  ['Technology stack', 'React, TypeScript, Vite, Three.js, React Three Fiber, GSAP, Recharts, Power BI, LightGBM and Gemini.'],
  ['Research and education', 'GLUCOAI is for learning and research. It does not diagnose, prescribe or recommend treatment.'],
  ['Limitations and next steps', 'Charts use demo values today. Next: Power BI embedding, a prediction backend, trained model integration and live Gemini responses.'],
];
const timeline = ['Foundation and cinematic landing', 'Analytics dashboards', 'Prediction interfaces', 'Gemini insights interface', 'Integration with real services'];
export default function About() {
  return (
    <div className="ab">
      <h1>About GLUCOAI</h1><p className="ab__lead">A diabetes healthcare analytics and AI intelligence platform, currently running as a frontend demo.</p>
      <div className="ab__flow" role="list">{flow.map((f, i) => <div key={f} role="listitem" className="ab__node"><span>{f}</span>{i < flow.length - 1 && <i aria-hidden="true" />}</div>)}</div>
      <div className="ab__grid">{cards.map(([t, d]) => <NeumorphicCard tilt key={t}><h3>{t}</h3><p>{d}</p></NeumorphicCard>)}</div>
      <div className="ab__vis"><NeuralNet /><OrbitRings /></div>
      <h2>Roadmap</h2>
      <ol className="ab__time">{timeline.map(t => <li key={t}><span />{t}</li>)}</ol>
    </div>
  );
}
