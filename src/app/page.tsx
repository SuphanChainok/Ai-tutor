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
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  X,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
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
      const res = await fetch('/api/tutor/history', {
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
      const res = await fetch('/api/tutor/ask', {
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
    setIsMobileSidebarOpen(false);
  };

  const handleSelectHistoryItem = (item: ChatMessage) => {
    setMessages([item]);
    if (item.topic) {
      setTopic(item.topic);
    }
    setIsMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const activeTopic = TOPICS.find((t) => t.id === topic) ?? TOPICS[0];

  /* ───────── Sidebar Content (shared by desktop & mobile) ───────── */
  const sidebarContent = (compact: boolean) => (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, #C9A24B 0, transparent 45%)',
        }}
      />

      <div className="relative flex flex-col h-full min-h-0">
        {/* Header */}
        <div
          className={`flex items-center gap-3 mb-6 shrink-0 ${
            compact ? '' : 'justify-center'
          }`}
        >
          <div className="w-10 h-10 rounded-full border border-[#C9A24B66] flex items-center justify-center text-[#E4C878] bg-[#151A22] shrink-0">
            <GraduationCap size={20} strokeWidth={1.75} />
          </div>
          {compact && (
            <div>
              <div className="font-display text-lg leading-none text-[#EDE8DD]">
                AI Tutor
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-[#5C6472] uppercase mt-1">
                Private Study
              </div>
            </div>
          )}
        </div>

        {/* Desktop Toggle Button (only for non-compact / desktop sidebar) */}
        {!compact && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-0 right-0 z-10 w-8 h-8 flex items-center justify-center rounded-md text-[#5C6472] hover:text-[#E4C878] hover:bg-[#151A2280] transition-colors -mr-1 -mt-1"
            title={isSidebarOpen ? 'พับ Sidebar' : 'กาง Sidebar'}
          >
            {isSidebarOpen ? (
              <PanelLeftClose size={16} strokeWidth={1.75} />
            ) : (
              <PanelLeftOpen size={16} strokeWidth={1.75} />
            )}
          </button>
        )}

        {/* New Chat Button */}
        {compact ? (
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#C9A24B] hover:bg-[#E4C878] text-[#0B0E13] font-medium py-2.5 px-4 transition-colors mb-6 text-sm shrink-0 shadow-md"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>ถามคำถามใหม่</span>
          </button>
        ) : (
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center rounded-lg bg-[#C9A24B] hover:bg-[#E4C878] text-[#0B0E13] py-2.5 transition-colors mb-6 shrink-0 shadow-md"
            title="ถามคำถามใหม่"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        )}

        {/* Topics Section */}
        <div className={`${compact ? 'mb-6' : 'mb-4'} shrink-0`}>
          {compact && (
            <div className="mb-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#5C6472] uppercase">
                เลือกหัวข้อวิชา
              </span>
            </div>
          )}
          <nav className="space-y-1">
            {TOPICS.map(({ id, label, icon: Icon }) => {
              const active = id === topic;
              return (
                <button
                  key={id}
                  onClick={() => setTopic(id)}
                  title={label}
                  className={`w-full flex items-center rounded-md text-xs text-left transition-all border-l-2 ${
                    compact
                      ? 'gap-2.5 px-3 py-2'
                      : 'justify-center px-0 py-2'
                  } ${
                    active
                      ? 'bg-[#C9A24B14] border-[#C9A24B] text-[#E4C878]'
                      : 'border-transparent text-[#8B93A1] hover:text-[#EDE8DD] hover:bg-[#151A2280]'
                  }`}
                >
                  <Icon size={15} strokeWidth={1.75} className="shrink-0" />
                  {compact && (
                    <span className="font-sans truncate">{label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Chat History List */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden border-t border-[#22283349] pt-4">
          {compact && (
            <div className="flex items-center gap-1.5 mb-2.5 shrink-0 text-[#5C6472]">
              <History size={13} />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                ประวัติการถาม
              </span>
            </div>
          )}

          <div className="study-scroll flex-1 overflow-y-auto space-y-1 pr-1">
            {historyList.length === 0 ? (
              compact && (
                <div className="text-[11px] text-[#5C6472] italic py-2">
                  ยังไม่มีประวัติการถาม
                </div>
              )
            ) : (
              historyList.map((item, idx) => (
                <button
                  key={item._id || idx}
                  onClick={() => handleSelectHistoryItem(item)}
                  title={item.question}
                  className={`w-full flex items-center rounded-md text-xs text-[#8B93A1] hover:text-[#EDE8DD] hover:bg-[#151A2280] transition-colors text-left group ${
                    compact
                      ? 'gap-2 px-2.5 py-2'
                      : 'justify-center px-0 py-2'
                  }`}
                >
                  <MessageSquare
                    size={13}
                    className="shrink-0 text-[#5C6472] group-hover:text-[#C9A24B]"
                  />
                  {compact && (
                    <span className="truncate flex-1 font-sans">
                      {item.question}
                    </span>
                  )}
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
          title="ออกจากระบบ"
          className={`w-full flex items-center text-xs text-[#8B93A1] hover:text-red-400 transition-colors ${
            compact ? 'gap-2' : 'justify-center'
          }`}
        >
          <LogOut size={14} strokeWidth={1.75} />
          {compact && <span>ออกจากระบบ</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#0B0E13] text-[#EDE8DD] font-sans antialiased overflow-hidden">
      {/* ═══════════ DESKTOP SIDEBAR (md+) ═══════════ */}
      <aside
        className={`shrink-0 bg-[#0E1218] border-r border-[#22283349] hidden md:flex md:flex-col justify-between relative transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? 'w-72 p-5' : 'w-16 p-3'
        }`}
      >
        {sidebarContent(isSidebarOpen)}
      </aside>

      {/* ═══════════ MOBILE SIDEBAR OVERLAY ═══════════ */}
      {/* Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileSidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      {/* Drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#0E1218] border-r border-[#22283349] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Close button */}
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-md text-[#5C6472] hover:text-[#E4C878] hover:bg-[#151A2280] transition-colors"
        >
          <X size={18} strokeWidth={1.75} />
        </button>
        <div className="p-5 h-full flex flex-col justify-between overflow-hidden">
          {sidebarContent(true)}
        </div>
      </aside>

      {/* ═══════════ MAIN CHAT AREA ═══════════ */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* ── Mobile Header ── */}
        <header className="md:hidden shrink-0 h-14 border-b border-[#22283349] px-4 flex items-center gap-3 bg-[#0B0E13]/90 backdrop-blur z-30">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#8B93A1] hover:text-[#E4C878] hover:bg-[#151A2280] transition-colors shrink-0"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7FA88C] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7FA88C]" />
            </span>
            <h1 className="font-display text-sm text-[#EDE8DD] truncate">
              AI Tutor
            </h1>
            <span className="flex items-center gap-1 text-[10px] font-mono tracking-wide text-[#B8935A] bg-[#C9A24B14] px-2 py-0.5 rounded-sm border border-[#C9A24B33] shrink-0">
              <activeTopic.icon size={10} strokeWidth={2} />
              <span className="truncate max-w-[80px]">{topic}</span>
            </span>
          </div>
          <button
            onClick={handleNewChat}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[#8B93A1] hover:text-[#E4C878] hover:bg-[#151A2280] transition-colors shrink-0"
            title="ถามคำถามใหม่"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </header>

        {/* ── Desktop Header ── */}
        <header className="hidden md:flex h-[68px] shrink-0 border-b border-[#22283349] px-8 items-center justify-between bg-[#0B0E13]/80 backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7FA88C] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7FA88C]" />
            </span>
            <h1 className="font-display text-[15px] text-[#EDE8DD]">
              AI Tutor Assistant
            </h1>
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

        {/* ── Messages Box ── */}
        <div className="study-scroll flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-[#5C6472] gap-4">
              <div className="w-16 h-16 rounded-full border border-[#2A3140] flex items-center justify-center text-[#8B6F2E] bg-[#0E1218]">
                <BookOpen size={26} strokeWidth={1.5} />
              </div>
              <p className="font-sans text-sm text-center max-w-xs px-4">
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
                <div className="flex items-start gap-2.5 md:gap-3 justify-end">
                  <div className="bg-gradient-to-br from-[#C9A24B22] to-[#C9A24B0d] border border-[#C9A24B3d] text-[#EDE8DD] rounded-2xl rounded-tr-sm px-3.5 py-2.5 md:px-4 md:py-3 max-w-[88%] md:max-w-xl text-sm font-sans leading-relaxed shadow-[0_4px_24px_-8px_rgba(201,162,75,0.15)]">
                    {msg.question}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#1C2330] border border-[#C9A24B4d] flex items-center justify-center text-[#E4C878] shrink-0 font-display text-xs">
                    S
                  </div>
                </div>

                {/* Answer (AI) */}
                {(msg.answer || showAiThinking) && (
                  <div className="flex items-start gap-2.5 md:gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-[#151A22] border border-[#2A3140] flex items-center justify-center text-[#8B93A1] shrink-0 font-display text-xs">
                      T
                    </div>
                    <div className="bg-[#151A22] border-l-2 border-l-[#C9A24B66] border-y border-r border-y-[#22283349] border-r-[#22283349] text-[#D8D3C6] rounded-xl rounded-tl-sm px-3.5 py-2.5 md:px-4 md:py-3 max-w-[88%] md:max-w-2xl text-sm leading-relaxed font-sans markdown-body">
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

        {/* ── Input Form (sticky bottom) ── */}
        <footer className="shrink-0 sticky bottom-0 border-t border-[#22283349] bg-[#0B0E13]/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)]">
          <div className="px-3 py-3 md:px-5 md:py-4">
            <form
              onSubmit={handleSend}
              className="flex gap-2 md:gap-2.5 max-w-3xl mx-auto items-center"
            >
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`ถามคำถามเกี่ยวกับ ${topic}...`}
                className="flex-1 min-w-0 bg-[#151A22] border border-[#2A3140] rounded-lg px-3.5 py-2.5 md:px-4 md:py-3 text-sm font-sans focus:outline-none focus:border-[#C9A24B80] focus:ring-1 focus:ring-[#C9A24B33] text-[#EDE8DD] placeholder-[#5C6472] transition-colors"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="bg-[#C9A24B] hover:bg-[#E4C878] disabled:bg-[#151A22] disabled:text-[#3d4353] disabled:border disabled:border-[#2A3140] text-[#0B0E13] px-4 py-2.5 md:px-5 md:py-3 rounded-lg transition-colors flex items-center gap-1.5 md:gap-2 font-medium text-sm font-sans shrink-0"
              >
                <Send size={16} strokeWidth={2} />
                <span className="hidden sm:inline">ส่ง</span>
              </button>
            </form>
          </div>
        </footer>
      </main>
    </div>
  );
}
