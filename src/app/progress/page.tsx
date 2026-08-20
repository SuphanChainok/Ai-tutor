'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  GraduationCap,
  Home,
  MessageSquare,
  FileText,
  CheckCircle2,
  Trophy,
  Clock,
  Flame,
  Star,
  Shield,
  Code2,
  Globe,
  Database,
  ShieldCheck,
  Zap,
  BookOpen,
  Target,
  Award,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import ThemeSwitcher, {
  ThemeMode,
  getInitialTheme,
} from '@/components/ThemeSwitcher';

interface Activity {
  id: string;
  type: 'quiz' | 'flashcard' | 'chat';
  title: string;
  detail: string;
  timestamp: string;
  icon: typeof Trophy;
  color: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: typeof Trophy;
  earned: boolean;
  color: string;
  bgColor: string;
}

interface SubjectProgress {
  id: string;
  label: string;
  icon: typeof Globe;
  percentage: number;
  color: string;
}

const SUBJECTS: SubjectProgress[] = [
  { id: 'Web Development', label: 'Web Dev', icon: Globe, percentage: 78, color: '#3B82F6' },
  { id: 'Programming', label: 'Programming', icon: Code2, percentage: 65, color: '#C9A24B' },
  { id: 'Database', label: 'Database', icon: Database, percentage: 52, color: '#10B981' },
  { id: 'Cyber Security', label: 'Security', icon: ShieldCheck, percentage: 41, color: '#EF4444' },
];

const RECENT_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    type: 'quiz',
    title: 'ทำ Quiz สำเร็จ',
    detail: 'Web Development — ได้ 8/10 คะแนน',
    timestamp: '2 ชั่วโมงที่แล้ว',
    icon: Trophy,
    color: 'text-amber-400',
  },
  {
    id: 'a2',
    type: 'chat',
    title: 'ถาม AI Tutor',
    detail: 'คำถามเกี่ยวกับ React Hooks',
    timestamp: '3 ชั่วโมงที่แล้ว',
    icon: MessageSquare,
    color: 'text-[var(--accent-muted)]',
  },
  {
    id: 'a3',
    type: 'flashcard',
    title: 'ทบทวน Flashcard',
    detail: 'จำได้แล้ว 5 คำศัพท์ (Programming)',
    timestamp: 'เมื่อวาน',
    icon: BookOpen,
    color: 'text-green-400',
  },
  {
    id: 'a4',
    type: 'quiz',
    title: 'ทำ Quiz สำเร็จ',
    detail: 'Cyber Security — ได้ 6/10 คะแนน',
    timestamp: 'เมื่อวาน',
    icon: Trophy,
    color: 'text-amber-400',
  },
  {
    id: 'a5',
    type: 'flashcard',
    title: 'ทบทวน Flashcard',
    detail: 'จำได้แล้ว 3 คำศัพท์ (Database)',
    timestamp: '2 วันที่แล้ว',
    icon: BookOpen,
    color: 'text-green-400',
  },
  {
    id: 'a6',
    type: 'chat',
    title: 'ถาม AI Tutor',
    detail: 'คำถามเกี่ยวกับ SQL JOIN',
    timestamp: '3 วันที่แล้ว',
    icon: MessageSquare,
    color: 'text-[var(--accent-muted)]',
  },
];

const BADGES: Badge[] = [
  {
    id: 'b1',
    name: 'Night Owl',
    description: 'เข้าเรียนตอนกลางคืน',
    icon: Flame,
    earned: true,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/30',
  },
  {
    id: 'b2',
    name: 'Quiz Master',
    description: 'ได้คะแนนเต็มใน Quiz',
    icon: Target,
    earned: true,
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/30',
  },
  {
    id: 'b3',
    name: 'Fast Learner',
    description: 'ทำ Quiz ภายใน 2 นาที',
    icon: Zap,
    earned: true,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/30',
  },
  {
    id: 'b4',
    name: 'Bookworm',
    description: 'ทบทวน Flashcard ครบ 10 คำ',
    icon: BookOpen,
    earned: true,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10 border-blue-500/30',
  },
  {
    id: 'b5',
    name: 'Streak Master',
    description: 'เรียนติดต่อกัน 7 วัน',
    icon: Calendar,
    earned: false,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10 border-purple-500/30',
  },
  {
    id: 'b6',
    name: 'All-Rounder',
    description: 'ผ่าน Quiz ทุกหมวดหมู่',
    icon: Award,
    earned: false,
    color: 'text-pink-400',
    bgColor: 'bg-pink-500/10 border-pink-500/30',
  },
  {
    id: 'b7',
    name: 'Top Scholar',
    description: 'ได้คะแนน Quiz เฉลี่ย 90%+',
    icon: Star,
    earned: false,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10 border-cyan-500/30',
  },
  {
    id: 'b8',
    name: 'Security Expert',
    description: 'ผ่าน Quiz Security ทั้งหมด',
    icon: Shield,
    earned: false,
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/30',
  },
];

function ProgressCircle({
  percentage,
  color,
  size = 80,
  strokeWidth = 6,
}: {
  percentage: number;
  color: string;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-input)"
          strokeWidth={strokeWidth}
          className="transition-colors duration-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-mono font-medium text-[var(--text-main)] transition-colors duration-200">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export default function ProgressPage() {
  const router = useRouter();
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark');

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) router.push('/login');
  }, [router]);

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
              Progress Tracker
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcher current={currentTheme} onChange={setCurrentTheme} />
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 md:py-8 flex flex-col gap-8">
          {/* ═══ SUMMARY STATS ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              {
                label: 'คำถามที่ถาม AI',
                value: '127',
                icon: MessageSquare,
                color: 'text-[var(--accent-muted)]',
                bgColor: 'bg-[color-mix(in_srgb,var(--accent)_8%,transparent)]',
              },
              {
                label: 'Quiz เฉลี่ย',
                value: '72%',
                icon: Target,
                color: 'text-green-400',
                bgColor: 'bg-green-500/8',
              },
              {
                label: 'Flashcards จำได้',
                value: '18/30',
                icon: CheckCircle2,
                color: 'text-amber-400',
                bgColor: 'bg-amber-500/8',
              },
              {
                label: 'วันเรียนต่อเนื่อง',
                value: '5',
                icon: Flame,
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/8',
              },
            ].map(({ label, value, icon: Icon, color, bgColor }) => (
              <div
                key={label}
                className={`p-4 rounded-xl border border-[var(--border-input)] ${bgColor} transition-colors duration-200`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon size={14} strokeWidth={1.75} className={color} />
                  <span className="text-[10px] font-mono tracking-[0.1em] uppercase text-[var(--text-subtle)] transition-colors duration-200">
                    {label}
                  </span>
                </div>
                <div className="text-xl md:text-2xl font-display text-[var(--text-main)] transition-colors duration-200">
                  {value}
                </div>
              </div>
            ))}
          </div>

          {/* ═══ SUBJECT PROGRESS ═══ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp
                size={14}
                strokeWidth={1.75}
                className="text-[var(--accent-muted)]"
              />
              <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] transition-colors duration-200">
                ความเชี่ยวชาญแยกตามวิชา
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {SUBJECTS.map(({ id, label, icon: Icon, percentage, color }) => (
                <div
                  key={id}
                  className="bg-[var(--bg-sidebar)] border border-[var(--border-input)] rounded-2xl p-5 flex flex-col items-center gap-3 transition-colors duration-200"
                >
                  <ProgressCircle percentage={percentage} color={color} />
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Icon
                        size={13}
                        strokeWidth={1.75}
                        className="text-[var(--text-muted)]"
                      />
                      <span className="text-xs font-sans text-[var(--text-main)] transition-colors duration-200">
                        {label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-subtle)] transition-colors duration-200">
                      {percentage >= 70
                        ? 'เก่ง'
                        : percentage >= 50
                        ? 'ปานกลาง'
                        : 'ต้องฝึกเพิ่ม'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ═══ RECENT ACTIVITIES ═══ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock
                size={14}
                strokeWidth={1.75}
                className="text-[var(--accent-muted)]"
              />
              <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] transition-colors duration-200">
                ประวัติกิจกรรมล่าสุด
              </h2>
            </div>

            <div className="space-y-2">
              {RECENT_ACTIVITIES.map((activity) => {
                const Icon = activity.icon;
                return (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 bg-[var(--bg-sidebar)] border border-[var(--border-input)] rounded-xl px-4 py-3 transition-colors duration-200"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center bg-[var(--bg-input)] shrink-0 transition-colors duration-200`}
                    >
                      <Icon size={15} strokeWidth={1.75} className={activity.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-sans text-[var(--text-main)] truncate transition-colors duration-200">
                        {activity.title}
                      </p>
                      <p className="text-[11px] text-[var(--text-subtle)] font-sans truncate transition-colors duration-200">
                        {activity.detail}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--text-subtle)] whitespace-nowrap shrink-0 transition-colors duration-200">
                      {activity.timestamp}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ═══ BADGES / ACHIEVEMENTS ═══ */}
          <div className="space-y-4 pb-8">
            <div className="flex items-center gap-2">
              <Award
                size={14}
                strokeWidth={1.75}
                className="text-[var(--accent-muted)]"
              />
              <h2 className="font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)] transition-colors duration-200">
                ตราประทับความสำเร็จ
              </h2>
              <span className="text-[10px] font-mono text-[var(--accent-muted)] bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] px-2 py-0.5 rounded-sm transition-colors duration-200">
                {BADGES.filter((b) => b.earned).length}/{BADGES.length}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {BADGES.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-xl border transition-all duration-200 ${
                      badge.earned
                        ? badge.bgColor
                        : 'bg-[var(--bg-input)] border-[var(--border-input)] opacity-50 grayscale'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          badge.earned
                            ? 'bg-[var(--bg-main)]/50'
                            : 'bg-[var(--bg-main)]/30'
                        } transition-colors duration-200`}
                      >
                        <Icon
                          size={18}
                          strokeWidth={1.75}
                          className={badge.earned ? badge.color : 'text-[var(--text-subtle)]'}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-sans font-medium text-[var(--text-main)] transition-colors duration-200">
                          {badge.name}
                        </p>
                        <p className="text-[10px] text-[var(--text-subtle)] font-sans mt-0.5 leading-tight transition-colors duration-200">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                    {badge.earned && (
                      <div className="absolute top-2 right-2">
                        <CheckCircle2
                          size={12}
                          strokeWidth={2.5}
                          className={badge.color}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
