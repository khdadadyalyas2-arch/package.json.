import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'سلام! چطور می‌تونم کمکتون کنم؟ | Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: 'خطا در دریافت پاسخ. کلید API را بررسی کنید.' }]);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'ارتباط برقرار نشد. لطفاً دوباره تلاش کنید.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1d] text-slate-100">
      <header className="p-4 border-b border-slate-800 bg-[#0d1424] text-center shadow">
        <h1 className="text-xl font-bold tracking-wide text-cyan-400">Omni AI Chatbot</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`p-3 rounded-2xl max-w-[85%] text-sm md:text-base leading-relaxed ${
                m.role === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none shadow'
              }`}
              style={{ direction: 'auto', whiteSpace: 'pre-wrap' }}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl rounded-bl-none text-cyan-400 text-sm animate-pulse">
              در حال فکر کردن...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </main>

      <footer className="p-4 bg-[#0d1424] border-t border-slate-800">
        <form onSubmit={handleSend} className="max-w-3xl mx-auto flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پیام خود را بنویسید... / Type your message..."
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-4 py-3 focus:outline-none focus:border-cyan-500 text-sm md:text-base"
            style={{ direction: 'auto' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-5 py-3 rounded-xl transition disabled:opacity-50"
          >
            ارسال
          </button>
        </form>
      </footer>
    </div>
  );
}
