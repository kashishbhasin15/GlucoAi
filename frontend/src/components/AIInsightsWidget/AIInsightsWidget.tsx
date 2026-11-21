
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  MessageCircle,
  LoaderCircle,
  ShieldCheck,
} from 'lucide-react';

import ReactMarkdown from 'react-markdown';
import './AIInsightsWidget.css';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface ChatResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

interface PredictionContext {
  type: string;
  result: Record<string, unknown>;
}

const QUICK_QUESTIONS = [
  'What is diabetes?',
  'Explain my prediction',
  'How can I maintain a healthy lifestyle?',
];

export default function AIInsightsWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [includePrediction, setIncludePrediction] = useState(false);

  const [history, setHistory] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: "Hello! 👋 I'm your GLUCOAI Help Assistant. You can ask me about diabetes, hospital readmission, hospital stay predictions, or general health information. How can I help you?",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [history, loading, isOpen]);

  const sendMessage = async (question?: string) => {
    const text = (question ?? message).trim();

    if (!text || loading) return;

    let predictionContext: PredictionContext | null = null;

    if (includePrediction) {
      try {
        const saved = sessionStorage.getItem(
          'glucoai_latest_prediction'
        );

        if (!saved) {
          setHistory(prev => [
            ...prev,
            {
              role: 'model',
              text: 'No recent prediction is available in this browser session. Complete a prediction first.',
            },
          ]);
          return;
        }

        predictionContext = JSON.parse(saved);
      } catch {
        setHistory(prev => [
          ...prev,
          {
            role: 'model',
            text: 'Unable to read the saved prediction. Please generate your prediction again.',
          },
        ]);
        return;
      }
    }

    const userMessage: ChatMessage = {
      role: 'user',
      text,
    };

    const updatedHistory = [...history, userMessage];

    setHistory(updatedHistory);
    setMessage('');
    setLoading(true);

    try {
      const response = await axios.post<ChatResponse>(
        '/api/chat',
        {
          message: text,
          history: history.slice(1).slice(-10),
          include_prediction: includePrediction,
          prediction_context: predictionContext,
        }
      );

      if (!response.data.success || !response.data.reply) {
        throw new Error(
          response.data.error || 'Unable to get a response.'
        );
      }

      setHistory(prev => [
        ...prev,
        {
          role: 'model',
          text: response.data.reply!,
        },
      ]);

    } catch (error) {
      const errorText = axios.isAxiosError(error)
        ? error.response?.data?.error ||
          'Unable to connect to GLUCOAI. Please try again.'
        : error instanceof Error
          ? error.message
          : 'Something went wrong.';

      setHistory(prev => [
        ...prev,
        {
          role: 'model',
          text: errorText,
        },
      ]);

    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setHistory([
      {
        role: 'model',
        text: "Hello again! 👋 How can I help you with GLUCOAI today?",
      },
    ]);
  };

  return (
    <div className="ai-widget">

      {/* FLOATING ORB */}

      <button
        className="ai-orb-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open GLUCOAI Help Assistant"
        aria-expanded={isOpen}
      >
        <span className="ai-orb-ring ai-orb-ring--outer" />
        <span className="ai-orb-ring ai-orb-ring--inner" />

        <span className="ai-orb-sphere">
          <Sparkles className="ai-orb-sparkle" />
        </span>

        <span className="ai-orb-tooltip">
          Need Help?
        </span>
      </button>

      {/* CHAT WINDOW */}

      {isOpen && (
        <div className="ai-widget-panel">

          <div className="ai-widget-header">

            <div className="ai-widget-heading">
              <div className="ai-chat-avatar">
                <Sparkles size={20} />
              </div>

              <div>
                <h3>GLUCOAI Assistant</h3>
                <p>
                  <span className="ai-online-dot" />
                  Healthcare information assistant
                </p>
              </div>
            </div>

            <div className="ai-chat-actions">

              <button
                onClick={clearChat}
                aria-label="Clear conversation"
                title="Clear conversation"
                disabled={loading}
              >
                <Trash2 size={17} />
              </button>

              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chatbot"
              >
                <X size={20} />
              </button>

            </div>

          </div>

          {/* MESSAGES */}

          <div className="ai-chat-messages">

            {history.map((item, index) => (
              <div
                key={index}
                className={`ai-chat-message ${
                  item.role === 'user'
                    ? 'ai-chat-message--user'
                    : 'ai-chat-message--bot'
                }`}
              >
                {item.role === 'model' && (
                  <span className="ai-chat-message-icon">
                    <Sparkles size={15} />
                  </span>
                )}

                <div className="ai-chat-bubble">
                  {item.role === 'model' ? (
                    <ReactMarkdown>
                      {item.text}
                    </ReactMarkdown>
                  ) : (
                    item.text
                  )}
                </div>
              </div>
            ))}

            {history.length === 1 && (
              <div className="ai-quick-questions">
                <p>Suggested questions</p>

                {QUICK_QUESTIONS.map(question => (
                  <button
                    key={question}
                    onClick={() => sendMessage(question)}
                    disabled={loading}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}

            {loading && (
              <div className="ai-chat-message ai-chat-message--bot">
                <span className="ai-chat-message-icon">
                  <Sparkles size={15} />
                </span>

                <div className="ai-chat-bubble ai-chat-loading">
                  <LoaderCircle size={16} />
                  Thinking...
                </div>
              </div>
            )}

            <div ref={bottomRef} />

          </div>

          {/* PRIVACY OPTION */}

          <label className="ai-context-toggle">
            <input
              type="checkbox"
              checked={includePrediction}
              onChange={event =>
                setIncludePrediction(event.target.checked)
              }
            />

            <ShieldCheck size={15} />

            <span>
              Include my latest prediction when I send a message
            </span>
          </label>

          {/* INPUT */}

          <form
            className="ai-chat-input"
            onSubmit={event => {
              event.preventDefault();
              sendMessage();
            }}
          >
            <input
              type="text"
              value={message}
              onChange={event => setMessage(event.target.value)}
              placeholder="Ask your health question..."
              maxLength={2000}
              disabled={loading}
            />

            <button
              type="submit"
              disabled={!message.trim() || loading}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </form>

          <div className="ai-chat-disclaimer">
            <ShieldCheck size={12} />
            Educational information only. Not medical advice.
          </div>

        </div>
      )}
    </div>
  );
}
