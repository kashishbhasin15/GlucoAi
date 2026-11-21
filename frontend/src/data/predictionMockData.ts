import type { FieldOption, FormField, FormSection, SampleResult } from '../types';
const yn: FieldOption[] = [{ value: '1', label: 'Yes' }, { value: '0', label: 'No' }];
const b = (key: string, label: string, help?: string): FormField => ({ key, label, type: 'boolean', required: true, options: yn, help });
const sel = (key: string, label: string, options: string[], help?: string): FormField => ({ key, label, type: 'select', required: true, help, options: options.map((l, i) => ({ value: String(i + 1), label: l })) });
const num = (key: string, label: string, min: number, max: number, help?: string): FormField => ({ key, label, type: 'number', required: true, min, max, help });

/**
 * Diabetes screening schema — 21 questionnaire features. Keys and encodings are PLACEHOLDERS:
 * confirm them against the pretrained LightGBM model before integration.
 */
export const diabetesSchema: FormSection[] = [
  { id: 'personal', title: 'Personal information', blurb: 'Basic demographic details.', fields: [
    num('Age', 'Age (years)', 18, 120), { key: 'Sex', label: 'Sex', type: 'select', required: true, options: [{ value: '0', label: 'Female' }, { value: '1', label: 'Male' }] },
    sel('Education', 'Education level', ['Never attended school', 'Elementary', 'Some high school', 'High school graduate', 'Some college', 'College graduate']),
    sel('Income', 'Household income', ['Under $10k', '$10k–15k', '$15k–20k', '$20k–25k', '$25k–35k', '$35k–50k', '$50k–75k', '$75k or more'])] },
  { id: 'physical', title: 'Physical health', blurb: 'Measurements and current health status.', fields: [
    num('BMI', 'Body mass index (BMI)', 10, 80, 'Typical range 15–50'), b('HighBP', 'History of high blood pressure'), b('HighChol', 'History of high cholesterol'), b('CholCheck', 'Cholesterol checked in the last 5 years'),
    sel('GenHlth', 'General health', ['Excellent', 'Very good', 'Good', 'Fair', 'Poor']), num('MentHlth', 'Days of poor mental health (last 30)', 0, 30), num('PhysHlth', 'Days of poor physical health (last 30)', 0, 30), b('DiffWalk', 'Serious difficulty walking or climbing stairs')] },
  { id: 'history', title: 'Medical history', blurb: 'Past cardiovascular conditions.', fields: [b('HeartDiseaseorAttack', 'Coronary heart disease or heart attack'), b('Stroke', 'History of stroke')] },
  { id: 'lifestyle', title: 'Lifestyle', blurb: 'Everyday habits.', fields: [b('Smoker', 'Smoked at least 100 cigarettes in lifetime'), b('PhysActivity', 'Physical activity in the past 30 days'), b('Fruits', 'Eats fruit daily'), b('Veggies', 'Eats vegetables daily'), b('HvyAlcoholConsump', 'Heavy alcohol consumption')] },
  { id: 'access', title: 'Healthcare access', blurb: 'Coverage and affordability.', fields: [b('AnyHealthcare', 'Has healthcare coverage'), b('NoDocbcCost', 'Could not see a doctor in the past year because of cost')] },
];
/** Readmission schema — final features depend on the trained model and what is known at prediction time. */
export const readmissionSchema: FormSection[] = [
  { id: 'demo', title: 'Patient demographics', blurb: 'Who the encounter belongs to.', fields: [
    sel('age_group', 'Age group', ['0–20', '20–30', '30–40', '40–50', '50–60', '60–70', '70–80', '80–90', '90+']), { key: 'gender', label: 'Gender', type: 'select', required: true, options: [{ value: 'F', label: 'Female' }, { value: 'M', label: 'Male' }] }] },
  { id: 'admission', title: 'Admission details', blurb: 'How the patient arrived.', fields: [sel('admission_type', 'Admission type', ['Emergency', 'Urgent', 'Elective', 'Other'])] },
  { id: 'prior', title: 'Previous visits', blurb: 'Prior utilization in the past year.', fields: [num('number_inpatient', 'Previous inpatient visits', 0, 50), num('number_emergency', 'Previous emergency visits', 0, 80)] },
  { id: 'stay', title: 'Hospital stay', blurb: 'Length of this encounter.', fields: [num('time_in_hospital', 'Days in hospital', 1, 14), num('number_diagnoses', 'Number of diagnoses', 1, 16)] },
  { id: 'meds', title: 'Medications', blurb: 'Medication-related information.', fields: [num('num_medications', 'Number of medications', 0, 100), b('change', 'Medication changed during stay'), b('diabetesMed', 'Diabetes medication prescribed')] },
  { id: 'labs', title: 'Laboratory & procedures', blurb: 'Tests and procedures performed.', fields: [num('num_lab_procedures', 'Laboratory procedures', 0, 150), num('num_procedures', 'Other procedures', 0, 10)] },
];
/** ILLUSTRATIVE SAMPLES — fixed values, not computed from any user input. */
export const sampleResults: Record<'diabetes' | 'readmission', SampleResult> = {
  diabetes: { value: 38, category: 'Moderate', explanation: 'In a real run, the model would weigh the questionnaire answers together and return a screening estimate. This sample only shows how the result would be laid out.', factors: [{ label: 'Body mass index', effect: 'Higher values usually raise the estimate' }, { label: 'High blood pressure history', effect: 'Usually raises the estimate' }, { label: 'Physical activity', effect: 'Regular activity usually lowers the estimate' }] },
  readmission: { value: 24, category: 'Elevated', explanation: 'A trained model would estimate how likely a 30-day readmission is from encounter details. This sample only shows the layout.', factors: [{ label: 'Previous inpatient visits', effect: 'More prior visits usually raise the estimate' }, { label: 'Previous emergency visits', effect: 'Frequent visits usually raise the estimate' }, { label: 'Days in hospital', effect: 'Longer stays are often associated with higher rates' }] },
};
