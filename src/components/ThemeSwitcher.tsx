'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export type ThemeMode = 'dark' | 'light' | 'gold' | 'cyberpunk' | 'forest';

export interface ThemeConfig {
  id: ThemeMode;
  label: string;
  preview: { bg: string; accent: string };
  bgImage: string;
  overlay: string;
}

export const THEME_CONFIG: Record<ThemeMode, ThemeConfig> = {
  dark: {
    id: 'dark',
    label: 'Dark',
    preview: { bg: '#0B0E13', accent: '#C9A24B' },
    bgImage: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    overlay: 'bg-black/60',
  },
  light: {
    id: 'light',
    label: 'Light',
    preview: { bg: '#F8FAFC', accent: '#3B82F6' },
    bgImage: '',
    overlay: '',
  },
  gold: {
    id: 'gold',
    label: 'Gold',
    preview: { bg: '#0F0D08', accent: '#D4A843' },
    bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop',
    overlay: 'bg-black/70',
  },
  cyberpunk: {
    id: 'cyberpunk',
    label: 'Cyberpunk',
    preview: { bg: '#0A0A12', accent: '#06D6E0' },
    bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop',
    overlay: 'bg-black/65',
  },
  forest: {
    id: 'forest',
    label: 'Forest',
    preview: { bg: '#0A120D', accent: '#10B981' },
    bgImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1000&auto=format&fit=crop',
    overlay: 'bg-black/65',
  },
};

const THEME_LIST: ThemeConfig[] = Object.values(THEME_CONFIG);

const STORAGE_KEY = 'ai-tutor-theme';

export function getInitialTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && saved in THEME_CONFIG) return saved as ThemeMode;
  return 'dark';
}

interface Props {
  current: ThemeMode;
  onChange: (theme: ThemeMode) => void;
}

export default function ThemeSwitcher({ current, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative z-50" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-[var(--text-muted)] hover:text-[var(--accent-hover)] hover:bg-[color-mix(in_srgb,var(--accent)_10%,transparent)] transition-colors duration-200 shrink-0"
        title="เปลี่ยนธีม"
      >
        <Palette size={18} strokeWidth={1.75} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-2xl z-[60] py-1.5 border border-[var(--border-input)] bg-[var(--bg-elevated)] transition-colors duration-200">
          <div className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase text-[var(--text-subtle)]">
            เลือกธีม
          </div>

          {THEME_LIST.map((theme) => {
            const isActive = theme.id === current;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onChange(theme.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors duration-200 ${
                  isActive
                    ? 'bg-[color-mix(in_srgb,var(--accent)_10%,transparent)]'
                    : 'hover:bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]'
                }`}
              >
                <div className="flex items-center gap-1 shrink-0">
                  <div
                    className="w-4 h-4 rounded-full border border-[var(--border-input)]"
                    style={{ backgroundColor: theme.preview.bg }}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-[var(--border-input)]"
                    style={{ backgroundColor: theme.preview.accent }}
                  />
                </div>

                <span
                  className={`flex-1 text-xs font-sans ${
                    isActive ? 'text-[var(--accent)]' : 'text-[var(--text-main)]'
                  }`}
                >
                  {theme.label}
                </span>

                {theme.bgImage && (
                  <span className="text-[9px] text-[var(--text-subtle)] font-mono">
                    BG
                  </span>
                )}

                {isActive && (
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    className="text-[var(--accent)] shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
