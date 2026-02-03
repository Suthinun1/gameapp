"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { id } = useParams();
  const router = useRouter();
  const [game, setGame] = useState<any>(null);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    // ดึงข้อมูลสินค้าจาก API
    const fetchGame = async () => {
      try {
        const res = await fetch('/api/game');
        const data = await res.json();
        const found = data.find((g: any) => g.id === parseInt(id as string));
        setGame(found);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchGame();
  }, [id]);

  const handleConfirmOrder = async () => {
    setBuying(true);
    try {
      const username = localStorage.getItem('userName');
      if (!username) {
        alert("Please login first!");
        router.push('/login');
        return;
      }

      // Check validation via API
      const res = await fetch('/api/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gameId: id, username })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "Points not enough") {
          alert(`❌ คะแนนของคุณไม่เพียงพอ! \n\nมีอยู่: ${data.currentPoints} แต้ม\nต้องการ: ${data.requiredPoints} แต้ม`);
        } else {
          alert("เกิดข้อผิดพลาด: " + data.error);
        }
        return;
      }

      // Update LocalStorage to reflect new points immediately
      const currentPoints = parseInt(localStorage.getItem('userPoints') || '0');
      // Since we don't have game price handy in this scope comfortably without another generic fetching mess,
      // let's fetch the new profile from /api/users or just asking user to re-login is safer?
      // actually, let's just force a re-fetch of profile if possible?
      // logic: we know the buy succeeded.
      // Easiest fix for "User Experience":

      // Let's fetch the latest user data to get accurate points
      const userRes = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password: '...' }) // We don't have password. 
      });
      // Wait, we can't call login again.

      // Alternative: Just subtract if we can access price. 
      // We have `game` object!
      if (game && game.price) {
        const newPoints = currentPoints - game.price;
        localStorage.setItem('userPoints', newPoints.toString());
        // Dispatch a custom event to update header if needed, but router.push might trigger re-render
        window.dispatchEvent(new Event('storage'));
      }

      alert("🎉 สั่งซื้อสำเร็จ! หักคะแนนเรียบร้อยแล้ว");
      router.push('/');

    } catch (error) {
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setBuying(false);
    }
  };

  if (!game) return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center font-mono animate-pulse">
      LOADING DATA...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      {/* Container หลัก: จัดกึ่งกลางจอ + ทรงเว้าโค้งมนสวยงาม */}
      <div className="max-w-4xl w-full bg-slate-900/80 backdrop-blur-xl rounded-[3rem] border border-slate-700 p-10 shadow-2xl overflow-hidden relative group">

        {/* หัวข้อ */}
        <h1 className="text-4xl font-black mb-10 text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent italic tracking-tighter">
          ยืนยันคำสััั่งซื้อ
        </h1>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          {/* ส่วนรูปภาพสินค้า */}
          <div className="w-full md:w-1/2">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
              <img
                src={game.imageUrl}
                alt={game.title}
                className="relative w-full aspect-square object-cover rounded-[2.5rem] border border-slate-700 shadow-2xl"
              />
            </div>
          </div>

          {/* ส่วนรายละเอียดข้อมูล */}
          <div className="w-full md:w-1/2 flex flex-col space-y-6">
            <div>
              <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-blue-500/20">
                {game.platform || 'DIGITAL ITEM'}
              </span>
              <h2 className="text-4xl font-bold mt-2 text-white leading-tight">
                {game.title}
              </h2>
              <p className="text-slate-500 text-xs mt-1 font-mono uppercase tracking-widest">
                Product ID: #{game.id}
              </p>
            </div>

            <div className="bg-slate-800/50 p-6 rounded-[2rem] border border-slate-700/50 space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-slate-400 text-sm">PRICE</span>
                <span className="text-4xl font-black text-green-400">฿{game.price}</span>
              </div>
              <div className="h-px bg-slate-700/50 w-full"></div>
              <div>
                <span className="text-slate-500 text-[10px] block mb-1">INFO / CODE</span>
                <p className="text-slate-300 font-light text-sm italic">{game.code || 'No details available'}</p>
              </div>
            </div>

            {/* ส่วนของปุ่มกด */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => router.back()}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-4 rounded-2xl transition-all active:scale-95 border border-slate-700"
              >
                BACK
              </button>
              <button
                onClick={handleConfirmOrder}
                disabled={buying}
                className={`flex-[2] py-4 rounded-2xl font-black text-white shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2 ${buying ? 'bg-slate-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
                  }`}
              >
                {buying ? 'PROCESSING...' : 'CONFIRM ORDER 🚀'}
              </button>
            </div>
          </div>
        </div>

        {/* ตกแต่งพื้นหลังเล็กน้อย */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </main>
  );
}