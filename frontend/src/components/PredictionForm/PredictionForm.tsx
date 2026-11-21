
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  Activity,
  Sparkles,
  ClipboardList,
  HeartPulse,
  Stethoscope,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

import NeumorphicCard from '../NeumorphicCard/NeumorphicCard';
import GlassPanel from '../GlassPanel/GlassPanel';

import {
  ModelNotConnectedError,
  predict,
  type DiabetesPredictionResult,
  type ReadmissionPredictionResult,
} from '../../services/predictionService';

import type { FormField, FormSection } from '../../types';
import './PredictionForm.css';

interface Props {
  kind: 'diabetes' | 'readmission';
  schema: FormSection[];
  title: string;
  intro: string;
  note?: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

type Result =
  | DiabetesPredictionResult
  | ReadmissionPredictionResult;

export default function PredictionForm({
  kind,
  schema,
  title,
  intro,
  note,
}: Props) {
  const totalSteps = schema.length;
  const isDiabetes = kind === 'diabetes';

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fields = schema.flatMap(section => section.fields);
  const currentSection = schema[step];

  const showValue = (field: FormField, value: string) =>
    field.options?.find(option => option.value === value)?.label ?? value;

  // ------------------------------------------
  // VALIDATION
  // ------------------------------------------

  const validate = (section: FormSection) => {
    const nextErrors: Record<string, string> = {};

    section.fields.forEach(field => {
      const value = values[field.key];

      if (field.required && (value === undefined || value === '')) {
        nextErrors[field.key] = 'This answer is required.';
      } else if (
        field.type === 'number' &&
        value !== undefined &&
        value !== '' &&
        (
          !Number.isFinite(Number(value)) ||
          Number(value) < (field.min ?? -Infinity) ||
          Number(value) > (field.max ?? Infinity)
        )
      ) {
        nextErrors[field.key] = 'Please enter a valid value.';
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const next = () => {
    if (currentSection && validate(currentSection)) {
      setStep(step + 1);
    }
  };

  // ------------------------------------------
  // PREDICTION
  // ------------------------------------------

  const runPrediction = async () => {
    setStep(totalSteps + 1);
    setStatus('loading');
    setResult(null);
    setErrorMessage('');

    try {
      const response = await predict(kind, values);
      sessionStorage.setItem(
        'glucoai_latest_prediction',
        JSON.stringify({
        type: kind,
        result: response,
        }));
      setResult(response);
      setStatus('success');
    } catch (error) {
      setStatus('error');

      if (error instanceof ModelNotConnectedError) {
        setErrorMessage(error.message);
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Unable to generate the result. Please try again.');
      }
    }
  };

  // ------------------------------------------
  // RESET
  // ------------------------------------------

  const reset = () => {
    setStep(0);
    setValues({});
    setErrors({});
    setStatus('idle');
    setResult(null);
    setErrorMessage('');
  };

  // ------------------------------------------
  // RESULT TYPE CHECKS
  // ------------------------------------------

  const diabetesResult =
    result && 'risk_percent' in result ? result : null;

  const readmissionResult =
    result && 'predicted_readmission' in result ? result : null;

  const riskPercent = Math.min(
    100,
    Math.max(0, Number(diabetesResult?.risk_percent ?? 0))
  );

  const riskColor =
    diabetesResult?.risk_level === 'HIGHER'
      ? '#e77b91'
      : diabetesResult?.risk_level === 'MODERATE'
        ? '#e9b86c'
        : '#65cba0';

  const circumference = 2 * Math.PI * 52;

  // ------------------------------------------
  // REUSABLE LIST SECTION
  // ------------------------------------------

  const renderListSection = (
    heading: string,
    items: string[],
    Icon: typeof Activity
  ) => (
    <section className="pf__readmission-section">
      <div className="pf__readmission-section-title">
        <span><Icon size={19} /></span>
        <h3>{heading}</h3>
      </div>

      <ul>
        {items.map((item, index) => (
          <li key={`${heading}-${index}`}>{item}</li>
        ))}
      </ul>
    </section>
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="pf">

      {/* INTRODUCTION */}

      <NeumorphicCard className="pf__intro">
        <h1>{title}</h1>
        <p>{intro}</p>
        {note && <small>{note}</small>}
      </NeumorphicCard>

      {/* PROGRESS */}

      <ol className="pf__steps" aria-label="Progress">
        {[
          ...schema.map(section => section.title),
          'Review',
          'Result',
        ].map((item, index) => (
          <li
            key={item}
            className={
              index === step
                ? 'is-now'
                : index < step
                  ? 'is-done'
                  : ''
            }
          >
            <span>
              {index < step ? <Check size={14} /> : index + 1}
            </span>
            <em>{item}</em>
          </li>
        ))}
      </ol>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
        >

          {/* QUESTIONNAIRE */}

          {currentSection ? (
            <NeumorphicCard className="pf__card">
              <h2>{currentSection.title}</h2>
              <p className="pf__blurb">
                {currentSection.blurb}
              </p>

              <div className="pf__fields">
                {currentSection.fields.map(field => (
                  <div key={field.key} className="pf__field">
                    <label htmlFor={field.key}>
                      {field.label}
                    </label>

                    {field.type === 'boolean' ? (
                      <div className="pf__seg" role="group">
                        {field.options!.map(option => (
                          <button
                            key={option.value}
                            type="button"
                            aria-pressed={
                              values[field.key] === option.value
                            }
                            onClick={() =>
                              setValues(previous => ({
                                ...previous,
                                [field.key]: option.value,
                              }))
                            }
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    ) : field.type === 'select' ? (
                      <select
                        id={field.key}
                        value={values[field.key] ?? ''}
                        onChange={event =>
                          setValues(previous => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                      >
                        <option value="">Select...</option>

                        {field.options!.map(option => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.key}
                        type="number"
                        inputMode="decimal"
                        min={field.min}
                        max={field.max}
                        value={values[field.key] ?? ''}
                        onChange={event =>
                          setValues(previous => ({
                            ...previous,
                            [field.key]: event.target.value,
                          }))
                        }
                      />
                    )}

                    {field.help && !errors[field.key] && (
                      <small>{field.help}</small>
                    )}

                    {errors[field.key] && (
                      <small className="pf__err" role="alert">
                        {errors[field.key]}
                      </small>
                    )}
                  </div>
                ))}
              </div>
            </NeumorphicCard>

          ) : step === totalSteps ? (

            /* REVIEW */

            <NeumorphicCard className="pf__card">
              <h2>Review your answers</h2>
              <p className="pf__blurb">
                Check your information before generating the result.
              </p>

              <dl className="pf__review">
                {fields.map(field => (
                  <div key={field.key}>
                    <dt>{field.label}</dt>
                    <dd>
                      {showValue(field, values[field.key] ?? '—')}
                    </dd>
                  </div>
                ))}
              </dl>
            </NeumorphicCard>

          ) : (

            /* RESULTS */

            <div className="pf__result">
              <GlassPanel
                title={
                  isDiabetes
                    ? 'Diabetes Risk Screening Result'
                    : 'Hospital Readmission Assessment'
                }
                badge={
                  status === 'loading'
                    ? 'PROCESSING'
                    : status === 'success'
                      ? isDiabetes
                        ? 'LIGHTGBM RESULT'
                        : 'AI ASSESSMENT'
                      : 'RESULT UNAVAILABLE'
                }
              >

                {/* LOADING */}

                {status === 'loading' && (
                  <div className="pf__load">
                    <Activity size={28} />
                    <p>
                      {isDiabetes
                        ? 'Analyzing your health information...'
                        : 'Preparing your readmission assessment...'}
                    </p>
                    <small>
                      {isDiabetes
                        ? 'Calculating your screening result and preparing health insights.'
                        : 'Reviewing your submitted patient and admission information.'}
                    </small>
                  </div>
                )}

                {/* SUCCESS */}

                {status === 'success' && (
                  <>
                    {/* DIABETES RESULT */}

                    {isDiabetes && diabetesResult && (
                      <>
                        <div className="pf__resgrid">
                          <svg
                            viewBox="0 0 120 120"
                            className="pf__ring"
                            role="img"
                            aria-label={`Risk estimate ${riskPercent}%`}
                          >
                            <circle
                              cx="60"
                              cy="60"
                              r="52"
                              className="pf__track"
                            />

                            <circle
                              cx="60"
                              cy="60"
                              r="52"
                              className="pf__arc"
                              style={{
                                stroke: riskColor,
                                strokeDasharray:
                                  `${(riskPercent / 100) * circumference} ${circumference}`,
                              }}
                              transform="rotate(-90 60 60)"
                            />

                            <text
                              x="60"
                              y="58"
                              textAnchor="middle"
                              className="pf__val"
                            >
                              {riskPercent.toFixed(1)}%
                            </text>

                            <text
                              x="60"
                              y="76"
                              textAnchor="middle"
                              className="pf__cat"
                            >
                              Risk
                            </text>
                          </svg>

                          <div>
                            <h3>Screening Category</h3>
                            <h2 style={{ color: riskColor }}>
                              {diabetesResult.risk_level}
                            </h2>

                            <p>
                              Estimated diabetes screening probability
                              produced by your LightGBM model.
                            </p>

                            <h3>Model Information</h3>
                            <p>{diabetesResult.model}</p>
                          </div>
                        </div>

                        <div className="pf__gemini">
                          <div className="pf__gemini-heading">
                            <span className="pf__gemini-icon">
                              <Sparkles size={22} />
                            </span>

                            <div className="pf__gemini-title">
                              <h3>Gemini Health Insights</h3>
                              <small>
                                Personalized health education
                              </small>
                            </div>

                            <span className="pf__gemini-badge">
                              Powered by Gemini
                            </span>
                          </div>

                          {diabetesResult.gemini_status === 'success' &&
                          diabetesResult.gemini_insights ? (
                            <div className="pf__gemini-content">
                              <ReactMarkdown>
                                {diabetesResult.gemini_insights}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            <p className="pf__gemini-unavailable">
                              Health insights are temporarily unavailable.
                              Your screening result is still available.
                            </p>
                          )}

                          <small className="pf__gemini-disclaimer">
                            Educational information only. Not medical
                            advice, diagnosis or treatment.
                          </small>
                        </div>
                      </>
                    )}

                    {/* READMISSION RESULT */}

                    {readmissionResult && (
                      <div className="pf__readmission">

                        <div className="pf__readmission-prediction">
                          <span>
                            Predicted readmission within 30 days?
                          </span>

                          <h1
                            className={
                              readmissionResult.predicted_readmission === 'YES'
                                ? 'pf__readmission-yes'
                                : 'pf__readmission-no'
                            }
                          >
                            {readmissionResult.predicted_readmission}
                          </h1>

                          <p>
                            {readmissionResult.predicted_readmission === 'YES'
                              ? 'The AI assessment suggests a possibility of readmission within 30 days.'
                              : 'The AI assessment suggests a comparatively lower possibility of readmission within 30 days.'}
                          </p>

                          <small>
                            Experimental AI-generated assessment
                          </small>
                        </div>

                        <section className="pf__readmission-section">
                          <div className="pf__readmission-section-title">
                            <span><ClipboardList size={19} /></span>
                            <h3>Assessment Explanation</h3>
                          </div>

                          <p>
                            {readmissionResult.assessment_explanation}
                          </p>
                        </section>

                        {renderListSection(
                          'Relevant Readmission Factors',
                          readmissionResult.relevant_factors,
                          Activity
                        )}

                        {renderListSection(
                          'Preventive Care Suggestions',
                          readmissionResult.preventive_suggestions,
                          HeartPulse
                        )}

                        {renderListSection(
                          'Follow-up Guidance',
                          readmissionResult.follow_up_guidance,
                          Stethoscope
                        )}

                        <div className="pf__readmission-disclaimer">
                          {readmissionResult.disclaimer}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* ERROR */}

                {status === 'error' && (
                  <div className="pf__error">
                    <h3>Unable to generate result</h3>
                    <p role="alert">{errorMessage}</p>

                    <button
                      className="pf__btn"
                      onClick={runPrediction}
                    >
                      Try Again
                    </button>
                  </div>
                )}

                {/* DISCLAIMER */}

                {status === 'success' && diabetesResult && (
                  <p className="pf__disc">
                    {diabetesResult.disclaimer}
                  </p>
                )}
              </GlassPanel>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* NAVIGATION */}

      <div className="pf__nav">
        {step > 0 && step <= totalSteps && (
          <button
            className="pf__btn"
            onClick={() => setStep(step - 1)}
          >
            Previous
          </button>
        )}

        {step < totalSteps && (
          <button
            className="pf__btn pf__btn--go"
            onClick={next}
          >
            Next
          </button>
        )}

        {step === totalSteps && (
          <button
            className="pf__btn pf__btn--go"
            onClick={runPrediction}
          >
            {isDiabetes
              ? 'Predict Diabetes Risk'
              : 'Generate Readmission Assessment'}
          </button>
        )}

        {step > totalSteps && (
          <button className="pf__btn" onClick={reset}>
            Start Over
          </button>
        )}
      </div>
    </div>
  );
}
