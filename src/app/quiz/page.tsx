'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Home,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
  Globe,
  Code2,
  Database,
  ShieldCheck,
  Zap,
  Brain,
  Target,
  ArrowRight,
} from 'lucide-react';
import ThemeSwitcher, {
  ThemeMode,
  getInitialTheme,
} from '@/components/ThemeSwitcher';

interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

type QuizState = 'setup' | 'playing' | 'result';

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: Brain },
  { id: 'Web Development', label: 'Web Dev', icon: Globe },
  { id: 'Programming', label: 'Programming', icon: Code2 },
  { id: 'Database', label: 'Database', icon: Database },
  { id: 'Cyber Security', label: 'Security', icon: ShieldCheck },
] as const;

const DIFFICULTIES = [
  { id: 'easy', label: 'ง่าย', color: 'text-green-400', border: 'border-green-500/40', bg: 'bg-green-500/10' },
  { id: 'medium', label: 'ปานกลาง', color: 'text-amber-400', border: 'border-amber-500/40', bg: 'bg-amber-500/10' },
  { id: 'hard', label: 'ยาก', color: 'text-red-400', border: 'border-red-500/40', bg: 'bg-red-500/10' },
] as const;

const OPTION_LABELS = ['A', 'B', 'C', 'D'] as const;

const QUIZ_BANK: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'CSS ใดต่อไปนี้ใช้ทำ Responsive Design ได้ดีที่สุด?',
    options: ['固定 width', 'Media Queries', '!important', 'inline style'],
    correctIndex: 1,
    category: 'Web Development',
    difficulty: 'easy',
    explanation: 'Media Queries ทำให้ CSS ตอบสนองตามขนาดหน้าจอ ใช้ร่วมกับ breakpoint ต่างๆ',
  },
  {
    id: 'q2',
    question: 'ใน JavaScript "===" ต่างจาก "==" อย่างไร?',
    options: [
      'ไม่ต่างกัน',
      '=== เปรียบเทียบค่า + ชนิดข้อมูล',
      '== เร็วกว่า',
      '=== ใช้สำหรับ string เท่านั้น',
    ],
    correctIndex: 1,
    category: 'Programming',
    difficulty: 'easy',
    explanation: '=== Strict Equality ตรวจสอบทั้งค่าและชนิดข้อมูล โดยไม่ทำ type coercion',
  },
  {
    id: 'q3',
    question: 'SQL คำสั่งใดใช้ดึงข้อมูลจากหลายตาราง?',
    options: ['SELECT', 'JOIN', 'UPDATE', 'DELETE'],
    correctIndex: 1,
    category: 'Database',
    difficulty: 'easy',
    explanation: 'JOIN ใช้เชื่อมข้อมูลจากหลายตาราง เช่น INNER JOIN, LEFT JOIN',
  },
  {
    id: 'q4',
    question: 'SQL Injection ป้องกันได้ดีที่สุดวิธีใด?',
    options: [
      'ใช้ firewall',
      'Parameterized Query / Prepared Statement',
      'ซ่อน URL',
      'ใช้ HTTP แทน HTTPS',
    ],
    correctIndex: 1,
    category: 'Cyber Security',
    difficulty: 'medium',
    explanation: 'Parameterized Query แยก SQL code ออกจาก input data ทำให้แทรกคำสั่ง SQL ไม่ได้',
  },
  {
    id: 'q5',
    question: 'Virtual DOM ใน React ทำหน้าที่อะไร?',
    options: [
      'แทน DOM จริงบน Server',
      'เก็บ state ของ component',
      'เปรียบเทียบและอัปเดต DOM จริงอย่างมีประสิทธิภาพ',
      'แปลง JSX เป็น HTML',
    ],
    correctIndex: 2,
    category: 'Web Development',
    difficulty: 'medium',
    explanation: 'Virtual DOM ช่วยลดการเข้าถึง DOM จริงโดยเปรียบเทียบ (diff) ก่อน update เฉพาะส่วนที่เปลี่ยน',
  },
  {
    id: 'q6',
    question: 'O(n log n) เร็วกว่า O(n²) ในกรณีใด?',
    options: [
      'ข้อมูลน้อย',
      'ข้อมูลเยอะ',
      'เร็วกว่าเสมอในทุกกรณี',
      'ไม่ต่างกัน',
    ],
    correctIndex: 2,
    category: 'Programming',
    difficulty: 'medium',
    explanation: 'O(n log n) Efficient กว่า O(n²) เสมอเมื่อ n มีค่ามากๆ เช่น Merge Sort เร็วกว่า Bubble Sort',
  },
  {
    id: 'q7',
    question: 'JWT Token ประกอบด้วยกี่ส่วนหลัก?',
    options: ['2', '3', '4', '5'],
    correctIndex: 1,
    category: 'Web Development',
    difficulty: 'medium',
    explanation: 'JWT ประกอบด้วย 3 ส่วน: Header (algorithm), Payload (data), Signature (verification)',
  },
  {
    id: 'q8',
    question: 'NoSQL ตัวใดเป็น Document-based Database?',
    options: ['Redis', 'MongoDB', 'Neo4j', 'MySQL'],
    correctIndex: 1,
    category: 'Database',
    difficulty: 'medium',
    explanation: 'MongoDB เก็บข้อมูลในรูปแบบ BSON Document ไม่จำเป็นต้องมี schema ตายตัว',
  },
  {
    id: 'q9',
    question: 'XSS ย่อมาจากอะไร?',
    options: [
      'Cross-Site Scripting',
      'XML Style Sheet',
      'Extended Server Security',
      'Cross-System Sharing',
    ],
    correctIndex: 0,
    category: 'Cyber Security',
    difficulty: 'easy',
    explanation: 'XSS = Cross-Site Scripting เป็นการโจมตีที่ฝัง恶意 script ลงในหน้าเว็บ',
  },
  {
    id: 'q10',
    question: 'ACID ตัว "I" ย่อมาจากอะไร?',
    options: ['Integration', 'Isolation', 'Integrity', 'Index'],
    correctIndex: 1,
    category: 'Database',
    difficulty: 'hard',
    explanation: 'Isolation หมายถึง Transaction แต่ละตัวทำงานแยกจากกัน ไม่ส่งผลกระทบซึ่งกันและกัน',
  },
  {
    id: 'q11',
    question: 'Closure ใน JavaScript หมายถึงอะไร?',
    options: [
      'การปิด Browser',
      'ฟังก์ชันที่เข้าถึง variable จาก scope ภายนอกได้',
      'การปิดการใช้งาน Event',
      'การจบ Loop',
    ],
    correctIndex: 1,
    category: 'Programming',
    difficulty: 'medium',
    explanation: 'Closure คือฟังก์ชันที่ remember ตัวแปรจาก lexical scope ของมันแม้จะถูกเรียกจากที่อื่น',
  },
  {
    id: 'q12',
    question: 'CSRF ป้องกันได้ด้วยวิธีใด?',
    options: [
      'ใช้ HTTPS',
      'CSRF Token + SameSite Cookie',
      'ตั้ง password ยาวๆ',
      'ปิด JavaScript',
    ],
    correctIndex: 1,
    category: 'Cyber Security',
    difficulty: 'hard',
    explanation: 'CSRF Token ยืนยันว่า Request มาจากหน้าเว็บจริง SameSite Cookie ป้องกันการส่ง Cookie ข้าม Origin',
  },
  {
    id: 'q13',
    question: 'React Hook ใดใช้จัดการ Side Effect?',
    options: ['useState', 'useEffect', 'useRef', 'useMemo'],
    correctIndex: 1,
    category: 'Web Development',
    difficulty: 'easy',
    explanation: 'useEffect ใช้รันโค้ดเมื่อ component mount, update, หรือ unmount เหมาะกับ API calls, subscriptions',
  },
  {
    id: 'q14',
    question: 'Stored Procedure ต่างจาก Function ใน DB อย่างไร?',
    options: [
      'ไม่ต่างกัน',
      'Stored Procedure ไม่คืนค่า ใช้ทำ logic; Function คืนค่า ใช้ใน query ได้',
      'Function ช้ากว่า',
      'Stored Procedure ใช้ได้เฉพาะ MySQL',
    ],
    correctIndex: 1,
    category: 'Database',
    difficulty: 'hard',
    explanation: 'Stored Procedure ใช้ executes logic ไม่คืนค่า ส่วน Function คืน single value ใช้ใน SELECT ได้',
  },
  {
    id: 'q15',
    question: 'Recursion ที่ดีต้องมีอะไร?',
    options: [
      'Loop ซ้อน',
      'Base Case เพื่อหยุดการเรียกซ้ำ',
      'Global Variable',
      'try-catch',
    ],
    correctIndex: 1,
    category: 'Programming',
    difficulty: 'easy',
    explanation: 'Base Case คือจุดที่ recursion หยุด ป้องกัน infinite loop และ stack overflow',
  },
  {
    id: 'q16',
    question: 'HTTPS ต่างจาก HTTP อย่างไร?',
    options: [
      'เร็วกว่า',
      'เข้ารหัสข้อมูลด้วย TLS/SSL',
      'ใช้ Port 80',
      'ไม่ต้องใช้ Domain',
    ],
    correctIndex: 1,
    category: 'Cyber Security',
    difficulty: 'easy',
    explanation: 'HTTPS เข้ารหัสข้อมูลด้วย TLS/SSL ป้องกัน Man-in-the-Middle Attack',
  },
  {
    id: 'q17',
    question: 'Promise.all() ทำหน้าที่อะไร?',
    options: [
      'รัน Promise ทีละตัว',
      'รอ Promise ทุกตัวสำเร็จพร้อมกัน',
      'ยกเลิก Promise',
      'สร้าง Promise ใหม่',
    ],
    correctIndex: 1,
    category: 'Programming',
    difficulty: 'medium',
    explanation: 'Promise.all() รอให้ Promise ทุกตัว resolve แล้วคืน array ผลลัพธ์ ถ้าตัวใด reject ก็จะ fail ทั้งหมด',
  },
  {
    id: 'q18',
    question: 'Database Normalization ทำไปเพื่ออะไร?',
    options: [
      'เพิ่มความเร็ว Query ทุกครั้ง',
      'ลดความซ้ำซ้อนของข้อมูล',
      'ลบ Table ที่ไม่ใช้',
      'เพิ่ม RAM ให้ DB',
    ],
    correctIndex: 1,
    category: 'Database',
    difficulty: 'medium',
    explanation: 'Normalization จัดข้อมูลให้ไม่ซ้ำซ้อน แบ่งเป็นหลายตารางตามหลัก 1NF-3NF',
  },
  {
    id: 'q19',
    question: 'async/await ใช้ทำอะไร?',
    options: [
      'สร้าง Thread ใหม่',
      'จัดการ Promise ให้อ่านง่ายขึ้น',
      'เร่งความเร็ว JavaScript',
      'สร้าง HTML element',
    ],
    correctIndex: 1,
    category: 'Programming',
    difficulty: 'medium',
    explanation: 'async/await เป็น syntax sugar สำหรับ Promise ทำให้โค้ด asynchronous อ่านง่ายเหมือน synchronous',
  },
  {
    id: 'q20',
    question: 'Zero Trust Architecture หมายถึง?',
    options: [
      'ไม่ต้องใช้ Password',
      'ไว้ใจทุกคนในเครือข่าย',
      'ยืนยันตัวตนทุกครั้ง ไม่ว่าจะอยู่ที่ไหน',
      'ปิด Firewall ทั้งหมด',
    ],
    correctIndex: 2,
    category: 'Cyber Security',
    difficulty: 'hard',
    explanation: 'Zero Trust คือโมเดลที่ "ไม่ไว้ใจ任何人" ต้อง verify ทุก Request แม้จะอยู่ใน network เดียวกัน',
  },
];

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function QuizPage() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark');
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

  useEffect(() => {
    if (quizState === 'playing' && !isAnswered) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [quizState, isAnswered, currentQIndex]);

  const startQuiz = useCallback(() => {
    let filtered = [...QUIZ_BANK];
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((q) => q.category === selectedCategory);
    }
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter((q) => q.difficulty === selectedDifficulty);
    }
    const shuffled = filtered.sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, Math.min(10, shuffled.length)));
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setAnswers([]);
    setTimer(0);
    setQuizState('playing');
  }, [selectedCategory, selectedDifficulty]);

  const handleAnswer = useCallback(() => {
    if (selectedOption === null) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setIsAnswered(true);
    const isCorrect = selectedOption === questions[currentQIndex].correctIndex;
    if (isCorrect) setScore((s) => s + 1);
    setAnswers((prev) => [...prev, selectedOption]);
  }, [selectedOption, currentQIndex, questions]);

  const handleNext = useCallback(() => {
    if (currentQIndex + 1 >= questions.length) {
      setQuizState('result');
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setCurrentQIndex((i) => i + 1);
    setSelectedOption(null);
    setIsAnswered(false);
  }, [currentQIndex, questions.length]);

  const handleRetry = useCallback(() => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentQIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setAnswers([]);
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const currentQuestion = questions[currentQIndex];
  const progress = questions.length > 0 ? ((currentQIndex + 1) / questions.length) * 100 : 0;
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  const categoryInfo = CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <div
      className={`${currentTheme} flex flex-col h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans antialiased overflow-hidden transition-colors duration-200`}
    >
      {/* ── Header ── */}
      <header className="shrink-0 h-14 md:h-[68px] border-b border-[var(--border-primary)] px-4 md:px-8 flex items-center justify-between bg-[var(--bg-header)]/90 backdrop-blur z-50 transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-hover)] hover:bg-[var(--bg-input)] transition-colors duration-200"
            title="กลับหน้าหลัก"
          >
            <Home size={18} strokeWidth={1.75} />
          </Link>
          <div className="h-5 w-px bg-[var(--border-primary)]" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] flex items-center justify-center text-[var(--accent-hover)] bg-[var(--bg-input)] transition-colors duration-200">
              <GraduationCap size={14} strokeWidth={1.75} />
            </div>
            <h1 className="font-display text-sm md:text-[15px] text-[var(--text-main)] transition-colors duration-200">
              Quiz
            </h1>
          </div>
          {quizState === 'playing' && (
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono tracking-wide text-[var(--accent-muted)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2.5 py-1 rounded-sm border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-colors duration-200">
              <Target size={10} strokeWidth={2} />
              {currentQIndex + 1}/{questions.length}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {quizState === 'playing' && (
            <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--text-muted)] bg-[var(--bg-input)] border border-[var(--border-input)] px-2.5 py-1.5 rounded-lg transition-colors duration-200">
              <Clock size={13} strokeWidth={1.75} />
              {formatTime(timer)}
            </div>
          )}
          <ThemeSwitcher current={currentTheme} onChange={setCurrentTheme} />
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        {/* ═══ SETUP SCREEN ═══ */}
        {quizState === 'setup' && (
          <div className="w-full max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] flex items-center justify-center text-[var(--accent-hover)] bg-[var(--bg-input)] mx-auto mb-4 transition-colors duration-200">
                <Brain size={26} strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-[var(--text-main)] transition-colors duration-200">
                แบบทดสอบวัดความรู้
              </h2>
              <p className="text-sm text-[var(--text-subtle)] font-sans transition-colors duration-200">
                เลือกหมวดหมู่และระดับความยาก แล้วเริ่มทำแบบทดสอบได้เลย
              </p>
            </div>

            {/* Category Selection */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] transition-colors duration-200">
                เลือกหมวดหมู่
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {CATEGORIES.map(({ id, label, icon: Icon }) => {
                  const active = id === selectedCategory;
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedCategory(id)}
                      className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-sans border transition-all duration-200 ${
                        active
                          ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-[var(--accent-hover)]'
                          : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[color-mix(in_srgb,var(--accent)_25%,transparent)]'
                      }`}
                    >
                      <Icon size={14} strokeWidth={1.75} />
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-3">
              <label className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] transition-colors duration-200">
                ระดับความยาก
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => setSelectedDifficulty('all')}
                  className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-sans border transition-all duration-200 ${
                    selectedDifficulty === 'all'
                      ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-[var(--accent-hover)]'
                      : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[color-mix(in_srgb,var(--accent)_25%,transparent)]'
                  }`}
                >
                  <Zap size={14} strokeWidth={1.75} />
                  ทุกระดับ
                </button>
                {DIFFICULTIES.map(({ id, label }) => (
                  <button
                    key={id}
                    onClick={() => setSelectedDifficulty(id)}
                    className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-sans border transition-all duration-200 ${
                      selectedDifficulty === id
                        ? `bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-[var(--accent-hover)]`
                        : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[color-mix(in_srgb,var(--accent)_25%,transparent)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] font-medium py-3 rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2"
            >
              เริ่มทำแบบทดสอบ
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </div>
        )}

        {/* ═══ PLAYING SCREEN ═══ */}
        {quizState === 'playing' && currentQuestion && (
          <div className="w-full max-w-2xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="h-1.5 bg-[var(--bg-input)] rounded-full overflow-hidden transition-colors duration-200">
                <div
                  className="h-full bg-[var(--accent)] rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-[var(--text-subtle)] transition-colors duration-200">
                <span>
                  ข้อ {currentQIndex + 1} / {questions.length}
                </span>
                <span className="flex items-center gap-1">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] ${
                      currentQuestion.difficulty === 'easy'
                        ? 'bg-green-500/10 text-green-400'
                        : currentQuestion.difficulty === 'medium'
                        ? 'bg-amber-500/10 text-amber-400'
                        : 'bg-red-500/10 text-red-400'
                    }`}
                  >
                    {currentQuestion.difficulty === 'easy'
                      ? 'ง่าย'
                      : currentQuestion.difficulty === 'medium'
                      ? 'ปานกลาง'
                      : 'ยาก'}
                  </span>
                </span>
              </div>
            </div>

            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-[0.1em] uppercase text-[var(--accent-muted)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2 py-0.5 rounded-sm border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-colors duration-200">
                {currentQuestion.category}
              </span>
            </div>

            {/* Question */}
            <div className="bg-[var(--bg-sidebar)] border border-[var(--border-input)] rounded-2xl p-5 md:p-7 transition-colors duration-200">
              <h3 className="font-sans text-base md:text-lg text-[var(--text-main)] leading-relaxed transition-colors duration-200">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQuestion.correctIndex;
                const showResult = isAnswered;

                let optionStyle = '';
                if (showResult) {
                  if (isCorrect) {
                    optionStyle =
                      'bg-green-500/10 border-green-500/40 text-green-300';
                  } else if (isSelected && !isCorrect) {
                    optionStyle =
                      'bg-red-500/10 border-red-500/40 text-red-300';
                  } else {
                    optionStyle =
                      'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] opacity-50';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-[var(--accent-hover)]';
                } else {
                  optionStyle =
                    'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[color-mix(in_srgb,var(--accent)_25%,transparent)]';
                }

                return (
                  <button
                    key={idx}
                    onClick={() => !isAnswered && setSelectedOption(idx)}
                    disabled={isAnswered}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-sans border text-left transition-all duration-200 ${optionStyle}`}
                  >
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-medium shrink-0 border border-current/20">
                      {OPTION_LABELS[idx]}
                    </span>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2
                        size={16}
                        strokeWidth={2}
                        className="text-green-400 shrink-0"
                      />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle
                        size={16}
                        strokeWidth={2}
                        className="text-red-400 shrink-0"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation (after answer) */}
            {isAnswered && (
              <div className="bg-[color-mix(in_srgb,var(--accent)_5%,transparent)] border border-[color-mix(in_srgb,var(--accent)_15%,transparent)] rounded-xl p-4 transition-colors duration-200 rise-in">
                <p className="text-xs text-[var(--text-secondary)] font-sans leading-relaxed transition-colors duration-200">
                  <span className="text-[var(--accent-muted)] font-medium">
                    คำอธิบาย:
                  </span>{' '}
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2 pb-4">
              {!isAnswered ? (
                <button
                  onClick={handleAnswer}
                  disabled={selectedOption === null}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--bg-input)] disabled:text-[var(--text-subtle)] disabled:border disabled:border-[var(--border-input)] text-[var(--text-on-accent)] px-5 py-2.5 rounded-xl transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                >
                  ยืนยันคำตอบ
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] px-5 py-2.5 rounded-xl transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                >
                  {currentQIndex + 1 >= questions.length ? (
                    'ดูผลลัพธ์'
                  ) : (
                    <>
                      ข้อถัดไป
                      <ChevronRight size={16} strokeWidth={2} />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

        {/* ═══ RESULT SCREEN ═══ */}
        {quizState === 'result' && (
          <div className="w-full max-w-2xl mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col gap-8">
            {/* Score Card */}
            <div className="bg-[var(--bg-sidebar)] border border-[var(--border-input)] rounded-2xl p-6 md:p-8 text-center space-y-5 transition-colors duration-200">
              <div className="w-16 h-16 rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] flex items-center justify-center text-[var(--accent-hover)] bg-[var(--bg-input)] mx-auto transition-colors duration-200">
                <Trophy size={28} strokeWidth={1.5} />
              </div>
              <h2 className="font-display text-xl md:text-2xl text-[var(--text-main)] transition-colors duration-200">
                ผลลัพธ์แบบทดสอบ
              </h2>

              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-display text-[var(--accent-hover)] transition-colors duration-200">
                    {percentage}%
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-subtle)] mt-1 uppercase tracking-wider transition-colors duration-200">
                    คะแนนรวม
                  </div>
                </div>
                <div className="h-12 w-px bg-[var(--border-primary)]" />
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-display text-green-400 transition-colors duration-200">
                    {score}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-subtle)] mt-1 uppercase tracking-wider transition-colors duration-200">
                    ถูก {score}/{questions.length}
                  </div>
                </div>
                <div className="h-12 w-px bg-[var(--border-primary)]" />
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-display text-[var(--text-muted)] transition-colors duration-200">
                    {formatTime(timer)}
                  </div>
                  <div className="text-[11px] font-mono text-[var(--text-subtle)] mt-1 uppercase tracking-wider transition-colors duration-200">
                    เวลาที่ใช้
                  </div>
                </div>
              </div>
            </div>

            {/* Answer Review */}
            <div className="space-y-3">
              <h3 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] transition-colors duration-200">
                รายละเอียดคำตอบ
              </h3>
              <div className="space-y-2">
                {questions.map((q, idx) => {
                  const userAnswer = answers[idx];
                  const isCorrect = userAnswer === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-xl border transition-colors duration-200 ${
                        isCorrect
                          ? 'bg-green-500/5 border-green-500/20'
                          : 'bg-red-500/5 border-red-500/20'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                            isCorrect
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 size={14} strokeWidth={2} />
                          ) : (
                            <XCircle size={14} strokeWidth={2} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-[var(--text-main)] font-sans leading-relaxed transition-colors duration-200">
                            {q.question}
                          </p>
                          <div className="mt-1.5 text-xs font-mono text-[var(--text-subtle)] transition-colors duration-200">
                            {isCorrect ? (
                              <span className="text-green-400">
                                ตอบถูก ✓ {OPTION_LABELS[userAnswer ?? 0]}: {q.options[q.correctIndex]}
                              </span>
                            ) : (
                              <span>
                                <span className="text-red-400">
                                  ตอบผิด ✗ {OPTION_LABELS[userAnswer ?? 0]}: {userAnswer !== null ? q.options[userAnswer] : '-'}
                                </span>
                                <span className="mx-2 text-[var(--border-input)]">→</span>
                                <span className="text-green-400">
                                  ✓ {OPTION_LABELS[q.correctIndex]}: {q.options[q.correctIndex]}
                                </span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Retry Button */}
            <div className="flex items-center gap-3 pb-6">
              <button
                onClick={handleRetry}
                className="flex-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] font-medium py-3 rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2"
              >
                <RotateCcw size={15} strokeWidth={2} />
                ทำแบบทดสอบอีกครั้ง
              </button>
              <Link
                href="/"
                className="flex-1 bg-[var(--bg-input)] hover:bg-[var(--bg-elevated)] border border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--text-main)] font-medium py-3 rounded-xl transition-colors duration-200 text-sm flex items-center justify-center gap-2"
              >
                <Home size={15} strokeWidth={2} />
                กลับหน้าหลัก
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
