import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, DollarSign, TrendingUp, AlertTriangle, Search, Shield, ArrowUpRight, ArrowDownRight, Activity, FileText, CheckCircle, XCircle, Eye, Bell, Lock, CreditCard } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl relative overflow-hidden shadow-2xl group"
    >
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`} />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 text-white shadow-lg shadow-black/20`}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <div className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ArrowUpRight size={12} />
                    {trend}%
                </div>
            )}
        </div>

        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white tracking-tight">{value}</h3>
    </motion.div>
);

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 10000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border ${type === 'success' ? 'bg-emerald-500/95 border-emerald-500/20 text-white' : 'bg-rose-500/95 border-rose-500/20 text-white'
                } backdrop-blur-md min-w-[300px] justify-between`}
        >
            <div className="flex items-center gap-3">
                {type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                <span className="font-bold text-lg">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <XCircle size={20} />
            </button>
        </motion.div>
    );
};

const UserDetailModal = ({ userId, onClose }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`/api/admin/users/${userId}/details`, { credentials: 'include' });
                if (res.ok) setDetails(await res.json());
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [userId]);

    if (!details && !loading) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
                <div className="p-6 border-b border-slate-800 flex justify-between items-center sticky top-0 bg-slate-950/90 backdrop-blur-md z-10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-sm">
                            {details?.user.fullName.charAt(0)}
                        </div>
                        User Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
                        <XCircle size={24} />
                    </button>
                </div>

                <div className="p-8 space-y-8">
                    {loading ? (
                        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div></div>
                    ) : (
                        <>
                            {/* Profile Header */}
                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                <div className="flex-1 space-y-1">
                                    <h3 className="text-2xl font-bold text-white">{details.user.fullName}</h3>
                                    <p className="text-slate-400 font-mono">{details.user.email}</p>
                                    <div className="flex gap-2 mt-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${details.user.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                            {details.user.active ? 'Active' : 'Blocked'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                            {details.user.role}
                                        </span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center min-w-[120px]">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Balance</div>
                                        <div className="text-xl font-bold text-white">
                                            ${details.accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                                        </div>
                                    </div>
                                    <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 text-center min-w-[120px]">
                                        <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">Investments</div>
                                        <div className="text-xl font-bold text-emerald-400">
                                            ${details.investments?.reduce((sum, inv) => sum + inv.currentValue, 0).toLocaleString() || 0}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Cards */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <CreditCard size={16} /> Cards
                                    </h4>
                                    <div className="space-y-4">
                                        {details.cards?.map(card => (
                                            <div key={card.id} className={`p-5 rounded-2xl text-white relative overflow-hidden ${card.type === 'CREDIT' ? 'bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700' : 'bg-gradient-to-br from-indigo-600 to-purple-700'}`}>
                                                <div className="flex justify-between items-start mb-6">
                                                    <div className="text-xs font-mono opacity-70">{card.type} CARD</div>
                                                    <div className="font-bold italic opacity-80">FundCare</div>
                                                </div>
                                                <div className="font-mono text-xl tracking-widest mb-4">
                                                    {card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                                                </div>
                                                <div className="flex justify-between text-xs opacity-80">
                                                    <div>
                                                        <div className="text-[10px] opacity-70">HOLDER</div>
                                                        <div>{card.cardHolderName}</div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-[10px] opacity-70">EXPIRES</div>
                                                        <div>{card.expiryDate}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!details.cards || details.cards.length === 0) && (
                                            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">No cards issued</div>
                                        )}
                                    </div>
                                </div>

                                {/* Investments */}
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                        <TrendingUp size={16} /> Investments
                                    </h4>
                                    <div className="space-y-3">
                                        {details.investments?.map(inv => (
                                            <div key={inv.id} className="flex justify-between items-center p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                                                <div>
                                                    <div className="font-bold text-white">{inv.name}</div>
                                                    <div className="text-xs text-slate-500">{inv.type}</div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-white">${inv.currentValue.toLocaleString()}</div>
                                                    <div className={`text-xs font-bold ${inv.currentValue >= inv.investedAmount ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {((inv.currentValue - inv.investedAmount) / inv.investedAmount * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {(!details.investments || details.investments.length === 0) && (
                                            <div className="p-8 text-center border border-dashed border-slate-800 rounded-2xl text-slate-500 text-sm">No investments found</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <div>
                                <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Activity size={16} /> Recent Activity
                                </h4>
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                                    {details.recentTransactions.map((tx, i) => (
                                        <div key={tx.id} className={`flex justify-between items-center p-4 ${i !== details.recentTransactions.length - 1 ? 'border-b border-slate-800' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${tx.type === 'DEPOSIT' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                    {tx.type === 'DEPOSIT' ? <ArrowDownRight size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{tx.description}</div>
                                                    <div className="text-xs text-slate-500">{new Date(tx.timestamp).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className={`font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-400' : 'text-white'}`}>
                                                {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                    {details.recentTransactions.length === 0 && (
                                        <div className="p-8 text-center text-slate-500 text-sm">No recent transactions</div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => {
    console.log('ConfirmationModal rendering, isOpen:', isOpen);
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div
                className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
            >
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-full ${type === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {type === 'danger' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                        </div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                    </div>
                    <p className="text-slate-400 mb-6">{message}</p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 font-bold transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`px-4 py-2 rounded-lg font-bold text-white transition-colors ${type === 'danger' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500'}`}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDeposits: 0,
        totalWithdrawals: 0,
        pendingRequests: 0,
        transactionTrends: {},
        loanDistribution: {},
        userGrowth: {}
    });
    const [users, setUsers] = useState([]);
    const [pendingLoans, setPendingLoans] = useState([]);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [toast, setToast] = useState(null);
    const [confirmation, setConfirmation] = useState({ isOpen: false, title: '', message: '', onConfirm: null, type: 'danger' });

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const fetchData = async () => {
        try {
            const [statsRes, usersRes, loansRes, requestsRes] = await Promise.all([
                fetch('/api/admin/stats', { credentials: 'include' }),
                fetch('/api/admin/users', { credentials: 'include' }),
                fetch('/api/admin/loans/pending', { credentials: 'include' }),
                fetch('/api/admin/requests/pending', { credentials: 'include' })
            ]);

            if (statsRes.ok) setStats(await statsRes.json());
            if (usersRes.ok) setUsers(await usersRes.json());
            if (loansRes.ok) setPendingLoans(await loansRes.json());
            if (requestsRes.ok) setPendingRequests(await requestsRes.json());
        } catch (error) {
            console.error('Error fetching admin data:', error);
            showToast('Failed to load dashboard data', 'error');
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const handleLoanAction = (id, action) => {
        console.log('handleLoanAction called', id, action);
        setConfirmation({
            isOpen: true,
            title: `${action === 'approve' ? 'Approve' : 'Reject'} Loan`,
            message: `Are you sure you want to ${action} this loan application?`,
            type: action === 'approve' ? 'success' : 'danger',
            onConfirm: async () => {
                console.log('Confirmation confirmed');
                setConfirmation(prev => ({ ...prev, isOpen: false }));
                setProcessingId(id);
                try {
                    const res = await fetch(`/api/admin/loans/${id}/${action}`, { method: 'POST', credentials: 'include' });
                    if (res.ok) {
                        showToast(`Loan ${action}ed successfully!`, 'success');
                        await fetchData();
                    } else {
                        const err = await res.text();
                        console.error('Loan action failed:', res.status, err);
                        showToast(`Action failed: ${err || res.statusText}`, 'error');
                    }
                } catch (e) {
                    console.error(e);
                    showToast('Network error', 'error');
                } finally {
                    setProcessingId(null);
                }
            }
        });
    };

    const handleRequestAction = (id, action) => {
        setConfirmation({
            isOpen: true,
            title: `${action === 'approve' ? 'Approve' : 'Reject'} Request`,
            message: `Are you sure you want to ${action} this service request?`,
            type: action === 'approve' ? 'success' : 'danger',
            onConfirm: async () => {
                setConfirmation(prev => ({ ...prev, isOpen: false }));
                setProcessingId(id);
                try {
                    const res = await fetch(`/api/admin/requests/${id}/${action}`, { method: 'POST', credentials: 'include' });
                    if (res.ok) {
                        showToast(`Request ${action}ed successfully!`, 'success');
                        await fetchData();
                    } else {
                        showToast('Action failed', 'error');
                    }
                } catch (e) {
                    console.error(e);
                    showToast('Network error', 'error');
                } finally {
                    setProcessingId(null);
                }
            }
        });
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Chart Data Preparation
    const transactionData = Object.entries(stats.transactionTrends || {})
        .map(([date, count]) => ({ date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }), count }))
        .reverse();

    const loanData = Object.entries(stats.loanDistribution || {})
        .map(([name, value]) => ({ name: name.replace('_', ' '), value }));

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    const userGrowthData = Object.entries(stats.userGrowth || {})
        .map(([month, count]) => ({ month, count }));

    return (
        <div className="min-h-screen bg-slate-950 text-white pb-20">
            <AnimatePresence>
                {confirmation.isOpen && (
                    <ConfirmationModal
                        isOpen={confirmation.isOpen}
                        onClose={() => setConfirmation({ ...confirmation, isOpen: false })}
                        onConfirm={confirmation.onConfirm}
                        title={confirmation.title}
                        message={confirmation.message}
                        type={confirmation.type}
                    />
                )}
                {selectedUserId && <UserDetailModal userId={selectedUserId} onClose={() => setSelectedUserId(null)} />}
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            {/* Top Bar */}
            <div className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-8 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Admin Portal</h1>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 w-64 transition-all text-white placeholder-slate-600"
                        />
                    </div>
                    <div className="bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-full flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                        <Shield size={14} />
                        Super Admin
                    </div>
                </div>
            </div>

            <div className="p-8 max-w-7xl mx-auto space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="from-indigo-500 to-violet-500" />
                    <StatCard icon={DollarSign} label="Total Deposits" value={`$${stats.totalDeposits?.toLocaleString()}`} color="from-emerald-500 to-teal-500" />
                    <StatCard icon={Activity} label="Total Withdrawals" value={`$${stats.totalWithdrawals?.toLocaleString()}`} color="from-rose-500 to-pink-500" />
                    <StatCard icon={AlertTriangle} label="Pending Requests" value={stats.pendingRequests} color="from-amber-500 to-orange-500" />
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-xl"
                    >
                        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                            <Activity size={20} className="text-indigo-400" /> Transaction Volume (30 Days)
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={transactionData}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-xl"
                    >
                        <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                            <Users size={20} className="text-emerald-400" /> User Growth
                        </h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={userGrowthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Service Requests */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <Lock size={20} className="text-amber-500" />
                                Service Requests
                            </h2>
                            <span className="bg-amber-500/10 text-amber-500 text-xs font-bold px-2 py-1 rounded-full border border-amber-500/20">
                                {pendingRequests.length} Pending
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4">Details</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {pendingRequests.map(req => (
                                        <tr key={req.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{req.user?.fullName}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs font-bold">
                                                    {req.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs max-w-xs truncate" title={req.additionalDetails}>
                                                {req.additionalDetails}
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleRequestAction(req.id, 'approve')}
                                                    disabled={processingId === req.id}
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-bold text-xs transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === req.id ? '...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleRequestAction(req.id, 'reject')}
                                                    disabled={processingId === req.id}
                                                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 font-bold text-xs transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === req.id ? '...' : 'Reject'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingRequests.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-600 italic">No pending requests.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Loan Management */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FileText size={20} className="text-blue-500" />
                                Loan Applications
                            </h2>
                            <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-full border border-blue-500/20">
                                {pendingLoans.length} Pending
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-400">
                                <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold text-xs tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Applicant</th>
                                        <th className="px-6 py-4">Amount</th>
                                        <th className="px-6 py-4">Type</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800">
                                    {pendingLoans.map(loan => (
                                        <tr key={loan.id} className="hover:bg-slate-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{loan.user?.fullName}</td>
                                            <td className="px-6 py-4 font-bold text-white">${loan.amount.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-xs">{loan.type}</td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => handleLoanAction(loan.id, 'approve')}
                                                    disabled={processingId === loan.id}
                                                    className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 font-bold text-xs transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === loan.id ? '...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleLoanAction(loan.id, 'reject')}
                                                    disabled={processingId === loan.id}
                                                    className="px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 font-bold text-xs transition-colors disabled:opacity-50"
                                                >
                                                    {processingId === loan.id ? '...' : 'Reject'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {pendingLoans.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-600 italic">No pending loans.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                    <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <Users size={20} className="text-purple-500" />
                            User Management
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-400">
                            <thead className="bg-slate-950/50 text-slate-500 uppercase font-bold text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredUsers.map(user => (
                                    <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-white">{user.fullName}</div>
                                            <div className="text-xs opacity-50">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${user.active ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                                                {user.active ? 'Active' : 'Blocked'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => setSelectedUserId(user.id)} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-colors">
                                                <Eye size={14} className="inline mr-1" /> View
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    await fetch(`/api/admin/users/${user.id}/toggle-status`, { method: 'POST', credentials: 'include' });
                                                    fetchData();
                                                }}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors border ${user.active ? 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'}`}
                                            >
                                                {user.active ? 'Block' : 'Unblock'}
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('Delete user?')) {
                                                        await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE', credentials: 'include' });
                                                        fetchData();
                                                    }
                                                }}
                                                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
