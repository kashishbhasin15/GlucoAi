import PredictionForm from '../../components/PredictionForm/PredictionForm';
import { readmissionSchema } from '../../data/predictionMockData';
import './ReadmissionPrediction.css';
export default function ReadmissionPrediction() {
  return <div className="rp"><PredictionForm kind="readmission" schema={readmissionSchema} title="Hospital Readmission Prediction" intro="Estimate whether a hospital encounter may be followed by a readmission within 30 days. This is separate from diabetes risk screening." note="The final feature set will be determined by the trained model and by what information is available at the time of prediction. Follow-up considerations appear with real results." /></div>;
}
