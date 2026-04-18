import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, LineChart, Line } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon, Activity, Calendar, ArrowUpRight, ArrowDownRight, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
    const [transactions, setTransactions] = useState([]);
    const [investments, setInvestments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [txRes, invRes] = await Promise.all([
                    fetch('/api/transactions/history', { credentials: 'include' }),
                    fetch('/api/investments/my-investments', { credentials: 'include' })
                ]);

                if (txRes.ok) setTransactions(await txRes.json());
                if (invRes.ok) setInvestments(await invRes.json());
            } catch (error) {
                console.error("Error fetching analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate Metrics
    const totalInvested = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalIncome = transactions.filter(t => t.type === 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type !== 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0);

    // Expense Breakdown by Category
    const expenseCategories = transactions
        .filter(t => t.type !== 'DEPOSIT')
        .reduce((acc, t) => {
            const category = t.type === 'BILL_PAYMENT' ? 'Bills' :
                t.type === 'THIRD_PARTY_TRANSFER' ? 'Transfers' : 'Withdrawals';
            acc[category] = (acc[category] || 0) + t.amount;
            return acc;
        }, {});

    const expenseData = Object.keys(expenseCategories).map((key, index) => ({
        name: key,
        value: expenseCategories[key],
        color: ['#8b5cf6', '#ec4899', '#f59e0b', '#06b6d4'][index % 4]
    }));

    // Cash Flow (Last 6 Months)
    const cashFlowData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const monthName = d.toLocaleString('default', { month: 'short' });
        const monthIdx = d.getMonth();

        const income = transactions
            .filter(t => new Date(t.timestamp).getMonth() === monthIdx && t.type === 'DEPOSIT')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
            .filter(t => new Date(t.timestamp).getMonth() === monthIdx && t.type !== 'DEPOSIT')
            .reduce((sum, t) => sum + t.amount, 0);

        cashFlowData.push({ name: monthName, Income: income, Expense: expense });
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 pb-24">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Financial Analytics
                        </h1>
                        <p className="text-slate-400 mt-2 text-lg">Master your money with premium insights.</p>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2">
                            <Calendar size={16} /> Last 30 Days
                        </button>
                        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2">
                            <Target size={16} /> Set Goals
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { title: 'Total Income', value: totalIncome, icon: ArrowDownRight, color: 'emerald', trend: '+12.5%' },
                        { title: 'Total Expenses', value: totalExpenses, icon: ArrowUpRight, color: 'rose', trend: '-2.4%' },
                        { title: 'Net Savings', value: totalIncome - totalExpenses, icon: DollarSign, color: 'indigo', trend: '+8.1%' },
                        { title: 'Investments', value: totalInvested, icon: TrendingUp, color: 'amber', trend: '+5.3%' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl relative overflow-hidden group hover:border-slate-700 transition-colors"
                        >
                            <div className={`absolute top-0 right-0 w-32 h-32 bg-${stat.color}-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-${stat.color}-500/20 transition-colors`}></div>
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className={`p-3 rounded-2xl bg-${stat.color}-500/10 text-${stat.color}-500`}>
                                    <stat.icon size={24} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-500/10 text-${stat.color}-400 border border-${stat.color}-500/20`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{stat.title}</p>
                            <h3 className="text-3xl font-bold text-white mt-1">${stat.value.toLocaleString()}</h3>
                        </motion.div>
                    ))}
                </div>

                {/* Main Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Income vs Expense Area Chart */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-2 bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-xl"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Activity className="text-indigo-400" /> Cash Flow Trends
                            </h3>
                        </div>
                        <div className="h-80 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={cashFlowData}>
                                    <defs>
                                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" axisLine={false} tickLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" axisLine={false} tickLine={false} dx={-10} />
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                                    <Area type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Expense Breakdown Pie Chart */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col"
                    >
                        <h3 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
                            <PieChartIcon className="text-purple-400" /> Spending Mix
                        </h3>
                        <div className="flex-1 min-h-[300px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={expenseData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={110}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {expenseData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip 
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Center Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-slate-400 text-xs uppercase font-bold">Total Spent</span>
                                <span className="text-2xl font-bold text-white">${totalExpenses.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="mt-6 space-y-3">
                            {expenseData.map((entry, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                        <span className="text-slate-300">{entry.name}</span>
                                    </div>
                                    <span className="font-bold text-white">${entry.value.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Investment Performance */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 p-8 rounded-3xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                    
                    <div className="relative z-10">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Zap className="text-amber-400" /> Portfolio Performance
                                </h3>
                                <p className="text-slate-400 text-sm mt-1">Your assets are growing faster than 85% of users.</p>
                            </div>
                            <button className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-colors">
                                View Details
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {investments.slice(0, 3).map((inv, i) => (
                                <div key={i} className="bg-slate-950/50 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-300">
                                            {inv.symbol.substring(0, 2)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{inv.symbol}</div>
                                            <div className="text-xs text-slate-400">{inv.name}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-white">${inv.currentValue.toLocaleString()}</div>
                                        <div className="text-xs font-bold text-emerald-400">
                                            +{((inv.currentValue - inv.purchasePrice) / inv.purchasePrice * 100).toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
