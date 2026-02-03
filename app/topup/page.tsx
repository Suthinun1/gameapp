"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TopUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const user = localStorage.getItem('userName');
        if (!user) {
            router.push('/login');
        }
        setUsername(user);
    }, []);

    const packages = [
        { points: 100, price: 100, color: 'from-blue-500 to-cyan-400' },
        { points: 300, price: 300, color: 'from-purple-500 to-pink-400' },
        { points: 500, price: 500, color: 'from-amber-400 to-orange-500' },
        { points: 1000, price: 1000, color: 'from-red-500 to-rose-600' },
        { points: 2000, price: 2000, color: 'from-emerald-400 to-green-600' },
        { points: 5000, price: 5000, color: 'from-indigo-500 to-violet-600' },
    ];

    const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'BANK_TRANSFER'>('CREDIT_CARD');

    const handleTopUp = async (amount: number) => {
        if (!username) return;
        setLoading(true);

        try {
            // Simulate Payment Processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            const res = await fetch('/api/topup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, amount, method: 'CREDIT_CARD' }) // Force Instant
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('userPoints', data.newPoints.toString());
                window.dispatchEvent(new Event('storage'));
                alert(`🎉 ${data.message || 'Top Up Successful!'}`);
                router.push('/');
            } else {
                alert("เกิดข้อผิดพลาด: " + (data.error || 'Unknown Error'));
            }
        } catch (error) {
            console.error(error);
            alert("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ (Check Console)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-purple-500/30">
            {/* ... Background ... */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full mix-blend-screen animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-6xl mx-auto p-8 relative z-10">
                {/* ... Header ... */}
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent transform -skew-x-6">
                            TOP UP CENTER
                        </h1>
                        <p className="text-slate-400 mt-2 font-mono tracking-wider">เติมพอยท์เพื่อซื้อเกมที่คุณรัก</p>
                    </div>
                    <button
                        onClick={() => router.push('/')}
                        className="bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl font-bold transition-all border border-slate-700"
                    >
                        🏠 HOME
                    </button>
                </header>

                {/* Payment Method Selector */}
                <div className="mb-12 flex gap-4 justify-center">
                    <button
                        onClick={() => setPaymentMethod('CREDIT_CARD')}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'CREDIT_CARD' ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20 scale-105' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 opacity-60'}`}
                    >
                        <span className="text-2xl">💳</span>
                        <div className="text-left">
                            <div className="font-black text-lg">CREDIT CARD</div>
                            <div className="text-[10px] uppercase tracking-wide font-bold text-blue-200">Instant Points • Auto</div>
                        </div>
                    </button>

                    <button
                        onClick={() => setPaymentMethod('BANK_TRANSFER')}
                        className={`flex items-center gap-3 px-8 py-4 rounded-2xl border-2 transition-all duration-300 ${paymentMethod === 'BANK_TRANSFER' ? 'bg-green-600 border-green-400 shadow-xl shadow-green-600/20 scale-105' : 'bg-slate-900/50 border-slate-700 hover:border-slate-500 opacity-60'}`}
                    >
                        <span className="text-2xl">🏦</span>
                        <div className="text-left">
                            <div className="font-black text-lg">BANK TRANSFER</div>
                            <div className="text-[10px] uppercase tracking-wide font-bold text-green-200">Manual Check • Wait</div>
                        </div>
                    </button>
                </div>

                {/* Loading Overlay */}
                {loading && (
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center flex-col gap-4">
                        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-xl font-bold animate-pulse">
                            Processing {paymentMethod === 'CREDIT_CARD' ? 'Auto Payment' : 'Transfer Request'}...
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.points}
                            className="group relative bg-slate-900/50 border border-slate-800 rounded-3xl p-8 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                            onClick={() => handleTopUp(pkg.points)}
                        >
                            {/* Card Gradient Background */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${pkg.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                            <div className="relative z-10 flex flex-col items-center text-center">
                                {/* ... Card Content ... */}
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-6 shadow-lg shadow-black/50 group-hover:scale-110 transition-transform duration-300`}>
                                    <span className="text-3xl">💎</span>
                                </div>

                                <h3 className="text-4xl font-black mb-2">{pkg.points.toLocaleString()}</h3>
                                <span className="text-xs font-bold tracking-[0.2em] text-slate-500 mb-8 uppercase">Points</span>

                                <div className="w-full border-t border-slate-800/50 my-6"></div>

                                <div className="text-2xl font-bold text-slate-300 group-hover:text-white transition-colors">
                                    ฿{pkg.price.toLocaleString()}
                                </div>

                                <button className={`mt-8 w-full py-4 rounded-xl bg-gradient-to-r ${pkg.color} font-bold text-white shadow-lg opacity-80 group-hover:opacity-100 transform group-hover:scale-[1.02] transition-all`}>
                                    {paymentMethod === 'CREDIT_CARD' ? 'BUY NOW ⚡' : 'REQUEST 📝'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
