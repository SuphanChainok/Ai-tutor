'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GraduationCap, Lock, Mail, User } from 'lucide-react';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <div className="flex h-screen bg-[#0B0E13] text-[#EDE8DD] items-center justify-center p-4 relative overflow-hidden">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Thai:wght@400;500;600;700&family=IBM+Plex+Sans+Thai:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        .font-display {
          font-family: 'Noto Serif Thai', 'Noto Serif', serif;
        }
        .font-sans {
          font-family: 'IBM Plex Sans Thai', 'IBM Plex Sans', sans-serif;
        }
        .font-mono {
          font-family: 'JetBrains Mono', monospace;
        }
      `}</style>

      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 30%, #C9A24B 0, transparent 60%)',
        }}
      />

      <div className="w-full max-w-md bg-[#0E1218] border border-[#22283349] rounded-2xl p-8 shadow-2xl relative z-10 font-sans">
        {/* Header Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#C9A24B66] flex items-center justify-center text-[#E4C878] mb-3 bg-[#151A22]">
            <GraduationCap size={24} strokeWidth={1.75} />
          </div>
          <h1 className="font-display text-2xl text-[#EDE8DD]">สมัครสมาชิก</h1>
          <p className="font-mono text-[10px] tracking-[0.2em] text-[#5C6472] uppercase mt-1">
            AI Tutor Private Study
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="text-xs text-[#8B93A1] block mb-1.5 font-sans">
              ชื่อผู้ใช้
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 text-[#5C6472]" size={18} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#151A22] border border-[#2A3140] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#EDE8DD] placeholder-[#5C6472] focus:outline-none focus:border-[#C9A24B80] focus:ring-1 focus:ring-[#C9A24B33] transition-colors"
                placeholder="john_doe"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#8B93A1] block mb-1.5 font-sans">
              อีเมล
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 text-[#5C6472]" size={18} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#151A22] border border-[#2A3140] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#EDE8DD] placeholder-[#5C6472] focus:outline-none focus:border-[#C9A24B80] focus:ring-1 focus:ring-[#C9A24B33] transition-colors"
                placeholder="student@example.com"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#8B93A1] block mb-1.5 font-sans">
              รหัสผ่าน
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 text-[#5C6472]" size={18} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#151A22] border border-[#2A3140] rounded-lg pl-10 pr-4 py-2.5 text-sm text-[#EDE8DD] placeholder-[#5C6472] focus:outline-none focus:border-[#C9A24B80] focus:ring-1 focus:ring-[#C9A24B33] transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A24B] hover:bg-[#E4C878] text-[#0B0E13] font-medium py-2.5 rounded-lg transition-colors text-sm disabled:bg-[#151A22] disabled:text-[#3d4353] disabled:border disabled:border-[#2A3140] mt-2"
          >
            {loading ? 'กำลังลงทะเบียน...' : 'สมัครสมาชิก'}
          </button>
        </form>

        <p className="text-xs text-center text-[#5C6472] mt-6">
          มีบัญชีอยู่แล้ว?{' '}
          <Link href="/login" className="text-[#E4C878] hover:underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}