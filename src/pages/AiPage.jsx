import { useState, useRef, useEffect } from 'react';
import { aiApi, employeeApi } from '../services/api';
import Spinner from '../components/Spinner';

const SUGGESTIONS = [
  'How many employees are there?',
  'Who is the highest paid employee?',
  'Show all departments',
  'What is the average salary?',
  'Who joined this month?',
  'Employees in Engineering department',
  'Total payroll cost?',
  'Who is the latest added employee?',
  'List employees by salary',
  'How many employees are in Finance?',
];

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: 5, padding: '14px 16px', alignItems: 'center' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: '50%',
          background: 'var(--accent-light)',
          animation: `pulse-dot 1.2s ease ${i * 0.2}s infinite`,
          display: 'inline-block',
        }} />
      ))}
    </div>
  );
}

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 16,
      animation: 'fadeUp 0.25s ease',
    }}>
      {!isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0, marginRight: 10, marginTop: 2,
        }}>◉</div>
      )}
      <div style={{ maxWidth: '75%' }}>
        <div style={{
          padding: '12px 16px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser
            ? 'linear-gradient(135deg, var(--accent), #4f46e5)'
            : 'var(--bg-card2)',
          border: isUser ? 'none' : '1px solid var(--border)',
          color: 'var(--text)',
          fontSize: 14,
          lineHeight: 1.7,
          fontFamily: isUser ? 'var(--font-body)' : 'var(--font-mono)',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {msg.content}
        </div>
        {msg.queryType && (
          <div style={{
            marginTop: 5, fontSize: 10, color: 'var(--text-faint)',
            fontFamily: 'var(--font-mono)', paddingLeft: 4,
          }}>
            query_type: {msg.queryType} · source: live postgresql
          </div>
        )}
        {msg.error && (
          <div style={{
            marginTop: 5, fontSize: 11, color: 'var(--red)',
            fontFamily: 'var(--font-mono)', paddingLeft: 4,
          }}>
            ⚠ {msg.error}
          </div>
        )}
      </div>
      {isUser && (
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--bg-card2)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, flexShrink: 0, marginLeft: 10, marginTop: 2,
        }}>◈</div>
      )}
    </div>
  );
}

export default function AiPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm NexaHR Assistant — connected to your live PostgreSQL database.\n\nAsk me anything about your employees: counts, salaries, departments, or specific queries. I'll fetch real data before answering.",
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [empCount, setEmpCount] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    employeeApi.getAll().then(data => {
      if (Array.isArray(data)) setEmpCount(data.length);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const data = await aiApi.chat(msg);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.answer || 'No response received.',
        queryType: data.queryType,
        dataFound: data.dataFound,
      }]);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Failed to reach AI service. Please ensure Spring Boot (port 8085) and Ollama are running.',
        error: e.message,
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Chat cleared. Ask me anything about your employees!",
    }]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Header */}
      <div style={{
        padding: '20px 28px',
        borderBottom: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexShrink: 0,
      }}>
        <div>
          <div style={{
            fontSize: 10, fontFamily: 'var(--font-mono)',
            color: 'var(--accent-light)', letterSpacing: 2, marginBottom: 4,
          }}>
            ◉ AI ASSISTANT · RAG ARCHITECTURE
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800,
            color: 'var(--text)',
          }}>NexaHR Intelligence</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>
            Live PostgreSQL data · Ollama llama3.2 · Zero hallucinations
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {empCount !== null && (
            <div style={{
              background: 'var(--accent-glow)', border: '1px solid var(--border-glow)',
              borderRadius: 20, padding: '5px 14px',
              fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--accent-light)',
            }}>
              {empCount} employees in DB
            </div>
          )}
          <button onClick={clearChat} style={{
            background: 'var(--bg-card2)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 'var(--radius)',
            padding: '7px 14px', fontSize: 12, fontFamily: 'var(--font-mono)',
          }}>
            Clear Chat
          </button>
        </div>
      </div>

      {/* Suggestions */}
      <div style={{
        padding: '12px 28px', borderBottom: '1px solid var(--border)',
        display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0,
        scrollbarWidth: 'none',
      }}>
        {SUGGESTIONS.map(s => (
          <button key={s} onClick={() => send(s)} disabled={loading} style={{
            background: 'var(--bg-card2)', border: '1px solid var(--border)',
            color: 'var(--text-muted)', borderRadius: 20,
            padding: '5px 12px', fontSize: 11, fontFamily: 'var(--font-mono)',
            whiteSpace: 'nowrap', flexShrink: 0,
            transition: 'all 0.15s',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
            onMouseEnter={e => {
              e.target.style.borderColor = 'var(--accent)';
              e.target.style.color = 'var(--accent-light)';
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = 'var(--border)';
              e.target.style.color = 'var(--text-muted)';
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px 28px',
        minHeight: 0,
      }}>
        {messages.map((msg, i) => (
          <Message key={i} msg={msg} />
        ))}
        {loading && (
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 16 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--cyan))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, marginRight: 10, flexShrink: 0,
            }}>◉</div>
            <div style={{
              background: 'var(--bg-card2)', border: '1px solid var(--border)',
              borderRadius: '18px 18px 18px 4px',
            }}>
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div style={{
        padding: '16px 28px 24px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-end',
          background: 'var(--bg-card2)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '4px 4px 4px 16px',
          transition: 'border-color 0.2s',
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--accent)'}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask anything about your employees… (Enter to send, Shift+Enter for new line)"
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none',
              color: 'var(--text)', fontSize: 14, fontFamily: 'var(--font-body)',
              resize: 'none', outline: 'none', padding: '10px 0',
              lineHeight: 1.6, maxHeight: 120, overflowY: 'auto',
              boxShadow: 'none',
            }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            style={{
              background: loading || !input.trim()
                ? 'var(--bg-card)'
                : 'linear-gradient(135deg, var(--accent), #4f46e5)',
              color: loading || !input.trim() ? 'var(--text-faint)' : '#fff',
              border: 'none', borderRadius: 12,
              width: 40, height: 40, fontSize: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, margin: 4,
              transition: 'all 0.15s',
            }}
          >
            {loading ? <Spinner size={14} color="var(--accent-light)" /> : '↑'}
          </button>
        </div>
        <div style={{
          marginTop: 8, fontSize: 10, color: 'var(--text-faint)',
          fontFamily: 'var(--font-mono)', textAlign: 'center',
        }}>
          AI fetches live data from PostgreSQL before every answer · No hallucinations
        </div>
      </div>
    </div>
  );
}
