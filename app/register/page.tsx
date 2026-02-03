"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    // ส่งข้อมูลไปที่ API เพื่อบันทึกลง MySQL
    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    if (res.ok) {
      alert("สมัครสมาชิกสำเร็จ!");
      router.push('/login');
    } else {
      alert("ชื่อผู้ใช้นี้มีคนใช้แล้ว");
    }
  };

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-700 p-10 rounded-[3rem] shadow-2xl">
        <h1 className="text-3xl font-black text-white text-center mb-8 italic">CREATE ACCOUNT</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="Username" required
            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-cyan-500"
            onChange={(e) => setForm({...form, username: e.target.value})}
          />
          <input 
            type="password" placeholder="Password" required
            className="w-full bg-slate-800 border border-slate-700 p-4 rounded-2xl text-white outline-none focus:border-cyan-500"
            onChange={(e) => setForm({...form, password: e.target.value})}
          />
          <button className="w-full bg-cyan-600 hover:bg-cyan-500 py-4 rounded-2xl font-bold text-white shadow-lg shadow-cyan-600/20 transition-all">
            REGISTER NOW
          </button>
        </form>
      </div>
    </main>
  );
}