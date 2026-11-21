import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Send } from 'lucide-react';
import { AIOrb } from '../AIVisuals/AIVisuals';
import GlassPanel from '../GlassPanel/GlassPanel';
import { exampleQuestions } from '../../data/aiMockResponses';
import type { AIResponse } from '../../types';
import './AIChat.css';
export interface ChatMessage { id: number; role: 'user' | 'ai'; text: string; response?: AIResponse | null }
interface Props { messages: ChatMessage[]; loading: boolean; savedIds: string[]; onSend: (q: string) => void; onSave: (r: AIResponse) => void }
export default function AIChat({ messages, loading, savedIds, onSend, onSave }: Props) {
  const [text, setText] = useState('');
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: 'smooth', block: 'end' }); }, [messages, loading]);
  const send = () => { const t = text.trim(); if (t && !loading) { onSend(t); setText(''); } };
  return (
    <div className="chat">
      <div className="chat__log" aria-live="polite">
        {messages.length === 0 && (
          <div className="chat__welcome"><AIOrb /><h2>Ask Questions. Discover Insights. Understand Healthcare Data.</h2><p>This is a preview of the future Gemini assistant. Answers below are simulated.</p>
            <div className="chat__prompts">{exampleQuestions.map(q => <button key={q} onClick={() => onSend(q)}>{q}</button>)}</div></div>)}
        {messages.map(m => m.role === 'user' ? <div key={m.id} className="chat__user">{m.text}</div> : (
          <GlassPanel key={m.id} className="chat__ai" badge={m.response ? 'Simulated response' : undefined} title="GLUCOAI Insights">
            <p>{m.text}</p>
            {m.response && (<>
              <ul>{m.response.points.map(p => <li key={p}>{p}</li>)}</ul>
              <div className="chat__actions"><Link to={m.response.viz.to}>Suggested visualization: {m.response.viz.label}</Link>
                <button disabled={savedIds.includes(m.response.id)} onClick={() => onSave(m.response!)}><Bookmark size={14} /> {savedIds.includes(m.response.id) ? 'Saved' : 'Save insight'}</button></div></>)}
          </GlassPanel>))}
        {loading && <div className="chat__typing" aria-label="Assistant is responding"><i /><i /><i /></div>}
        <div ref={end} />
      </div>
      <form className="chat__input" onSubmit={e => { e.preventDefault(); send(); }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Ask about the analytics…" aria-label="Message" />
        <button type="submit" aria-label="Send" disabled={loading || !text.trim()}><Send size={18} /></button>
      </form>
      <small className="chat__note">Educational only. No diagnoses, prescriptions or treatment instructions.</small>
    </div>
  );
}
