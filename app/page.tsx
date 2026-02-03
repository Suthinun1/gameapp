"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function GameShop() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. ตรวจสอบสิทธิ์ (Auth Protection)
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (!role) {
      // ถ้าไม่มีข้อมูลการล็อกอิน ให้ส่งกลับไปหน้า Login ทันที
      router.push('/login');
    }
  }, [router]);

  // 2. ฟังก์ชันโหลดข้อมูลจาก MySQL (Docker)
  const loadGames = async () => {
    try {
      const res = await fetch('/api/game');
      const data = await res.json();
      // Filter out sold games for the user view
      setGames(Array.isArray(data) ? data.filter((g: any) => !g.isSold) : []);
    } catch (error) {
      console.error("Error fetching games:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  // 3. ฟังก์ชันลบสินค้า (เฉพาะ Admin หรือการจัดการทั่วไป)


  // 4. ฟังก์ชันออกจากระบบ (Logout)
  const handleLogout = () => {
    localStorage.removeItem('userRole');
    router.push('/login');
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-bold text-2xl">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="animate-pulse">กำลังโหลดข้อมูลสินค้า...</p>
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">

        {/* Header ส่วนหัว */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 border-b border-slate-800 pb-8">
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent italic tracking-tighter">
              Cat Shop
            </h1>
            <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-light">ขายเกมราคาถูก</p>
          </div>

          <div className="flex items-center gap-4">
            {/* ปุ่ม Admin (แสดงเฉพาะ Admin) */}
            {typeof window !== 'undefined' && localStorage.getItem('userRole') === 'ADMIN' && (
              <Link
                href="/admin"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-5 py-3 rounded-2xl transition-all font-bold shadow-lg shadow-yellow-500/20"
              >
                ⚙️ ADMIN DASHBOARD
              </Link>
            )}

            {/* ส่วนแสดง Point (คลิกเพื่อเติมเงิน) */}
            <Link href="/topup" className="bg-slate-800/50 hover:bg-slate-800 px-6 py-3 rounded-2xl border border-slate-700 flex items-center gap-3 cursor-pointer transition-all group">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping group-hover:bg-green-400"></span>
              <div className="flex flex-col items-end leading-tight">
                <span className="text-sm font-mono text-slate-300 font-bold group-hover:text-white">
                  {typeof window !== 'undefined' ? localStorage.getItem('userName') : 'GUEST'}
                </span>
                <span className="text-[10px] text-purple-400 font-black tracking-wider group-hover:text-purple-300">
                  {typeof window !== 'undefined' ? (localStorage.getItem('userPoints') || 0) : 0} POINTS ➕
                </span>
              </div>
            </Link>
            {/* ปุ่ม Logout */}
            <button
              onClick={handleLogout}
              className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-5 py-3 rounded-2xl transition-all font-bold border border-red-500/20"
            >
              LOGOUT
            </button>
          </div>
        </header>

        {/* ส่วนแสดงสินค้า (กรองเฉพาะที่ยังไม่ขาย) */}
        {games.filter(g => !g.isSold).length === 0 ? (
          <div className="text-center py-32 bg-slate-800/10 rounded-[3rem] border-2 border-dashed border-slate-800/50">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-slate-500 text-xl font-light">สินค้าหมดชั่วคราวรอการเพิ่มข้อมูล</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {games
              .filter((game) => game.isSold === false)
              .map((game) => (
                <div key={game.id} className="group bg-slate-800/40 rounded-[2.5rem] overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-500 shadow-xl hover:shadow-blue-500/10">

                  {/* Image Area */}
                  <div className="h-60 w-full overflow-hidden bg-slate-900 relative">
                    {game.imageUrl ? (
                      <img
                        src={game.imageUrl}
                        alt={game.title}
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-slate-700 text-sm italic">
                        No Preview Available
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                  </div>

                  {/* Content Area */}
                  <div className="p-7">
                    <div className="flex justify-between items-start mb-5">
                      <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest border border-blue-500/20">
                        {game.platform || 'DIGITAL'}
                      </span>
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block font-bold">PRICE</span>
                        <span className="text-3xl font-black text-green-400">฿{game.price}</span>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-1 truncate text-white group-hover:text-blue-400 transition-colors">
                      {game.title}
                    </h2>
                    <p className="text-slate-500 text-[10px] mb-8 font-mono uppercase tracking-tighter">PRODUCT CODE: {game.code || 'N/A'}</p>

                    <div className="flex gap-4">
                      {/* ไปหน้า Checkout */}
                      <Link
                        href={`/checkout/${game.id}`}
                        className="flex-[4] bg-blue-600 hover:bg-blue-500 text-white text-center font-bold py-4 rounded-2xl transition-all block shadow-lg shadow-blue-600/20 active:scale-95"
                      >
                        BUY NOW
                      </Link>

                      {/* ปุ่มลบ */}

                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <footer className="mt-20 text-center text-slate-600 text-xs border-t border-slate-800/50 pt-10 tracking-widest">
        &copy; {new Date().getFullYear()} ZBXS SHOP - POWERED BY NEXT.JS + PRISMA + MYSQL
      </footer>
    </main>
  );
}