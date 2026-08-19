'use client';

import { useState, useEffect } from 'react';

const themes = [
  { id: 'midnight-gold', name: 'Midnight Gold', color: '#d4af37' },
  { id: 'cyber-neon', name: 'Cyber Neon', color: '#06b6d4' },
  { id: 'emerald-green', name: 'Emerald Green', color: '#10b981' },
  { id: 'clean-light', name: 'Clean Light', color: '#2563eb' },
  { id: 'deep-space', name: 'Deep Space', color: '#8b5cf6' },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState('midnight-gold');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') || 'midnight-gold';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] hover:opacity-80 transition flex items-center gap-2 text-sm"
        title="เปลี่ยนธีม"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
          <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
          <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
          <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.92 0 1.7-.71 1.7-1.63 0-.43-.17-.83-.45-1.12-.28-.29-.45-.69-.45-1.12 0-.92.71-1.63 1.63-1.63H16c3.31 0 6-2.69 6-6 0-4.97-4.48-9-10-9z"/>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg p-2 z-50">
          <div className="text-xs text-[var(--text-main)] opacity-60 px-2 py-1 mb-1 font-semibold">เลือกธีม</div>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => changeTheme(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition ${
                theme === t.id ? 'bg-[var(--border)] text-[var(--text-main)] font-semibold' : 'text-[var(--text-main)] hover:bg-[var(--border)]/50'
              }`}
            >
              <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: t.color }}></span>
              {t.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}