'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Home,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  CheckCircle2,
  BookmarkCheck,
  Globe,
  Code2,
  Database,
  ShieldCheck,
  Sparkles,
  ArrowLeftRight,
} from 'lucide-react';
import ThemeSwitcher, {
  ThemeMode,
  getInitialTheme,
} from '@/components/ThemeSwitcher';

interface Flashcard {
  id: string;
  term: string;
  definition: string;
  category: string;
}

const CATEGORIES = [
  { id: 'all', label: 'ทั้งหมด', icon: Sparkles },
  { id: 'Web Development', label: 'Web Dev', icon: Globe },
  { id: 'Programming', label: 'Programming', icon: Code2 },
  { id: 'Database', label: 'Database', icon: Database },
  { id: 'Cyber Security', label: 'Security', icon: ShieldCheck },
] as const;

const FLASHCARD_DATA: Flashcard[] = [
  {
    id: '1',
    term: 'Closure',
    definition:
      'ฟังก์ชันที่สามารถเข้าถึงตัวแปรจาก Scope ภายนอกได้แม้จะถูกเรียกจากนอก Scope นั้น ทำให้เกิดการ "ปิดทับ" (enclose) ตัวแปรเหล่านั้นไว้ภายใน',
    category: 'Programming',
  },
  {
    id: '2',
    term: 'Virtual DOM',
    definition:
      'ตัวแทนของ DOM จริงในหน่วยความจำ ใช้เปรียบเทียบ (diff) การเปลี่ยนแปลงก่อนอัปเดต DOM จริง ช่วยเพิ่มประสิทธิภาพในการ render',
    category: 'Web Development',
  },
  {
    id: '3',
    term: 'SQL Injection',
    definition:
      'การโจมตีที่ผู้ใช้แทรกคำสั่ง SQL ผ่าน input ของแอปพลิเคชัน เพื่อจัดการกับฐานข้อมูลโดยไม่ได้รับอนุญาต ป้องกันได้ด้วย Parameterized Query',
    category: 'Cyber Security',
  },
  {
    id: '4',
    term: 'Normalization',
    definition:
      'กระบวนการจัดระเบียบฐานข้อมูลเพื่อลดความซ้ำซ้อน แบ่งข้อมูลออกเป็นหลายตารางและเชื่อมด้วย Foreign Key ตาม normal form ต่างๆ (1NF, 2NF, 3NF)',
    category: 'Database',
  },
  {
    id: '5',
    term: 'Promise',
    definition:
      'วัตถุที่แทนผลลัพธ์ของ operation ที่จะเสร็จสิ้นในอนาคต มี 3 สถานะ: pending, fulfilled, rejected ใช้ async/await เพื่อจัดการ',
    category: 'Programming',
  },
  {
    id: '6',
    term: 'REST API',
    definition:
      'สถาปัตยกรรมสำหรับออกแบบ Web Service โดยใช้ HTTP methods (GET, POST, PUT, DELETE) ในการทำ CRUD กับทรัพยากรที่ระบุด้วย URL',
    category: 'Web Development',
  },
  {
    id: '7',
    term: 'Index (Database)',
    definition:
      'โครงสร้างข้อมูลที่ช่วยเร่งความเร็วในการค้นหาข้อมูลในตาราง เหมือนสารบัญในหนังสือ แต่ทำให้การ INSERT/UPDATE ช้าลงเล็กน้อย',
    category: 'Database',
  },
  {
    id: '8',
    term: 'XSS (Cross-Site Scripting)',
    definition:
      'การโจมตีที่ฝัง JavaScript icious ลงในหน้าเว็บ เพื่อขโมยข้อมูลผู้ใช้ เช่น Cookie หรือ Session ป้องกันด้วย Input Sanitization และ CSP',
    category: 'Cyber Security',
  },
  {
    id: '9',
    term: 'State Management',
    definition:
      'กลไกจัดการสถานะ (state) ของแอปพลิเคชัน เช่น React Context, Redux, Zustand ช่วยให้ข้อมูลสอดคล้องกันทั่วทั้งแอป',
    category: 'Web Development',
  },
  {
    id: '10',
    term: 'Big O Notation',
    definition:
      'สัญลักษณ์สำหรับอธิบายประสิทธิภาพของอัลกอริทึม เช่น O(1) เร็วที่สุด, O(log n) ดี, O(n) ปานกลาง, O(n^2) ช้าเมื่อข้อมูลเยอะ',
    category: 'Programming',
  },
  {
    id: '11',
    term: 'Encryption vs Hashing',
    definition:
      'Encryption แปลงข้อมูลแล้วถอดรหัสกลับได้ (symmetric/asymmetric) ส่วน Hashing แปลงเป็นค่าคงที่ถอดกลับไม่ได้ ใช้เปรียบเทียบเท่านั้น เช่น bcrypt',
    category: 'Cyber Security',
  },
  {
    id: '12',
    term: 'ACID Properties',
    definition:
      'Atomicity, Consistency, Isolation, Durability — คุณสมบัติของ Transaction ที่รับประกันความถูกต้องของข้อมูลในระบบฐานข้อมูล',
    category: 'Database',
  },
  {
    id: '13',
    term: 'Async/Await',
    definition:
      'Syntax สำหรับจัดการ Promise ให้อ่านง่ายขึ้น async ประกาศฟังก์ชันที่คืน Promise await รอผลลัพธ์จาก Promise โดยไม่บล็อก main thread',
    category: 'Programming',
  },
  {
    id: '14',
    term: 'Responsive Design',
    definition:
      'การออกแบบเว็บไซต์ให้แสดงผลได้ดีทุกขนาดหน้าจอ ตั้งแต่มือถือไปจนถึงเดสก์ท็อป ใช้ Media Queries, Fluid Grid, Flexible Images',
    category: 'Web Development',
  },
  {
    id: '15',
    term: 'NoSQL',
    definition:
      'ฐานข้อมูลที่ไม่ใช้ตารางแบบ relational เช่น MongoDB (Document), Redis (Key-Value), Neo4j (Graph) เหมาะกับข้อมูลที่มีโครงสร้างยืดหยุ่น',
    category: 'Database',
  },
  {
    id: '16',
    term: 'CSRF (Cross-Site Request Forgery)',
    definition:
      'การโจมตีที่หลอกให้เบราว์เซอร์ของผู้ใช้ส่งคำขอที่ไม่ต้องการไปยังเว็บที่ล็อกอินอยู่ ป้องกันด้วย CSRF Token และ SameSite Cookie',
    category: 'Cyber Security',
  },
  {
    id: '17',
    term: 'Recursion',
    definition:
      'เทคนิคที่ฟังก์ชันเรียกตัวเองโดยมี base case เพื่อหยุดการเรียกซ้ำ ใช้แก้ปัญหาที่แตกออกเป็นปัญหาย่อย เช่น Factorial, Tree Traversal',
    category: 'Programming',
  },
  {
    id: '18',
    term: 'JWT (JSON Web Token)',
    definition:
      'มาตรฐาน token สำหรับ Authenticated ประกอบด้วย Header, Payload, Signature ใช้สำหรับ stateless authentication ในระบบ REST API',
    category: 'Web Development',
  },
  {
    id: '19',
    term: 'Join (SQL)',
    definition:
      'คำสั่งสำหรับเชื่อมข้อมูลจากหลายตารางเข้าด้วยกัน เช่น INNER JOIN, LEFT JOIN, RIGHT JOIN, FULL JOIN แต่ละแบบเลือกข้อมูลต่างกัน',
    category: 'Database',
  },
  {
    id: '20',
    term: 'Zero Trust Architecture',
    definition:
      'โมเดลความปลอดภัยที่ไม่ไว้ใจใครเลย แม้จะอยู่ในเครือข่ายเดียวกัน ต้องยืนยันตัวตนทุกครั้งที่เข้าถึงทรัพยากร ��证ทุก Request',
    category: 'Cyber Security',
  },
];

export default function FlashcardsPage() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [masteredCards, setMasteredCards] = useState<Set<string>>(new Set());
  const [reviewCards, setReviewCards] = useState<Set<string>>(new Set());

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const filteredCards = useMemo(() => {
    if (selectedCategory === 'all') return FLASHCARD_DATA;
    return FLASHCARD_DATA.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  const currentCard = filteredCards[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedCategory]);

  const goNext = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
    }, 150);
  }, [filteredCards.length]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + filteredCards.length) % filteredCards.length
      );
    }, 150);
  }, [filteredCards.length]);

  const handleShuffle = useCallback(() => {
    setIsFlipped(false);
    setTimeout(() => {
      let randomIndex: number;
      do {
        randomIndex = Math.floor(Math.random() * filteredCards.length);
      } while (randomIndex === currentIndex && filteredCards.length > 1);
      setCurrentIndex(randomIndex);
    }, 150);
  }, [currentIndex, filteredCards.length]);

  const toggleMastered = useCallback(() => {
    if (!currentCard) return;
    setMasteredCards((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
        setReviewCards((r) => {
          const nr = new Set(r);
          nr.delete(currentCard.id);
          return nr;
        });
      }
      return next;
    });
  }, [currentCard]);

  const toggleReview = useCallback(() => {
    if (!currentCard) return;
    setReviewCards((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
        setMasteredCards((m) => {
          const nm = new Set(m);
          nm.delete(currentCard.id);
          return nm;
        });
      }
      return next;
    });
  }, [currentCard]);

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
              Flashcards
            </h1>
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-mono tracking-wide text-[var(--accent-muted)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2.5 py-1 rounded-sm border border-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-colors duration-200">
            {masteredCards.size}/{FLASHCARD_DATA.length} mastered
          </span>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher current={currentTheme} onChange={setCurrentTheme} />
        </div>
      </header>

      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-6">
          {/* ── Category Tabs ── */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 study-scroll">
            {CATEGORIES.map(({ id, label, icon: Icon }) => {
              const active = id === selectedCategory;
              return (
                <button
                  key={id}
                  onClick={() => setSelectedCategory(id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-sans whitespace-nowrap transition-all duration-200 border shrink-0 ${
                    active
                      ? 'bg-[color-mix(in_srgb,var(--accent)_15%,transparent)] border-[color-mix(in_srgb,var(--accent)_40%,transparent)] text-[var(--accent-hover)]'
                      : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[color-mix(in_srgb,var(--accent)_25%,transparent)]'
                  }`}
                >
                  <Icon size={13} strokeWidth={1.75} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* ── Card Counter ── */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[var(--text-subtle)]">
              {filteredCards.length > 0
                ? `${currentIndex + 1} / ${filteredCards.length}`
                : 'ไม่มีการ์ด'}
            </span>
            <div className="flex items-center gap-3 text-xs text-[var(--text-subtle)]">
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} className="text-green-400" />
                {masteredCards.size} จำได้
              </span>
              <span className="flex items-center gap-1">
                <BookmarkCheck size={12} className="text-amber-400" />
                {reviewCards.size} ทบทวน
              </span>
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--text-subtle)] gap-3">
              <div className="w-14 h-14 rounded-full border border-[var(--border-input)] flex items-center justify-center bg-[var(--bg-sidebar)]">
                <Sparkles size={22} strokeWidth={1.5} />
              </div>
              <p className="text-sm">ไม่มีการ์ดในหมวดหมู่นี้</p>
            </div>
          ) : (
            <>
              {/* ── Flashcard ── */}
              <div className="flex justify-center">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="w-full max-w-lg aspect-[4/3] md:aspect-[3/2] relative cursor-pointer group focus:outline-none"
                  style={{ perspective: '1200px' }}
                >
                  <div
                    className={`absolute inset-0 transition-transform duration-500 ease-in-out`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: isFlipped
                        ? 'rotateY(180deg)'
                        : 'rotateY(0deg)',
                    }}
                  >
                    {/* Front */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-[var(--border-input)] bg-[var(--bg-sidebar)] p-6 md:p-10 flex flex-col items-center justify-center gap-4 transition-colors duration-200"
                      style={{ backfaceVisibility: 'hidden' }}
                    >
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--accent-muted)]">
                        {currentCard?.category}
                      </span>
                      <h2 className="font-display text-xl md:text-2xl lg:text-3xl text-center text-[var(--text-main)] leading-snug transition-colors duration-200">
                        {currentCard?.term}
                      </h2>
                      <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-subtle)] font-mono mt-2 group-hover:text-[var(--accent-muted)] transition-colors duration-200">
                        <ArrowLeftRight size={12} />
                        คลิกเพื่อพลิกการ์ด
                      </span>
                    </div>

                    {/* Back */}
                    <div
                      className="absolute inset-0 rounded-2xl border border-[color-mix(in_srgb,var(--accent)_25%,transparent)] bg-[var(--bg-elevated)] p-6 md:p-10 flex flex-col items-center justify-center gap-4 transition-colors duration-200"
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                    >
                      <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--accent-muted)]">
                        คำอธิบาย
                      </span>
                      <p className="text-sm md:text-base text-[var(--text-secondary)] text-center leading-relaxed font-sans max-w-md transition-colors duration-200">
                        {currentCard?.definition}
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* ── Status Buttons ── */}
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={toggleMastered}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    currentCard && masteredCards.has(currentCard.id)
                      ? 'bg-green-500/15 border-green-500/40 text-green-400'
                      : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] hover:text-green-400 hover:border-green-500/30'
                  }`}
                >
                  <CheckCircle2 size={14} strokeWidth={1.75} />
                  จำได้แล้ว
                </button>
                <button
                  onClick={toggleReview}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200 border ${
                    currentCard && reviewCards.has(currentCard.id)
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'bg-[var(--bg-input)] border-[var(--border-input)] text-[var(--text-muted)] hover:text-amber-400 hover:border-amber-500/30'
                  }`}
                >
                  <BookmarkCheck size={14} strokeWidth={1.75} />
                  ต้องทบทวนอีก
                </button>
              </div>

              {/* ── Navigation Controls ── */}
              <div className="flex items-center justify-center gap-3 pt-2 pb-4">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--accent-hover)] hover:border-[color-mix(in_srgb,var(--accent)_35%,transparent)] transition-all duration-200"
                  title="ย้อนกลับ"
                >
                  <ChevronLeft size={18} strokeWidth={2} />
                </button>
                <button
                  onClick={handleShuffle}
                  className="flex items-center gap-1.5 px-4 h-10 rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--accent-hover)] hover:border-[color-mix(in_srgb,var(--accent)_35%,transparent)] transition-all duration-200 text-xs font-medium"
                  title="สุ่มการ์ด"
                >
                  <Shuffle size={14} strokeWidth={2} />
                  สุ่ม
                </button>
                <button
                  onClick={goNext}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--bg-input)] border border-[var(--border-input)] text-[var(--text-muted)] hover:text-[var(--accent-hover)] hover:border-[color-mix(in_srgb,var(--accent)_35%,transparent)] transition-all duration-200"
                  title="ถัดไป"
                >
                  <ChevronRight size={18} strokeWidth={2} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
