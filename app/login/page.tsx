"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. ส่งข้อมูลไปเช็คที่ API (ที่เราจะสร้างในขั้นตอนถัดไป)
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      // ✅ ถ้าล็อกอินผ่าน (มีชื่อนี้ใน MySQL และรหัสตรงกัน)
      localStorage.setItem('userRole', data.role);
      localStorage.setItem('userName', data.username);
      localStorage.setItem('userPoints', data.points);
      router.push('/');
    } else {
      // ❌ ถ้าล็อกอินไม่ผ่าน
      alert(data.message || "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 p-10 rounded-[3rem] shadow-2xl">
        <h1 className="text-3xl font-black text-center mb-8 italic">WELCOME BACK</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text" placeholder="Username"
            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500"
            onChange={(e) => setForm({ ...form, username: e.target.value })}
          />
          <input
            type="password" placeholder="Password"
            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl outline-none focus:border-blue-500"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20">
            SIGN IN
          </button>
        </form>
        <p className="text-center mt-6 text-slate-500 text-sm">
          ยังไม่มีบัญชี? <Link href="/register" className="text-blue-400 hover:underline">สมัครสมาชิก</Link>
        </p>
      </div>
    </main>
  );
}