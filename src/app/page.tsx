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
import ThemeSwitcher, { ThemeMode, THEME_CONFIG, getInitialTheme } from '@/components/ThemeSwitcher';

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

const THEME_STORAGE_KEY = 'ai-tutor-theme';

export default function Home() {
  const [token, setToken] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [topic, setTopic] = useState('Web Development');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyList, setHistoryList] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const formatAuthHeader = (authToken: string) => {
    if (!authToken) return '';
    return authToken.startsWith('Bearer ') ? authToken : `Bearer ${authToken}`;
  };

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, currentTheme);
  }, [currentTheme]);

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
  const themeStyles = THEME_CONFIG[currentTheme] || THEME_CONFIG.dark;

  /* ───────── Sidebar Content (shared by desktop & mobile) ───────── */
  const sidebarContent = (compact: boolean) => (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 10%, var(--accent) 0, transparent 45%)',
        }}
      />

      <div className="relative flex flex-col h-full min-h-0">
        {/* Header */}
        <div
          className={`flex items-center gap-3 mb-6 shrink-0 ${
            compact ? '' : 'justify-center'
          }`}
        >
          <div className="w-10 h-10 rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] flex items-center justify-center text-[var(--accent-hover)] bg-[var(--bg-input)] shrink-0 transition-colors duration-200">
            <GraduationCap size={20} strokeWidth={1.75} />
          </div>
          {compact && (
            <div>
              <div className="font-display text-lg leading-none text-[var(--text-main)] transition-colors duration-200">
                AI Tutor
              </div>
              <div className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-subtle)] uppercase mt-1 transition-colors duration-200">
                Private Study
              </div>
            </div>
          )}
        </div>

        {/* Desktop Toggle Button */}
        {!compact && (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute top-0 right-0 z-10 w-8 h-8 flex items-center justify-center rounded-md text-[var(--text-subtle)] hover:text-[var(--accent-hover)] hover:bg-[var(--bg-input)] transition-colors duration-200 -mr-1 -mt-1"
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
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] font-medium py-2.5 px-4 transition-colors duration-200 mb-6 text-sm shrink-0 shadow-md"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>ถามคำถามใหม่</span>
          </button>
        ) : (
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] py-2.5 transition-colors duration-200 mb-6 shrink-0 shadow-md"
            title="ถามคำถามใหม่"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        )}

        {/* Topics Section */}
        <div className={`${compact ? 'mb-6' : 'mb-4'} shrink-0`}>
          {compact && (
            <div className="mb-2">
              <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-subtle)] uppercase transition-colors duration-200">
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
                  className={`w-full flex items-center rounded-md text-xs text-left transition-all duration-200 border-l-2 ${
                    compact
                      ? 'gap-2.5 px-3 py-2'
                      : 'justify-center px-0 py-2'
                  } ${
                    active
                      ? 'bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] border-[var(--accent)] text-[var(--accent-hover)]'
                      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)]'
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
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden border-t border-[var(--border-primary)] pt-4 transition-colors duration-200">
          {compact && (
            <div className="flex items-center gap-1.5 mb-2.5 shrink-0 text-[var(--text-subtle)] transition-colors duration-200">
              <History size={13} />
              <span className="font-mono text-[10px] tracking-[0.2em] uppercase">
                ประวัติการถาม
              </span>
            </div>
          )}

          <div className="study-scroll flex-1 overflow-y-auto space-y-1 pr-1">
            {historyList.length === 0 ? (
              compact && (
                <div className="text-[11px] text-[var(--text-subtle)] italic py-2 transition-colors duration-200">
                  ยังไม่มีประวัติการถาม
                </div>
              )
            ) : (
              historyList.map((item, idx) => (
                <button
                  key={item._id || idx}
                  onClick={() => handleSelectHistoryItem(item)}
                  title={item.question}
                  className={`w-full flex items-center rounded-md text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-input)] transition-colors duration-200 text-left group ${
                    compact
                      ? 'gap-2 px-2.5 py-2'
                      : 'justify-center px-0 py-2'
                  }`}
                >
                  <MessageSquare
                    size={13}
                    className="shrink-0 text-[var(--text-subtle)] group-hover:text-[var(--accent)] transition-colors duration-200"
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
      <div className="relative pt-4 border-t border-[var(--border-primary)] shrink-0 transition-colors duration-200">
        <button
          onClick={handleLogout}
          title="ออกจากระบบ"
          className={`w-full flex items-center text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors duration-200 ${
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
    <div className={`${currentTheme} flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans antialiased overflow-hidden transition-colors duration-200`}>
      {/* ═══════════ DESKTOP SIDEBAR (md+) ═══════════ */}
      <aside
        className={`shrink-0 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] hidden md:flex md:flex-col justify-between relative transition-all duration-300 ease-in-out overflow-hidden ${
          isSidebarOpen ? 'w-72 p-5' : 'w-16 p-3'
        }`}
      >
        {sidebarContent(isSidebarOpen)}
      </aside>

      {/* ═══════════ MOBILE SIDEBAR OVERLAY ═══════════ */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isMobileSidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileSidebarOpen(false)}
      />
      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-primary)] flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="absolute top-3 right-3 z-10 w-10 h-10 flex items-center justify-center rounded-md text-[var(--text-subtle)] hover:text-[var(--accent-hover)] hover:bg-[var(--bg-input)] transition-colors duration-200"
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
        <header className="md:hidden relative shrink-0 h-14 border-b border-[var(--border-primary)] px-4 flex items-center gap-3 bg-[var(--bg-header)]/90 backdrop-blur z-50 transition-colors duration-200">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-hover)] hover:bg-[var(--bg-input)] transition-colors duration-200 shrink-0"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--online)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--online)]" />
            </span>
            <h1 className="font-display text-sm text-[var(--text-main)] truncate transition-colors duration-200">
              AI Tutor
            </h1>
            <span className="flex items-center gap-1 text-[10px] font-mono tracking-wide text-[var(--accent-muted)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2 py-0.5 rounded-sm border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] shrink-0 transition-colors duration-200">
              <activeTopic.icon size={10} strokeWidth={2} />
              <span className="truncate max-w-[80px]">{topic}</span>
            </span>
          </div>
          <ThemeSwitcher current={currentTheme} onChange={setCurrentTheme} />
          <button
            onClick={handleNewChat}
            className="w-11 h-11 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-hover)] hover:bg-[var(--bg-input)] transition-colors duration-200 shrink-0"
            title="ถามคำถามใหม่"
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </header>

        {/* ── Desktop Header ── */}
        <header className="hidden md:flex relative h-[68px] shrink-0 border-b border-[var(--border-primary)] px-8 items-center justify-between bg-[var(--bg-header)]/80 backdrop-blur z-50 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--online)] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--online)]" />
            </span>
            <h1 className="font-display text-[15px] text-[var(--text-main)] transition-colors duration-200">
              AI Tutor Assistant
            </h1>
            <span className="flex items-center gap-1.5 text-[11px] font-mono tracking-wide text-[var(--accent-muted)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2.5 py-1 rounded-sm border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-colors duration-200">
              <activeTopic.icon size={12} strokeWidth={2} />
              {topic}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeSwitcher current={currentTheme} onChange={setCurrentTheme} />
            <button
              onClick={handleNewChat}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--accent-hover)] bg-[var(--bg-input)] border border-[var(--border-input)] hover:border-[color-mix(in_srgb,var(--accent)_40%,transparent)] px-3 py-1.5 rounded-md transition-all duration-200"
            >
              <Plus size={14} />
              <span>หน้าถามใหม่</span>
            </button>
          </div>
        </header>

        {/* ── Messages Box ── */}
        <div
          className={`study-scroll flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-6 md:space-y-8 relative z-0 ${
            themeStyles.bgImage ? 'bg-cover bg-center bg-no-repeat' : ''
          }`}
          style={{
            backgroundImage: themeStyles.bgImage
              ? `url('${themeStyles.bgImage}')`
              : 'none',
          }}
        >
          {/* Overlay — only shown when bgImage exists */}
          {themeStyles.bgImage && (
            <div className={`absolute inset-0 ${themeStyles.overlay} pointer-events-none z-0 transition-colors duration-200`} />
          )}

          {/* Chat content above overlay */}
          <div className="relative z-[1] space-y-6 md:space-y-8">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-[var(--text-subtle)] gap-4 transition-colors duration-200">
                <div className="w-16 h-16 rounded-full border border-[var(--border-input)] flex items-center justify-center text-[var(--accent-subtle)] bg-[var(--bg-sidebar)] transition-colors duration-200">
                  <BookOpen size={26} strokeWidth={1.5} />
                </div>
                <p className="font-sans text-sm text-center max-w-xs px-4">
                  เริ่มต้นพิมพ์คำถามเกี่ยวกับ{' '}
                  <span className="text-[var(--accent-muted)]">{topic}</span> ได้เลยครับ
                </p>
              </div>
            )}

            {messages.map((msg, index) => {
              const isLastMessage = index === messages.length - 1;
              const showAiThinking = isLastMessage && loading && !msg.answer;

              return (
                <div key={msg._id || `msg-${index}`} className="space-y-4 rise-in">
                  {index > 0 && (
                    <div className="flex items-center gap-3 max-w-2xl mx-auto opacity-40">
                      <div className="h-px flex-1 bg-[var(--border-separator)] transition-colors duration-200" />
                      <span className="text-[var(--accent-subtle)] text-xs transition-colors duration-200">✦</span>
                      <div className="h-px flex-1 bg-[var(--border-separator)] transition-colors duration-200" />
                    </div>
                  )}

                  {/* Question (User) */}
                  <div className="flex items-start gap-2.5 md:gap-3 justify-end">
                    <div className="bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_13%,transparent)] to-[color-mix(in_srgb,var(--accent)_5%,transparent)] border border-[color-mix(in_srgb,var(--accent)_24%,transparent)] text-[var(--text-main)] rounded-2xl rounded-tr-sm px-3.5 py-2.5 md:px-4 md:py-3 max-w-[88%] md:max-w-xl text-sm font-sans leading-relaxed shadow-[0_4px_24px_-8px_color-mix(in_srgb,var(--accent)_15%,transparent)] transition-colors duration-200">
                      {msg.question}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-[var(--bg-bubble-user)] border border-[color-mix(in_srgb,var(--accent)_30%,transparent)] flex items-center justify-center text-[var(--accent-hover)] shrink-0 font-display text-xs transition-colors duration-200">
                      S
                    </div>
                  </div>

                  {/* Answer (AI) */}
                  {(msg.answer || showAiThinking) && (
                    <div className="flex items-start gap-2.5 md:gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-input)] border border-[var(--border-input)] flex items-center justify-center text-[var(--text-muted)] shrink-0 font-display text-xs transition-colors duration-200">
                        T
                      </div>
                      <div className="bg-[var(--bg-input)] border-l-2 border-l-[color-mix(in_srgb,var(--accent)_40%,transparent)] border-y border-r border-y-[var(--border-primary)] border-r-[var(--border-primary)] text-[var(--text-secondary)] rounded-xl rounded-tl-sm px-3.5 py-2.5 md:px-4 md:py-3 max-w-[88%] md:max-w-2xl text-sm leading-relaxed font-sans markdown-body transition-colors duration-200">
                        {msg.answer ? (
                          <ReactMarkdown>{msg.answer}</ReactMarkdown>
                        ) : (
                          <span className="flex items-center gap-1.5 text-[var(--text-subtle)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-muted)] animate-pulse" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-muted)] animate-pulse delay-75" />
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-muted)] animate-pulse delay-150" />
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
        </div>

        {/* ── Input Form (sticky bottom) ── */}
        <footer className="shrink-0 sticky bottom-0 border-t border-[var(--border-primary)] bg-[var(--bg-header)]/90 backdrop-blur-md pb-[env(safe-area-inset-bottom)] transition-colors duration-200">
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
                className="flex-1 min-w-0 bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-3.5 py-2.5 md:px-4 md:py-3 text-sm font-sans focus:outline-none focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] text-[var(--text-main)] placeholder-[var(--text-subtle)] transition-colors duration-200"
              />
              <button
                type="submit"
                disabled={loading || !prompt.trim()}
                className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--bg-input)] disabled:text-[var(--text-subtle)] disabled:border disabled:border-[var(--border-input)] text-[var(--text-on-accent)] px-4 py-2.5 md:px-5 md:py-3 rounded-lg transition-colors duration-200 flex items-center gap-1.5 md:gap-2 font-medium text-sm font-sans shrink-0"
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
