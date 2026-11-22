
import { useState, type FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Activity, BedDouble,
  RotateCcw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { API_BASE_URL } from '../../config';
import './HospitalStayPrediction.css';

type FormData = {
  age: string;
  gender: string;
  race: string;
  admission_type_id: string;
  admission_source_id: string;
  diag_1: string;
  number_outpatient: string;
  number_emergency: string;
  number_inpatient: string;
};

type Result = {
  predicted_days: number;
  predicted_category: string;
  disclaimer?: string;
};

const initial: FormData = {
  age: '',
  gender: '',
  race: '',
  admission_type_id: '',
  admission_source_id: '',
  diag_1: '',
  number_outpatient: '0',
  number_emergency: '0',
  number_inpatient: '0',
};

const steps = [
  'Personal information',
  'Admission details',
  'Medical history',
  'Review',
  'Result',
];

const ageOptions = [
  '[0-10)', '[10-20)', '[20-30)', '[30-40)',
  '[40-50)', '[50-60)', '[60-70)', '[70-80)',
  '[80-90)', '[90-100)',
];

const admissionTypes = [
  ['1', 'Emergency admission'],
  ['2', 'Urgent admission'],
  ['3', 'Planned admission'],
  ['4', 'Newborn admission'],
  ['5', 'Information unavailable'],
  ['6', 'Not recorded'],
  ['7', 'Trauma center admission'],
  ['8', 'Not mapped'],
];

const admissionSources = [
  ['1', 'My doctor referred me'],
  ['2', 'A clinic referred me'],
  ['3', 'My health organization referred me'],
  ['4', 'I was transferred from another hospital'],
  ['5', 'I was transferred from a nursing facility'],
  ['6', 'I was transferred from another healthcare facility'],
  ['7', 'I went through the emergency department'],
  ['9', 'Information unavailable'],
];

export default function HospitalStayPrediction() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(initial);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const update = (key: keyof FormData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
    setError('');
    setResult(null);
  };

  const field = (
    key: keyof FormData,
    label: string,
    options: string[][],
    helper?: string
  ) => (
    <div className="hsp-field">
      <label htmlFor={key}>{label}</label>
      <select
        id={key}
        required
        value={form[key]}
        onChange={e => update(key, e.target.value)}
      >
        <option value="">Select...</option>
        {options.map(([value, text]) => (
          <option key={value} value={value}>{text}</option>
        ))}
      </select>
      {helper && <small>{helper}</small>}
    </div>
  );

  const numberField = (
    key: keyof FormData,
    label: string
  ) => (
    <div className="hsp-field">
      <label htmlFor={key}>{label}</label>
      <input
        id={key}
        type="number"
        min="0"
        max="1000"
        step="1"
        required
        value={form[key]}
        onChange={e => update(key, e.target.value)}
      />
    </div>
  );

  const validStep = () => {
    if (step === 0) {
      return Boolean(form.age && form.gender && form.race);
    }

    if (step === 1) {
      return Boolean(
        form.admission_type_id &&
        form.admission_source_id &&
        form.diag_1.trim()
      );
    }

    if (step === 2) {
      return (
        ['number_outpatient', 'number_emergency', 'number_inpatient']
          .every(key => {
            const value = form[key as keyof FormData];
            return value.trim() !== '' &&
              Number.isInteger(Number(value)) &&
              Number(value) >= 0 &&
              Number(value) <= 1000;
          })
      );
    }

    return true;
  };

  const next = () => {
    if (!validStep()) {
      setError('Please complete all fields correctly before continuing.');
      return;
    }
    setError('');
    setStep(prev => Math.min(prev + 1, 3));
  };

  const back = () => {
    setError('');
    setStep(prev => Math.max(prev - 1, 0));
  };

  const predict = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (step !== 3 || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/predict/length-of-stay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          diag_1: form.diag_1.trim(),
          admission_type_id: Number(form.admission_type_id),
          admission_source_id: Number(form.admission_source_id),
          number_outpatient: Number(form.number_outpatient),
          number_emergency: Number(form.number_emergency),
          number_inpatient: Number(form.number_inpatient),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed.');
      }

      if (
        !Number.isFinite(Number(data.predicted_days)) ||
        typeof data.predicted_category !== 'string'
      ) {
        throw new Error('Invalid prediction response.');
      }

      setResult(data);
      setStep(4);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to the prediction service.'
      );
    } finally {
      setLoading(false);
    }
  };

  const restart = () => {
    setForm({ ...initial });
    setResult(null);
    setError('');
    setStep(0);
  };

  const getLabel = (options: string[][], value: string) =>
    options.find(item => item[0] === value)?.[1] || value;

  return (
    <main className="hsp-wizard">
      <div className="hsp-container">
        <motion.header
          className="hsp-hero"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="hsp-eyebrow">
            <Activity size={17} />
            GLUCOAI · PATIENT PREDICTION
          </span>

          <h1>Hospital Stay Prediction</h1>
          <p>
            For patients with diabetes. Complete the questionnaire
            to estimate your hospital stay using our experimental
            machine learning model.
          </p>
        </motion.header>

        <nav className="hsp-steps" aria-label="Prediction progress">
          {steps.map((label, index) => (
            <div
              key={label}
              className={`hsp-step ${step === index ? 'active' : ''} ${
                index < step ? 'completed' : ''
              }`}
              aria-current={step === index ? 'step' : undefined}
            >
              <span className="hsp-step-number">
                {index < step ? <CheckCircle2 size={15} /> : index + 1}
              </span>
              <span>{label}</span>
            </div>
          ))}
        </nav>

        <form onSubmit={predict} noValidate>
          <AnimatePresence mode="wait">
            <motion.section
              key={step}
              className="hsp-panel"
              initial={{ opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -22 }}
              transition={{ duration: 0.22 }}
            >
              {step === 0 && (
                <>
                  <h2>Personal information</h2>
                  <p className="hsp-subtitle">
                    Basic information from your hospital record.
                  </p>

                  <div className="hsp-grid">
                    {field(
                      'age',
                      'What is your age group?',
                      ageOptions.map(a => [a, a.replace(/[\[\)]/g, '').replace('-', '–') + ' years'])
                    )}

                    {field('gender', 'Gender recorded in your medical record', [
                      ['Male', 'Male'],
                      ['Female', 'Female'],
                      ['Unknown/Invalid', 'Unknown / not recorded'],
                    ])}

                    {field('race', 'Race recorded in your medical record', [
                      ['Caucasian', 'Caucasian'],
                      ['AfricanAmerican', 'African American'],
                      ['Asian', 'Asian'],
                      ['Hispanic', 'Hispanic'],
                      ['Other', 'Other'],
                      ['?', 'Unknown / not recorded'],
                    ])}
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  <h2>Hospital admission details</h2>
                  <p className="hsp-subtitle">
                    Use your admission paperwork or information
                    provided by your hospital.
                  </p>

                  <div className="hsp-grid">
                    {field(
                      'admission_type_id',
                      'What type of hospital admission do you have?',
                      admissionTypes
                    )}

                    {field(
                      'admission_source_id',
                      'How did you come to this hospital?',
                      admissionSources
                    )}

                    <div className="hsp-field hsp-field-wide">
                      <label htmlFor="diag_1">
                        Primary diagnosis code
                      </label>
                      <input
                        id="diag_1"
                        value={form.diag_1}
                        onChange={e => update('diag_1', e.target.value)}
                        placeholder="Example: 250.83"
                        required
                      />
                      <small>
                        Find this in your medical records or ask your
                        healthcare provider. Enter the recorded code;
                        do not guess. This model uses diagnosis codes
                        from its historical training dataset.
                      </small>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <h2>Medical history</h2>
                  <p className="hsp-subtitle">
                    Enter your previous healthcare visit counts
                    from your medical history.
                  </p>

                  <div className="hsp-grid">
                    {numberField(
                      'number_outpatient',
                      'Previous outpatient visits'
                    )}

                    {numberField(
                      'number_emergency',
                      'Previous emergency visits'
                    )}

                    {numberField(
                      'number_inpatient',
                      'Previous hospital admissions'
                    )}
                  </div>

                  <div className="hsp-info">
                    <AlertCircle size={18} />
                    <span>
                      These are previous visit counts, not the
                      number of days you stayed in hospital.
                      Use recorded counts where available.
                    </span>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <h2>Review your information</h2>
                  <p className="hsp-subtitle">
                    Check your answers before generating your estimate.
                  </p>

                  <div className="hsp-review">
                    {[
                      ['Age group', form.age],
                      ['Gender', form.gender],
                      ['Race', form.race],
                      ['Admission type', getLabel(admissionTypes, form.admission_type_id)],
                      ['Admission source', getLabel(admissionSources, form.admission_source_id)],
                      ['Diagnosis code', form.diag_1],
                      ['Outpatient visits', form.number_outpatient],
                      ['Emergency visits', form.number_emergency],
                      ['Previous admissions', form.number_inpatient],
                    ].map(([label, value]) => (
                      <div className="hsp-review-row" key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </div>
                    ))}
                  </div>

                  <div className="hsp-info">
                    <AlertCircle size={18} />
                    <span>
                      This experimental model is based on historical
                      hospital encounters involving patients with diabetes.
                      It is not clinically validated and cannot replace
                      medical advice or discharge planning.
                    </span>
                  </div>
                </>
              )}

              {step === 4 && result && (
                <div className="hsp-result-screen">
                  <div className="hsp-result-icon">
                    <BedDouble size={32} />
                  </div>

                  <h2>Your Hospital Stay Estimate</h2>
                  <p className="hsp-subtitle">
                    Your model-generated prediction is ready.
                  </p>

                  <div className="hsp-result-grid">
                    <div className="hsp-result-metric">
                      <span>Estimated length of stay</span>
                      <strong>{result.predicted_days}</strong>
                      <span>Days</span>
                    </div>

                    <div className="hsp-result-metric">
                      <span>Predicted category</span>
                      <strong className="hsp-result-category">
                        {result.predicted_category}
                      </strong>
                      <span>Hospital stay category</span>
                    </div>
                  </div>

                  <p className="hsp-result-disclaimer">
                    {result.disclaimer || (
                      'This is an experimental prediction, not a clinical estimate.'
                    )}
                    {' '}Actual hospital stays can differ substantially.
                    Your treating team determines your care and discharge plan.
                  </p>
                </div>
              )}
            </motion.section>
          </AnimatePresence>

          {error && (
            <div className="hsp-error" role="alert">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <div className="hsp-actions">
            {step === 4 ? (
              <button
                type="button"
                className="hsp-btn hsp-btn-primary"
                onClick={restart}
              >
                <RotateCcw size={17} />
                Start New Prediction
              </button>
            ) : (
              <>
                {step > 0 ? (
                  <button
                    type="button"
                    className="hsp-btn hsp-btn-secondary"
                    onClick={back}
                    disabled={loading}
                  >
                    <ArrowLeft size={17} />
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    className="hsp-btn hsp-btn-primary"
                    onClick={next}
                  >
                    Next
                    <ArrowRight size={17} />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="hsp-btn hsp-btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Predicting...' : 'Generate Prediction'}
                    {!loading && <Activity size={17} />}
                  </button>
                )}
              </>
            )}
          </div>
        </form>
      </div>
    </main>
  );
}
