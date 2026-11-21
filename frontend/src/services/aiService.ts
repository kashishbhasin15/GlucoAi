
import axios from 'axios';
import { DEMO_MODE, API_BASE_URL } from '../config';
import { aiResponses } from '../data/aiMockResponses';
import type { AIResponse } from '../types';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

export async function askAI(q: string): Promise<AIResponse | null> {
  if (DEMO_MODE) {
    await new Promise(resolve => setTimeout(resolve, 1100));

    const t = q.toLowerCase().trim();

    return (
      aiResponses.find(
        a => a.question.toLowerCase() === t
      ) ??
      aiResponses.find(
        a => a.keywords.some(k => t.includes(k))
      ) ??
      null
    );
  }

  const response = await api.post('/chat', {
    message: q,
  });

  return response.data;
}
