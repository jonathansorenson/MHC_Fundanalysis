import { useState, useRef, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || '';

export default function AskAIPanel({ open, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, history: messages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response || data.error || 'No response' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `Error: ${err.message}` }]);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-mhc-card border-l border-mhc-border shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-mhc-border">
        <div>
          <h3 className="text-white font-semibold text-sm">Ask AI</h3>
          <p className="text-mhc-muted text-xs">Ask questions about your fund data</p>
        </div>
        <button onClick={onClose} className="text-mhc-muted hover:text-white transition text-lg">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-mhc-muted text-sm py-12">
            <p className="mb-2">Ask anything about your portfolio…</p>
            <div className="space-y-1 text-xs">
              <p className="text-mhc-accent/60">"What's the total NOI across both funds?"</p>
              <p className="text-mhc-accent/60">"Which property has the lowest occupancy?"</p>
              <p className="text-mhc-accent/60">"How is Yamato performing vs budget?"</p>
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
              m.role === 'user'
                ? 'bg-mhc-accent text-mhc-navy'
                : 'bg-mhc-navy border border-mhc-border text-white'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-mhc-navy border border-mhc-border rounded-xl px-4 py-2.5 text-sm text-mhc-muted animate-pulse">
              Thinking…
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={send} className="p-4 border-t border-mhc-border flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about your fund data…"
          className="flex-1 bg-mhc-navy border border-mhc-border rounded-lg px-4 py-2.5 text-white text-sm placeholder-mhc-muted/50 focus:outline-none focus:border-mhc-accent transition"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-mhc-accent text-mhc-navy px-4 py-2.5 rounded-lg font-semibold text-sm hover:bg-mhc-accent/90 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
