"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'GAMES' | 'USERS' | 'PAYMENTS'>('GAMES');
  const [users, setUsers] = useState<any[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);

  // Games State
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    platform: '',
    code: '',
    imageUrl: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  // Points Management State
  const [pointModal, setPointModal] = useState({
    isOpen: false,
    userId: null as number | null,
    username: '',
    currentPoints: 0
  });
  const [pointAdjustment, setPointAdjustment] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    if (role !== 'ADMIN') {
      router.push('/login');
    } else {
      loadGames();
      loadUsers();
      loadRequests();
    }
  }, []);

  const loadGames = async () => {
    const res = await fetch('/api/game');
    const data = await res.json();
    setGames(data);
    setLoading(false);
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        setUsers([]);
        console.error("Failed to load users:", data);
      }
    } catch (error) {
      console.error("Error loading users:", error);
      setUsers([]);
    }
  };

  // CRUD Functions
  const loadRequests = async () => {
    try {
      const res = await fetch('/api/admin/topup');
      const data = await res.json();
      setPaymentRequests(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading requests:", error);
    }
  };

  const handlePaymentAction = async (requestId: number, action: 'APPROVED' | 'REJECTED', userId: number, amount: number) => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;

    await fetch('/api/admin/topup', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, action, userId, amount })
    });

    loadRequests();
    loadUsers(); // Refresh users to see updated points
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `/api/game/${editingId}` : '/api/game';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setFormData({ title: '', price: '', platform: '', code: '', imageUrl: '' });
      setEditingId(null);
      setIsModalOpen(false);
      loadGames();
    } catch (error) {
      console.error(error);
      alert('Error saving data');
    }
  };

  const openEditModal = (game: any) => {
    setEditingId(game.id);
    setFormData({
      title: game.title,
      price: game.price.toString(),
      platform: game.platform,
      code: game.code,
      imageUrl: game.imageUrl || ''
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: '', price: '', platform: '', code: '', imageUrl: '' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("⚠️ Are you sure you want to permanently delete this game?")) {
      await fetch(`/api/game/${id}`, { method: 'DELETE' });
      loadGames();
    }
  };

  // Stats Calculation
  const totalGames = games.length;
  const totalValue = games.reduce((acc, curr) => acc + (curr.isSold ? 0 : curr.price), 0);
  const totalSalesValue = games.reduce((acc, curr) => acc + (curr.isSold ? curr.price : 0), 0);
  const soldCount = games.filter(g => g.isSold).length;

  const filteredGames = games.filter(g =>
    g.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      // Optimistic Update
      setGames(games.map(g => g.id === id ? { ...g, isSold: newStatus } : g));

      await fetch(`/api/game/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSold: newStatus })
      });

      // No need to reload, optimistic update covers it. 
      // If fail, we should technically revert, but for this prototype, simple alert on error is fine.
    } catch (error) {
      console.error("Failed to toggle status", error);
      alert("Failed to update status");
      loadGames(); // Revert
    }
  };

  const handleUpdatePoints = (user: any) => {
    setPointModal({
      isOpen: true,
      userId: user.id,
      username: user.username,
      currentPoints: user.points || 0
    });
    setPointAdjustment('');
  };

  const savePointChange = async (newTotal: number) => {
    if (pointModal.userId === null) return;

    try {
      await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: pointModal.userId, points: newTotal })
      });

      setPointModal({ ...pointModal, isOpen: false });
      loadUsers();
    } catch (error) {
      console.error("Failed to update points", error);
      alert("Failed to update points");
    }
  };

  // ... (Stats Calculation exist) ...

  // UI Render
  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="max-w-[1600px] mx-auto p-8 relative z-10">

        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-black tracking-tighter italic bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ADMIN DASHBOARD
            </h1>
            <p className="text-slate-500 text-sm font-mono mt-1 tracking-widest">SYSTEM MANAGEMENT INTERFACE v2.0</p>
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.push('/')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-xl font-bold transition-all border border-slate-700">
              🏠 STORE FRONT
            </button>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('GAMES')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'GAMES' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            🎮 GAMES INVENTORY
          </button>
          <button
            onClick={() => setActiveTab('USERS')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'USERS' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            👥 USER MANAGEMENT
          </button>
          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${activeTab === 'PAYMENTS' ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'}`}
          >
            💰 PAYMENT REQUESTS
            {paymentRequests.length > 0 && (
              <span className="ml-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{paymentRequests.length}</span>
            )}
          </button>
        </div>

        {activeTab === 'PAYMENTS' ? (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-950/50 text-slate-500 border-b border-slate-800/50 text-xs uppercase tracking-widest">
                  <th className="p-6">Time</th>
                  <th className="p-6">User</th>
                  <th className="p-6">Amount</th>
                  <th className="p-6">Status</th>
                  <th className="p-6 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {paymentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-amber-500/5 transition-colors">
                    <td className="p-6 text-slate-500 text-sm">{new Date(req.createdAt).toLocaleString()}</td>
                    <td className="p-6 font-bold text-white">{req.username}</td>
                    <td className="p-6 text-amber-400 font-bold text-xl">+{req.amount.toLocaleString()} pts</td>
                    <td className="p-6"><span className="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold">{req.status}</span></td>
                    <td className="p-6 text-center flex justify-center gap-2">
                      <button
                        onClick={() => handlePaymentAction(req.id, 'APPROVED', req.userId, req.amount)}
                        className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg"
                      >
                        ✅ APPROVE
                      </button>
                      <button
                        onClick={() => handlePaymentAction(req.id, 'REJECTED', req.userId, req.amount)}
                        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-bold text-xs shadow-lg"
                      >
                        ❌ REJECT
                      </button>
                    </td>
                  </tr>
                ))}
                {paymentRequests.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 italic">No pending requests</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : activeTab === 'GAMES' ? (
          <>
            <div className="flex justify-end mb-6">
              <button onClick={openAddModal} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2 border border-blue-500/50">
                ➕ NEW GAME
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">🎮</div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Inventory</h3>
                <p className="text-4xl font-black text-white">{totalGames} <span className="text-lg text-slate-600">ITEMS</span></p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">💎</div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Value (Unsold)</h3>
                <p className="text-4xl font-black text-blue-400">฿{totalValue.toLocaleString()}</p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">🛒</div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Sold Items</h3>
                <p className="text-4xl font-black text-purple-400">{soldCount} <span className="text-lg text-slate-600">SOLD</span></p>
              </div>
              <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity text-6xl">💰</div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Income</h3>
                <p className="text-4xl font-black text-green-400">฿{totalSalesValue.toLocaleString()}</p>
              </div>
            </div>

            {/* Games Table */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-950/50 text-slate-500 border-b border-slate-800/50 text-xs uppercase tracking-widest">
                      <th className="p-6 font-bold">Product</th>
                      <th className="p-6 font-bold">Platform</th>
                      <th className="p-6 font-bold">Code (Key)</th>
                      <th className="p-6 font-bold text-right">Price</th>
                      <th className="p-6 font-bold text-center">Status</th>
                      <th className="p-6 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {filteredGames.length > 0 ? filteredGames.map((game) => (
                      <tr key={game.id} className="hover:bg-blue-500/5 transition-colors group">
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0 border border-slate-700 group-hover:border-blue-500/50 transition-colors">
                              {game.imageUrl ? (
                                <img src={game.imageUrl} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xl">👾</div>
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-white group-hover:text-blue-400 transition-colors">{game.title}</div>
                              <div className="text-xs text-slate-500 font-mono">ID: {game.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <span className="bg-slate-800 border border-slate-700 text-slate-400 px-3 py-1 rounded-lg text-xs font-bold">
                            {game.platform}
                          </span>
                        </td>
                        <td className="p-6">
                          <code className="text-slate-500 font-mono text-xs bg-slate-950 px-2 py-1 rounded">
                            {game.code}
                          </code>
                        </td>
                        <td className="p-6 text-right">
                          <span className="font-bold text-green-400 text-lg">฿{game.price}</span>
                        </td>
                        <td className="p-6 text-center">
                          <button
                            onClick={() => toggleStatus(game.id, game.isSold)}
                            className="group/status relative focus:outline-none"
                          >
                            {game.isSold ? (
                              <span className="text-xs font-bold text-red-500 bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20 group-hover/status:bg-red-500 group-hover/status:text-white transition-all">
                                SOLD OUT
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/status:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Click to make AVAILABLE</span>
                              </span>
                            ) : (
                              <span className="text-xs font-bold text-green-500 bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 group-hover/status:bg-green-500 group-hover/status:text-white transition-all">
                                AVAILABLE
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/status:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Click to mark SOLD</span>
                              </span>
                            )}
                          </button>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEditModal(game)} className="p-2 hover:bg-slate-800 rounded-lg text-blue-400 transition-colors" title="Edit">
                              ✏️
                            </button>
                            <button onClick={() => handleDelete(game.id)} className="p-2 hover:bg-slate-800 rounded-lg text-red-400 transition-colors" title="Delete">
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="p-20 text-center text-slate-600">No games found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* Users Tab */
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-slate-500 border-b border-slate-800/50 text-xs uppercase tracking-widest">
                    <th className="p-6 font-bold">User ID</th>
                    <th className="p-6 font-bold">Username</th>
                    <th className="p-6 font-bold">Role</th>
                    <th className="p-6 font-bold text-center">Points</th>
                    <th className="p-6 font-bold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-purple-500/5 transition-colors">
                      <td className="p-6 text-slate-500 font-mono">#{user.id}</td>
                      <td className="p-6 font-bold text-white text-lg">{user.username}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${user.role === 'ADMIN' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-6 text-center">
                        <span className="text-2xl font-black text-purple-400">{user.points || 0}</span>
                        <span className="text-slate-600 text-xs ml-2">PTS</span>
                      </td>
                      <td className="p-6 text-center">
                        <button
                          onClick={() => handleUpdatePoints(user)}
                          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg shadow-purple-600/20 transition-all border border-purple-500/50"
                        >
                          💎 MANAGE POINTS
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay (Same as before) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          {/* ... Form Content ... */}
          {/* Since the replacement content is large, I'm assuming the existing modal code is re-used or I need to provide it fully. 
               To stay safe, I will re-provide the modal code block below. 
           */}
          <div className="bg-[#121216] border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* ... Header ... */}
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                {editingId ? '⚡ EDIT GAME' : '🚀 NEW GAME LISTING'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white transition-colors text-2xl">
                &times;
              </button>
            </div>
            {/* ... Form ... */}
            <form onSubmit={handleSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-2">
                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Game Title</label>
                <input name="title" value={formData.title} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Price (THB)</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono" />
              </div>
              <div>
                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Platform</label>
                <select name="platform" value={formData.platform} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all">
                  <option value="">Select Platform</option>
                  <option value="PC">PC</option>
                  <option value="PS5">PlayStation 5</option>
                  <option value="XBOX">Xbox</option>
                  <option value="NINTENDO">Nintendo</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Code</label>
                <input name="code" value={formData.code} onChange={handleChange} required className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono" />
              </div>
              <div className="col-span-2">
                <label className="text-xs text-slate-500 font-bold uppercase mb-2 block">Image URL</label>
                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all" />
              </div>
              <div className="col-span-2 flex gap-4 mt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3 rounded-xl font-bold transition-all">CANCEL</button>
                <button type="submit" className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all">SAVE</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Points Modal */}
      {pointModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121216] border border-purple-500/30 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-purple-500/20 bg-purple-900/10 flex justify-between items-center">
              <h2 className="text-xl font-black text-white flex items-center gap-2 italic">
                💎 MANAGE POINTS
              </h2>
              <button onClick={() => setPointModal({ ...pointModal, isOpen: false })} className="text-slate-500 hover:text-white transition-colors text-2xl">
                &times;
              </button>
            </div>

            <div className="p-8 text-center">
              <div className="mb-6">
                <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">User: {pointModal.username}</div>
                <div className="text-6xl font-black text-white mb-2">{pointModal.currentPoints.toLocaleString()}</div>
                <div className="text-purple-400 text-xs font-bold uppercase tracking-[0.2em]">Current Balance</div>
              </div>

              <div className="bg-slate-900/50 p-4 rounded-2xl border border-slate-800 mb-8">
                <input
                  type="number"
                  value={pointAdjustment}
                  onChange={(e) => setPointAdjustment(e.target.value)}
                  placeholder="Enter Amount"
                  className="w-full bg-transparent text-center text-3xl font-bold text-white focus:outline-none placeholder:text-slate-700 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    const amount = parseInt(pointAdjustment);
                    if (!isNaN(amount)) savePointChange(pointModal.currentPoints + amount);
                  }}
                  className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black shadow-lg shadow-green-600/20 active:scale-95 transition-all"
                >
                  ➕ ADD
                </button>
                <button
                  onClick={() => {
                    const amount = parseInt(pointAdjustment);
                    if (!isNaN(amount)) savePointChange(pointModal.currentPoints - amount);
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-black shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                >
                  ➖ DEDUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}