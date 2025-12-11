import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, ArrowUpRight, ArrowDownRight, DollarSign, Activity, TrendingUp, Plus, Send, Zap, Shield, Wallet, PieChart as PieChartIcon, Calendar, Download, X, User, FileText, Landmark } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const Card = ({ card, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative w-full aspect-[1.586] rounded-3xl p-6 text-white shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02] ${card.type === 'CREDIT'
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-slate-700'
            : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800'
            }`}
    >
        {/* Background Patterns */}
        <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-widest opacity-70 uppercase">{card.type} CARD</span>
                    <span className="font-bold italic text-lg tracking-tight">FundCare</span>
                </div>
                <div className="flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400 fill-yellow-400" />
                    <span className="font-bold text-lg tracking-widest">VISA</span>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-9 bg-gradient-to-br from-yellow-200 to-yellow-500 rounded-lg shadow-inner flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)' }}></div>
                    </div>
                    <div className="flex gap-1">
                        <Zap size={16} className="rotate-90 opacity-80" />
                    </div>
                </div>
                <div className="font-mono text-2xl md:text-3xl tracking-widest drop-shadow-md">
                    {card.cardNumber.replace(/(\d{4})/g, '$1 ').trim()}
                </div>
            </div>

            <div className="flex justify-between items-end text-xs font-medium tracking-wider uppercase opacity-90">
                <div>
                    <div className="text-[10px] opacity-60 mb-0.5">Card Holder</div>
                    <div className="font-bold text-sm">{card.cardHolderName}</div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] opacity-60 mb-0.5">Expires</div>
                    <div className="font-bold text-sm">{card.expiryDate}</div>
                </div>
            </div>
        </div>
    </motion.div>
);

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-6 rounded-3xl relative overflow-hidden group shadow-lg dark:shadow-none"
    >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-5 rounded-bl-full transition-opacity group-hover:opacity-10`} />
        <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} bg-opacity-10 text-white shadow-lg shadow-black/20`}>
                <Icon size={24} className="text-white" />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full border ${trend > 0 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'}`}>
                    {trend > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {Math.abs(trend)}%
                </div>
            )}
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
    </motion.div>
);

const TransactionHistoryModal = ({ transactions, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filteredTx, setFilteredTx] = useState(transactions);

    useEffect(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            end.setHours(23, 59, 59);
            setFilteredTx(transactions.filter(t => {
                const date = new Date(t.timestamp);
                return date >= start && date <= end;
            }));
        } else {
            setFilteredTx(transactions);
        }
    }, [startDate, endDate, transactions]);

    const downloadCSV = () => {
        const headers = ['Date', 'Type', 'Description', 'Amount', 'Status'];
        const csvContent = [
            headers.join(','),
            ...filteredTx.map(t => [
                new Date(t.timestamp).toLocaleDateString(),
                t.type,
                `"${t.description || ''}"`,
                t.amount,
                'COMPLETED'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col"
            >
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FileText className="text-indigo-500" /> Transaction History
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500 dark:text-slate-400">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1 uppercase">End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <button
                        onClick={downloadCSV}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg flex items-center gap-2 transition-colors ml-auto"
                    >
                        <Download size={18} /> Download CSV
                    </button>
                </div>

                <div className="overflow-y-auto flex-1 p-0">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-bold uppercase text-xs sticky top-0">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                            {filteredTx.map((tx) => (
                                <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(tx.timestamp).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-medium">{tx.description || 'Transaction'}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'}`}>
                                            {tx.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-bold ${tx.type === 'DEPOSIT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                        {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {filteredTx.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 italic">No transactions found for selected period.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

const Dashboard = () => {
    const [accounts, setAccounts] = useState([]);
    const [cards, setCards] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [accRes, cardRes, invRes, txRes, userRes] = await Promise.all([
                    fetch('/api/accounts/my-accounts', { credentials: 'include' }),
                    fetch('/api/cards/my-cards', { credentials: 'include' }),
                    fetch('/api/investments/my-investments', { credentials: 'include' }),
                    fetch('/api/transactions/history', { credentials: 'include' }),
                    fetch('/api/auth/me', { credentials: 'include' })
                ]);

                if (accRes.ok) setAccounts(await accRes.json());
                if (cardRes.ok) setCards(await cardRes.json());
                if (invRes.ok) setInvestments(await invRes.json());
                if (txRes.ok) setTransactions(await txRes.json());
                if (userRes.ok) setUser(await userRes.json());

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
    const totalInvested = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const monthlyIncome = transactions
        .filter(t => t.type === 'DEPOSIT' && new Date(t.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, t) => sum + t.amount, 0);
    const monthlyExpenses = transactions
        .filter(t => (t.type === 'WITHDRAWAL' || t.type === 'BILL_PAYMENT' || t.type === 'THIRD_PARTY_TRANSFER') && new Date(t.timestamp) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
        .reduce((sum, t) => sum + t.amount, 0);

    // Prepare Chart Data (Real-time from transactions)
    const chartData = transactions
        .slice(0, 30) // Last 30 transactions
        .reverse()
        .map((t, i) => ({
            name: `Tx ${i + 1}`,
            amount: t.amount,
            type: t.type,
            date: new Date(t.timestamp).toLocaleDateString()
        }));

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white pb-24 transition-colors duration-300">
            <AnimatePresence>
                {showHistory && <TransactionHistoryModal transactions={transactions} onClose={() => setShowHistory(false)} />}
            </AnimatePresence>

            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Welcome back, <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">{user?.fullName || 'User'}</span>
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's your financial overview</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 transition-all">
                            <Calendar size={20} />
                        </button>
                        <button className="p-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:border-indigo-500/50 transition-all relative">
                            <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>
                            <Activity size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-8">
                {/* Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard icon={Wallet} label="Total Balance" value={`$${totalBalance.toLocaleString()}`} color="from-indigo-500 to-violet-500" trend={12.5} />
                    <StatCard icon={TrendingUp} label="Investments" value={`$${totalInvested.toLocaleString()}`} color="from-emerald-500 to-teal-500" trend={8.2} />
                    <StatCard icon={ArrowDownRight} label="Monthly Income" value={`$${monthlyIncome.toLocaleString()}`} color="from-blue-500 to-cyan-500" trend={5.1} />
                    <StatCard icon={ArrowUpRight} label="Monthly Expenses" value={`$${monthlyExpenses.toLocaleString()}`} color="from-rose-500 to-pink-500" trend={-2.4} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content Column (Left 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Account Details Card */}
                        {accounts.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                                <div className="flex justify-between items-center mb-6 relative z-10">
                                    <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                        <Landmark className="text-indigo-500" size={20} />
                                        My Account Details
                                    </h3>
                                    <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-500/30">
                                        Primary Savings
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Account Holder</div>
                                        <div className="font-bold text-lg text-slate-900 dark:text-white">{user?.fullName}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Account Number</div>
                                        <div className="font-mono font-bold text-lg text-slate-900 dark:text-white tracking-wider">{accounts[0].accountNumber}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">IFSC Code</div>
                                        <div className="font-mono font-bold text-lg text-slate-900 dark:text-white">FCB0001234</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                        <div className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email Linked</div>
                                        <div className="font-bold text-lg text-slate-900 dark:text-white truncate">{user?.email}</div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Financial Insights Chart */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <Activity className="text-indigo-500" size={20} />
                                    Financial Insights
                                </h3>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Income</span>
                                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">Expense</span>
                                </div>
                            </div>
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData}>
                                        <defs>
                                            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.1} />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="amount" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>

                        {/* Recent Transactions */}
                        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <DollarSign className="text-emerald-500" size={20} />
                                    Recent Transactions
                                </h3>
                                <button onClick={() => setShowHistory(true)} className="text-xs font-bold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">View All & Download</button>
                            </div>
                            <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                {transactions.slice(0, 5).map((tx) => (
                                    <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-2xl ${tx.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400'} group-hover:scale-110 transition-transform`}>
                                                {tx.type === 'DEPOSIT' ? <ArrowDownRight size={20} /> : <ArrowUpRight size={20} />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white">{tx.description || tx.type.replace('_', ' ')}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.timestamp).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold text-lg ${tx.type === 'DEPOSIT' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                            {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </div>
                                    </div>
                                ))}
                                {transactions.length === 0 && (
                                    <div className="p-8 text-center text-slate-500 italic">No transactions yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Column (Right 1/3) */}
                    <div className="space-y-8">
                        {/* My Cards */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center px-2">
                                <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                                    <CreditCard className="text-purple-500" size={20} />
                                    My Cards
                                </h3>
                                <button className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all">
                                    <Plus size={16} />
                                </button>
                            </div>
                            <div className="space-y-4">
                                {cards.map((card, index) => (
                                    <Card key={card.id} card={card} index={index} />
                                ))}
                                {cards.length === 0 && (
                                    <div className="p-8 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-500">
                                        <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
                                        <p className="text-sm">No cards issued</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Investments Summary */}
                        <div className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xl">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900 dark:text-white">
                                <PieChartIcon className="text-amber-500" size={20} />
                                Portfolio
                            </h3>
                            <div className="space-y-4">
                                {investments.slice(0, 3).map(inv => (
                                    <div key={inv.id} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300">
                                                {inv.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-slate-900 dark:text-white">{inv.name}</div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400">{inv.type}</div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm text-slate-900 dark:text-white">${inv.currentValue.toLocaleString()}</div>
                                            <div className={`text-xs font-bold ${inv.currentValue >= inv.investedAmount ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                {((inv.currentValue - inv.investedAmount) / inv.investedAmount * 100).toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {investments.length === 0 && (
                                    <div className="text-center text-slate-500 text-sm py-4">Start investing to see your portfolio grow.</div>
                                )}
                            </div>
                            <button className="w-full mt-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold text-sm transition-colors border border-slate-200 dark:border-slate-700">
                                View All Investments
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
