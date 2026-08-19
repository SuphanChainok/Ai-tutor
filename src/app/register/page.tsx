'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Mail, User } from 'lucide-react';
import { ThemeMode, getInitialTheme } from '@/components/ThemeSwitcher';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<ThemeMode>('dark');
  const router = useRouter();

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert('สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ');
        router.push('/login');
      } else {
        alert(data.message || 'สมัครสมาชิกไม่สำเร็จ');
      }
    } catch (err) {
      alert('ไม่สามารถเชื่อมต่อกับ Server ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${currentTheme} flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] items-center justify-center p-4 relative overflow-hidden transition-colors duration-200`}>
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, var(--accent) 0, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md bg-[var(--bg-sidebar)] border border-[var(--border-primary)] rounded-2xl p-8 shadow-2xl relative z-10 font-sans transition-colors duration-200">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[color-mix(in_srgb,var(--accent)_40%,transparent)] flex items-center justify-center text-[var(--accent-hover)] mb-3 bg-[var(--bg-input)] transition-colors duration-200">
            <GraduationCap size={24} strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-2xl text-[var(--text-main)] transition-colors duration-200">สมัครสมาชิก</h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--text-subtle)] uppercase mt-1 transition-colors duration-200">
            AI Tutor Private Study
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1.5 font-sans transition-colors duration-200">
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-[var(--text-subtle)]" size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-colors duration-200"
                placeholder="john_doe"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1.5 font-sans transition-colors duration-200">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-[var(--text-subtle)]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-colors duration-200"
                placeholder="student@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1.5 font-sans transition-colors duration-200">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-[var(--text-subtle)]" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[var(--text-main)] placeholder-[var(--text-subtle)] focus:outline-none focus:border-[color-mix(in_srgb,var(--accent)_50%,transparent)] focus:ring-1 focus:ring-[color-mix(in_srgb,var(--accent)_20%,transparent)] transition-colors duration-200"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-[var(--text-on-accent)] font-medium py-2.5 rounded-lg transition-colors duration-200 text-sm disabled:bg-[var(--bg-input)] disabled:text-[var(--text-subtle)] disabled:border disabled:border-[var(--border-input)] mt-2"
          >
            {loading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="text-xs text-center text-[var(--text-subtle)] mt-6 transition-colors duration-200">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-[var(--accent-hover)] hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
