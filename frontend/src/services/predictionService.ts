// // import axios from 'axios';
// // import { DEMO_MODE } from '../config';
// // const api = axios.create({ baseURL: '/api' });
// // export class ModelNotConnectedError extends Error {}
// // export async function predict(kind: 'diabetes' | 'readmission', values: Record<string, string>) {
// //   if (DEMO_MODE) throw new ModelNotConnectedError('No trained model is connected.');
// //   return (await api.post<{ value: number; category: string }>(`/predict/${kind}`, values)).data;
// // }




// import axios from 'axios';
// import { DEMO_MODE } from '../config';

// const api = axios.create({
//   baseURL: '/api',
// });

// export class ModelNotConnectedError extends Error {}

// export interface DiabetesPredictionResult {
//   risk_probability: number;
//   risk_percent: number;
//   risk_level: 'HIGHER' | 'MODERATE' | 'LOWER';
//   model: string;
//   disclaimer: string;
//   gemini_insights?: string | null;
//   gemini_status?: 'success' | 'unavailable';
// }


// export interface ReadmissionPredictionResult {
//   assessment_type: string;
//   predicted_readmission: 'YES' | 'NO';
//   assessment_explanation: string;
//   relevant_factors: string[];
//   preventive_suggestions: string[];
//   follow_up_guidance: string[];
//   status: 'success';
//   disclaimer: string;
// }


// export async function predict(
//   kind: 'diabetes' | 'readmission',
//   values: Record<string, string>
// ): Promise<DiabetesPredictionResult | ReadmissionPredictionResult> {

//   if (DEMO_MODE) {
//     throw new ModelNotConnectedError(
//       'Model connection is disabled.'
//     );
//   }

//   if (kind === 'diabetes') {

//     const payload = {
//       ...values,
//       age: values.Age,
//       Sex: values.Sex === '0' ? 'Female' : 'Male',
//     };

//     delete (payload as Record<string, unknown>).Age;

//     const response = await api.post<{
//       success: boolean;
//       prediction?: DiabetesPredictionResult;
//       error?: string;
//     }>('/predict/diabetes', payload);

//     if (!response.data.success || !response.data.prediction) {
//       throw new Error(
//         response.data.error || 'Diabetes prediction failed.'
//       );
//     }

//     return response.data.prediction;
//   }

//   // Hospital Readmission AI Assessment

//   const response = await api.post<{
//     success: boolean;
//     prediction?: ReadmissionPredictionResult;
//     error?: string;
//   }>('/predict/readmission', values);

//   if (!response.data.success || !response.data.prediction) {
//     throw new Error(
//       response.data.error || 'Readmission assessment failed.'
//     );
//   }

//   return response.data.prediction;
// }





import axios from 'axios';
import { DEMO_MODE } from '../config';

import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000
});

export class ModelNotConnectedError extends Error {}

export interface DiabetesPredictionResult {
  risk_probability: number;
  risk_percent: number;
  risk_level: 'HIGHER' | 'MODERATE' | 'LOWER';
  model: string;
  disclaimer: string;
  gemini_insights?: string | null;
  gemini_status?: 'success' | 'unavailable';
}

export interface ReadmissionPredictionResult {
  assessment_type: string;
  predicted_readmission: 'YES' | 'NO';
  assessment_explanation: string;
  relevant_factors: string[];
  preventive_suggestions: string[];
  follow_up_guidance: string[];
  status: 'success';
  disclaimer: string;
}

export async function predict(
  kind: 'diabetes' | 'readmission',
  values: Record<string, string>
): Promise<DiabetesPredictionResult | ReadmissionPredictionResult> {

  if (DEMO_MODE) {
    throw new ModelNotConnectedError(
      'Model connection is disabled.'
    );
  }

  if (kind === 'readmission') {
    const response = await api.post<{
      success: boolean;
      prediction?: ReadmissionPredictionResult;
      error?: string;
    }>('/predict/readmission', values);

    if (!response.data.success || !response.data.prediction) {
      throw new Error(
        response.data.error || 'Readmission assessment failed.'
      );
    }

    return response.data.prediction;
  }

  const payload = {
    ...values,
    age: values.Age,
    Sex: values.Sex === '0' ? 'Female' : 'Male',
  };

  delete (payload as Record<string, unknown>).Age;

  const response = await api.post<{
    success: boolean;
    prediction?: DiabetesPredictionResult;
    error?: string;
  }>('/predict/diabetes', payload);

  if (!response.data.success || !response.data.prediction) {
    throw new Error(
      response.data.error || 'Diabetes prediction failed.'
    );
  }

  return response.data.prediction;
}
