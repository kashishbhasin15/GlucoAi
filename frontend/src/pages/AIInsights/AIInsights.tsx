import { useState } from 'react';
import { Plus } from 'lucide-react';
import AIChat, { type ChatMessage } from '../../components/AIChat/AIChat';
import NeumorphicCard from '../../components/NeumorphicCard/NeumorphicCard';
import { askAI } from '../../services/aiService';
import { aiTopics, exampleQuestions } from '../../data/aiMockResponses';
import type { AIResponse } from '../../types';
import './AIInsights.css';
const UNSUPPORTED = 'Live AI responses will be available after Gemini integration.';
export default function AIInsights() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<AIResponse[]>([]);
  const send = async (q: string) => {
    const id = Date.now();
    setMessages(m => [...m, { id, role: 'user', text: q }]); setLoading(true);
    try { const r = await askAI(q); setMessages(m => [...m, { id: id + 1, role: 'ai', text: r ? r.answer : UNSUPPORTED, response: r }]); }
    catch { setMessages(m => [...m, { id: id + 1, role: 'ai', text: 'Something went wrong. Please try again.' }]); }
    finally { setLoading(false); }
  };
  return (
    <div className="ai">
      <aside className="ai__side">
        <button className="ai__new" onClick={() => setMessages([])}><Plus size={16} /> New Conversation</button>
        <NeumorphicCard className="ai__box"><h3>Example Questions</h3>{exampleQuestions.map(q => <button key={q} onClick={() => send(q)}>{q}</button>)}</NeumorphicCard>
        <NeumorphicCard className="ai__box"><h3>Analytics Topics</h3>{aiTopics.map(([t, q]) => <button key={t} onClick={() => send(q)}>{t}</button>)}</NeumorphicCard>
        <NeumorphicCard className="ai__box" variant="inset"><h3>Saved Insights</h3>{saved.length ? saved.map(s => <p key={s.id}>{s.question}</p>) : <p className="ai__empty">Nothing saved yet. Demo only — not stored.</p>}</NeumorphicCard>
      </aside>
      <main className="ai__main"><AIChat messages={messages} loading={loading} savedIds={saved.map(s => s.id)} onSend={send} onSave={r => setSaved(s => [...s, r])} /></main>
    </div>
  );
}
