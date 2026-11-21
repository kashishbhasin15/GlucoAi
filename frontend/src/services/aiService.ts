import axios from 'axios';
import { DEMO_MODE } from '../config';
import { aiResponses } from '../data/aiMockResponses';
import type { AIResponse } from '../types';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000
});
export async function askAI(q: string): Promise<AIResponse | null> {
  if (DEMO_MODE) {
    await new Promise(r => setTimeout(r, 1100));
    const t = q.toLowerCase().trim();
    return aiResponses.find(a => a.question.toLowerCase() === t) ?? aiResponses.find(a => a.keywords.some(k => t.includes(k))) ?? null;
  }
  return (await api.post<AIResponse>('/ai/ask', { question: q })).data;
}
