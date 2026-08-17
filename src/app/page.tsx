'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  BookOpen, 
  GraduationCap, 
  History, 
  Globe, 
  Code2, 
  Database, 
  ShieldCheck, 
  LogOut, 
  Plus,
  MessageSquare
} from 'lucide-react';

interface ChatMessage {
  _id?: string;
  question: string;
  answer: string;
  topic?: string;
}

const TOPICS = [
  { id: 'Web Development', label: 'Web Development', icon: Globe },
  { id: 'Programming', label: 'Programming General', icon: Code2 },
  { id: 'Database', label: 'Database & SQL', icon: Database },
  { id: 'Cyber Security', label: 'Cyber Security', icon: ShieldCheck },
];

export default function Home() {
  const [token, setToken] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('Web Development');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyList, setHistoryList] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const formatAuthHeader = (authToken: string) => {
    if (!authToken) return '';
    return authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('token') || '';
    if (!savedToken) {
      router.push('/login');
      return;
    }
    setToken(savedToken);
    fetchHistory(savedToken);
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const fetchHistory = async (authToken: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/tutor/history', {
        headers: { Authorization: formatAuthHeader(authToken) },
      });
      const data = await res.json();
      if (data.success) {
        const rawData: ChatMessage[] = data.data.reverse();
        setHistoryList(rawData);
        setMessages(rawData);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userQuery = prompt;
    setPrompt('');
    setLoading(true);

    const tempMessage: ChatMessage = { question: userQuery, answer: '', topic };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch('http://localhost:5000/api/tutor/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: formatAuthHeader(token),
        },
        body: JSON.stringify({ prompt: userQuery, topic }),
      });

      const data = await res.json();
      if (data.success) {
        const newMsg = { ...tempMessage, answer: data.data.answer };
        setMessages((prev) =>
          prev.map((msg, idx) => (idx === prev.length - 1 ? newMsg : msg))
        );
        setHistoryList((prev) => [newMsg, ...prev]);
      } else {
        alert(data.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    } catch (err) {
      console.error(err);
      alert('ไม่สามารถเชื่อมต่อกับ Server ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
  };

  const handleSelectHistoryItem = (item: ChatMessage) => {
    setMessages([item]);
    if (item.topic) {
      setTopic(item.topic);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const activeTopic = TOPICS.find((t) => t.id === topic) ?? TOPICS[0];

  return (
    <div className="flex h-screen bg-[#0B0E13] text-[#EDE8DD] font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-[#0E1218] border-r border-[#22283349] p-5 hidden md:flex md:flex-col justify-between relative">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 10%, #C9A24B 0, transparent 45%)',
          }}
        />
        
        <div className="relative flex flex-col h-[calc(100vh-100px)] min-h-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 shrink-0">
            <div className="w-10 h-10 rounded-full border border-[#C9A24B66] flex items-center justify-center text-[#E4C878] bg-[#151A22]">
              <GraduationCap size={20} strokeWidth={1.75} />
            </div>
            <div>
              <div className="font-display text-lg leading-none text-[#EDE8DD]">AI Tutor</div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-[#5C6472] uppercase mt-1">
                Private Study
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#C9A24B] hover:bg-[#E4C878] text-[#0B0E13] font-medium py-2.5 px-4 transition-colors mb-6 text-sm shrink-0 shadow-md"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>ถามคำถามใหม่</span>
          </button>

          {/* Topics Section */}
          <div className="mb-6 shrink-0">
            <div className="mb-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#5C6472] uppercase">
                เลือกหัวข้อวิชา
              </span>
            </div>
            <nav className="space-y-1">
              {TOPICS.map(({ id, label, icon: Icon }) => {
                const active = id === topic;
                return (
                  <button
                    key={id}
                    onClick={() => setTopic(id)}
                    className={`w-full flex items-center gap-2.5 rounded-md px-3 py-2 text-xs text-left transition-all border-l-2 ${
                      active
                        ? 'bg-[#C9A24B14] border-[#C9A24B] text-[#E4C878]'
                        : 'border-transparent text-[#8B93A1] hover:text-[#EDE8DD] hover:bg-[#151A2280]'
                    }`}
                  >
                    <Icon size={15} strokeWidth={1.75} className="shrink-0" />
                    <span className="font-sans truncate">{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Chat History List */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden border-t border-[#22283349] pt-4">
            <div className="flex items-center gap-1.5 mb-2.5 shrink-0 text-[#5C6472]">
              <History size={13} />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                ประวัติการถาม
              </span>
            </div>
            
            <div className="study-scroll flex-1 overflow-y-auto space-y-1 pr-1">
              {historyList.length === 0 ? (
                <div className="text-[11px] text-[#5C6472] italic py-2">ยังไม่มีประวัติการถาม</div>
              ) : (
                historyList.map((item, idx) => (
                  <button
                    key={item._id || idx}
                    onClick={() => handleSelectHistoryItem(item)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-md text-xs text-[#8B93A1] hover:text-[#EDE8DD] hover:bg-[#151A2280] transition-colors text-left group"
                  >
                    <MessageSquare size={13} className="shrink-0 text-[#5C6472] group-hover:text-[#C9A24B]" />
                    <span className="truncate flex-1 font-sans">{item.question}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* User / Logout Section */}
        <div className="relative pt-4 border-t border-[#22283349] shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-xs text-[#8B93A1] hover:text-red-400 transition-colors"
          >
            <LogOut size={14} strokeWidth={1.75} />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Header */}
        <header className="h-[68px] shrink-0 border-b border-[#22283349] px-8 flex items-center justify-between bg-[#0B0E13]/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7FA88C] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7FA88C]" />
            </span>
            <h1 className="font-display text-[15px] text-[#EDE8DD]">AI Tutor Assistant</h1>
            <span className="flex items-center gap-1.5 text-[11px] font-mono tracking-wide text-[#B8935A] bg-[#C9A24B14] px-2.5 py-1 rounded-sm border border-[#C9A24B33]">
              <activeTopic.icon size={12} strokeWidth={2} />
              {topic}
            </span>
          </div>

          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 text-xs text-[#8B93A1] hover:text-[#E4C878] bg-[#151A22] border border-[#2A3140] hover:border-[#C9A24B66] px-3 py-1.5 rounded-md transition-all"
          >
            <Plus size={14} />
            <span>หน้าถามใหม่</span>
          </button>
        </header>

        {/* Messages Box */}
        <div className="study-scroll flex-1 overflow-y-auto px-8 py-8 space-y-8">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-[#5C6472] gap-4">
              <div className="w-16 h-16 rounded-full border border-[#2A3140] flex items-center justify-center text-[#8B6F2E] bg-[#0E1218]">
                <BookOpen size={26} strokeWidth={1.5} />
              </div>
              <p className="font-sans text-sm text-center max-w-xs">
                เริ่มต้นพิมพ์คำถามเกี่ยวกับ{' '}
                <span className="text-[#B8935A]">{topic}</span> ได้เลยครับ
              </p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isLastMessage = index === messages.length - 1;
            const showAiThinking = isLastMessage && loading && !msg.answer;

            return (
              <div key={index} className="space-y-4 rise-in">
                {index > 0 && (
                  <div className="flex items-center gap-3 max-w-2xl mx-auto opacity-40">
                    <div className="h-px flex-1 bg-[#2A3140]" />
                    <span className="text-[#8B6F2E] text-xs">✦</span>
                    <div className="h-px flex-1 bg-[#2A3140]" />
                  </div>
                )}

                {/* Question (User) */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-gradient-to-br from-[#C9A24B22] to-[#C9A24B0d] border border-[#C9A24B3d] text-[#EDE8DD] rounded-2xl rounded-tr-sm px-4 py-3 max-w-xl text-sm font-sans leading-relaxed shadow-[0_4px_24px_-8px_rgba(201,162,75,0.15)]">
                    {msg.question}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1C2330] border border-[#C9A24B4d] flex items-center justify-center text-[#E4C878] shrink-0 font-display text-xs">
                    S
                  </div>
                </div>

                {/* Answer (AI) */}
                {(msg.answer || showAiThinking) && (
                  <div className="flex items-start gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-[#151A22] border border-[#2A3140] flex items-center justify-center text-[#8B93A1] shrink-0 font-display text-xs">
                      T
                    </div>
                    <div className="bg-[#151A22] border-l-2 border-l-[#C9A24B66] border-y border-r border-y-[#22283349] border-r-[#22283349] text-[#D8D3C6] rounded-xl rounded-tl-sm px-4 py-3 max-w-2xl text-sm leading-relaxed font-sans markdown-body">
                      {msg.answer ? (
                        <ReactMarkdown>{msg.answer}</ReactMarkdown>
                      ) : (
                        <span className="flex items-center gap-1.5 text-[#5C6472]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8935A] animate-pulse" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8935A] animate-pulse delay-75" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8935A] animate-pulse delay-150" />
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <footer className="shrink-0 p-5 border-t border-[#22283349] bg-[#0B0E13]/80 backdrop-blur">
          <form onSubmit={handleSend} className="flex gap-2.5 max-w-3xl mx-auto">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={`ถามคำถามเกี่ยวกับ ${topic}...`}
              className="flex-1 bg-[#151A22] border border-[#2A3140] rounded-lg px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#C9A24B80] focus:ring-1 focus:ring-[#C9A24B33] text-[#EDE8DD] placeholder-[#5C6472] transition-colors"
            />
            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className="bg-[#C9A24B] hover:bg-[#E4C878] disabled:bg-[#151A22] disabled:text-[#3d4353] disabled:border disabled:border-[#2A3140] text-[#0B0E13] px-5 py-3 rounded-lg transition-colors flex items-center gap-2 font-medium text-sm font-sans"
            >
              <Send size={16} strokeWidth={2} />
              <span>ส่ง</span>
            </button>
          </form>
        </footer>
      </main>
    </div>
  );
}