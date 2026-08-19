'use client';

import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';

export type ThemeId =
  | 'midnight-gold'
  | 'cyber-neon'
  | 'emerald-green'
  | 'clean-light'
  | 'deep-space';

interface ThemeOption {
  id: ThemeId;
  label: string;
  preview: { bg: string; surface: string; accent: string; text: string };
}

const THEMES: ThemeOption[] = [
  {
    id: 'midnight-gold',
    label: 'Midnight Gold',
    preview: { bg: '#0B0E13', surface: '#0E1218', accent: '#C9A24B', text: '#EDE8DD' },
  },
  {
    id: 'cyber-neon',
    label: 'Cyber Neon',
    preview: { bg: '#0F1117', surface: '#13151D', accent: '#06D6E0', text: '#E2E8F0' },
  },
  {
    id: 'emerald-green',
    label: 'Emerald Green',
    preview: { bg: '#09120E', surface: '#0C1610', accent: '#10B981', text: '#E8F5EC' },
  },
  {
    id: 'clean-light',
    label: 'Clean Light',
    preview: { bg: '#F8FAFC', surface: '#F1F5F9', accent: '#3B82F6', text: '#1E293B' },
  },
  {
    id: 'deep-space',
    label: 'Deep Space',
    preview: { bg: '#0A0E1A', surface: '#0E1324', accent: '#8B5CF6', text: '#E8ECF4' },
  },
];

interface Props {
  current: ThemeId;
  onChange: (theme: ThemeId) => void;
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
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
        style={{
          color: 'var(--text-muted)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = 'var(--accent-hover)';
          e.currentTarget.style.backgroundColor = 'color-mix(in srgb, var(--accent-primary) 12%, transparent)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = 'var(--text-muted)';
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
        title="เปลี่ยนธีม"
      >
        <Palette size={18} strokeWidth={1.75} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-56 rounded-xl shadow-2xl z-50 py-1.5 border"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border-input)',
          }}
        >
          <div
            className="px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] uppercase"
            style={{ color: 'var(--text-subtle)' }}
          >
            เลือกธีม
          </div>

          {THEMES.map((theme) => {
            const isActive = theme.id === current;
            return (
              <button
                key={theme.id}
                onClick={() => {
                  onChange(theme.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors"
                style={{
                  backgroundColor: isActive
                    ? 'color-mix(in srgb, var(--accent-primary) 10%, transparent)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor =
                      'color-mix(in srgb, var(--accent-primary) 6%, transparent)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <div className="flex items-center gap-1.5 shrink-0">
                  <div
                    className="w-3.5 h-3.5 rounded-full border"
                    style={{
                      backgroundColor: theme.preview.bg,
                      borderColor: 'var(--border-input)',
                    }}
                  />
                  <div
                    className="w-3.5 h-3.5 rounded-full border"
                    style={{
                      backgroundColor: theme.preview.accent,
                      borderColor: 'var(--border-input)',
                    }}
                  />
                </div>

                <span
                  className="flex-1 text-xs font-sans"
                  style={{
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-primary)',
                  }}
                >
                  {theme.label}
                </span>

                {isActive && (
                  <Check
                    size={14}
                    strokeWidth={2.5}
                    style={{ color: 'var(--accent-primary)' }}
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
