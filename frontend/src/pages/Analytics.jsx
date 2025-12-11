import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, PieChart as PieChartIcon } from 'lucide-react';



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

    // Monthly Expenses Calculation
    const currentMonth = new Date().getMonth();
    const monthlyExpenses = transactions
        .filter(t => {
            const tDate = new Date(t.timestamp);
            return tDate.getMonth() === currentMonth &&
                (t.type === 'WITHDRAWAL' || t.type === 'BILL_PAYMENT' || t.type === 'THIRD_PARTY_TRANSFER');
        })
        .reduce((sum, t) => sum + t.amount, 0);

    // Expense Breakdown by Category (Simulated categories based on type/description for now)
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
        color: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'][index % 4]
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
        <div className="max-w-7xl mx-auto pb-10">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Financial Analytics</h1>
                    <p className="text-slate-400 text-sm">Deep dive into your spending habits and cash flow.</p>
                </div>
                <div className="bg-indigo-600/10 text-indigo-400 px-4 py-2 rounded-lg border border-indigo-500/20 flex items-center gap-2">
                    <PieChartIcon size={18} />
                    <span className="font-bold text-sm">Pro Insights</span>
                </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">Total Investments</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">${totalInvested.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="text-emerald-500 text-sm font-medium flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>Active Portfolio</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                            <TrendingDown size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">Monthly Expenses</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">${monthlyExpenses.toLocaleString()}</h3>
                        </div>
                    </div>
                    <div className="text-rose-500 text-sm font-medium flex items-center gap-1">
                        <TrendingDown size={14} />
                        <span>This Month</span>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-medium uppercase">Net Cash Flow</p>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                ${(cashFlowData[5].Income - cashFlowData[5].Expense).toLocaleString()}
                            </h3>
                        </div>
                    </div>
                    <div className="text-indigo-500 text-sm font-medium flex items-center gap-1">
                        <TrendingUp size={14} />
                        <span>Current Month Net</span>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Expense Breakdown (Pie Chart) */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Expense Breakdown</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={expenseData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {expenseData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Cash Flow (Bar Chart) */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Cash Flow (6 Months)</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={cashFlowData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                                />
                                <Legend />
                                <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
