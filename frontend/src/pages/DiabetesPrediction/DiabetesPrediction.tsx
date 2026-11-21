// import PredictionForm from '../../components/PredictionForm/PredictionForm';
// import { diabetesSchema } from '../../data/predictionMockData';
// import './DiabetesPrediction.css';
// export default function DiabetesPrediction() {
//   return <div className="dp"><PredictionForm kind="diabetes" schema={diabetesSchema} title="Diabetes Risk Screening" intro="Answer a short health and lifestyle questionnaire. A pretrained screening model will estimate diabetes risk once it is connected." note="Frontend demo: the 21 questionnaire fields are configurable and must be matched to the model’s exact features and encodings before integration." /></div>;
// }



import PredictionForm from '../../components/PredictionForm/PredictionForm';
import { diabetesSchema } from '../../data/predictionMockData';
import './DiabetesPrediction.css';

export default function DiabetesPrediction() {
  return (
    <div className="dp">
      <PredictionForm
        kind="diabetes"
        schema={diabetesSchema}
        title="Diabetes Risk Screening"
        intro="Answer a short health and lifestyle questionnaire to receive a research-based diabetes risk screening estimate."
        note="Powered by a trained LightGBM model using 21 health and lifestyle features. This screening is not a medical diagnosis."
      />
    </div>
  );
}
