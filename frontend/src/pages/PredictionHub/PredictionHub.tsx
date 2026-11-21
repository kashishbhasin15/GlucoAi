// import { Link } from 'react-router-dom';
// import NeumorphicCard from '../../components/NeumorphicCard/NeumorphicCard';
// import { NeuralNet, OrbitRings } from '../../components/AIVisuals/AIVisuals';
// import './PredictionHub.css';
// export default function PredictionHub() {
//   return (
//     <div className="ph">
//       <h1>AI Prediction Hub</h1><p className="ph__lead">Two different prediction tasks, each with its own model and data. Both are frontend previews until models are connected.</p>
//       <div className="ph__grid">
//         <NeumorphicCard tilt className="ph__card"><NeuralNet /><h2>Diabetes Risk Screening</h2><p>Explore a research-based screening model that estimates diabetes risk using health and lifestyle information.</p><Link to="/prediction/diabetes" className="ph__btn">Start Diabetes Screening</Link></NeumorphicCard>
//         <NeumorphicCard tilt className="ph__card"><OrbitRings /><h2>Hospital Readmission Prediction</h2><p>Explore a future predictive model designed to estimate 30-day readmission risk using hospital encounter data.</p><Link to="/prediction/readmission" className="ph__btn">Explore Readmission Prediction</Link></NeumorphicCard>
//       </div>
//     </div>
//   );
// }



import { Link } from 'react-router-dom';
import { BedDouble } from 'lucide-react';
import NeumorphicCard from '../../components/NeumorphicCard/NeumorphicCard';
import { NeuralNet, OrbitRings } from '../../components/AIVisuals/AIVisuals';
import './PredictionHub.css';

export default function PredictionHub() {
  return (
    <div className="ph">
      <h1>AI Prediction Hub</h1>

      <p className="ph__lead">
        Explore three AI-powered healthcare prediction tools.
        Hospital Stay Prediction is connected to trained CatBoost
        models, while the other prediction tools are being integrated.
      </p>

      <div className="ph__grid">
        {/* Diabetes Risk Screening */}
        <NeumorphicCard tilt className="ph__card">
          <NeuralNet />

          <h2>Diabetes Risk Screening</h2>

          <p>
            Explore a research-based screening model that
            estimates diabetes risk using health and
            lifestyle information.
          </p>

          <Link to="/prediction/diabetes" className="ph__btn">
            Start Diabetes Screening
          </Link>
        </NeumorphicCard>

        {/* Hospital Readmission Prediction */}
        <NeumorphicCard tilt className="ph__card">
          <OrbitRings />

          <h2>Hospital Readmission Prediction</h2>

          <p>
            Explore a future predictive model designed to
            estimate 30-day readmission risk using hospital
            encounter data.
          </p>

          <Link to="/prediction/readmission" className="ph__btn">
            Explore Readmission Prediction
          </Link>
        </NeumorphicCard>

        {/* Hospital Stay Prediction */}
        <NeumorphicCard tilt className="ph__card">
          <div className="ph__stay-visual">
            <div className="ph__stay-glow" />

            <div className="ph__stay-icon">
              <BedDouble size={90} strokeWidth={1.4} />
            </div>

            <span className="ph__stay-orbit ph__stay-orbit--one" />
            <span className="ph__stay-orbit ph__stay-orbit--two" />
          </div>

          <h2>Hospital Stay Prediction</h2>

          <p>
            Estimate the length of a hospital stay for
            patients with diabetes using admission details,
            medical history, and trained CatBoost models.
          </p>

          <Link
            to="/prediction/hospital-stay"
            className="ph__btn"
          >
            Predict Hospital Stay
          </Link>
        </NeumorphicCard>
      </div>
    </div>
  );
}
