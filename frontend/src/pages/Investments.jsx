import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, PieChart, DollarSign, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const InvestmentCard = ({ investment }) => {
    const isProfit = investment.currentValue >= investment.investedAmount;
    const profitLoss = investment.currentValue - investment.investedAmount;
    const percentage = ((profitLoss / investment.investedAmount) * 100).toFixed(2);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors"
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {isProfit ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                    </div>
                    <div>
                        <h3 className="text-slate-900 dark:text-white font-bold text-sm">{investment.name}</h3>
                        <p className="text-slate-500 text-xs">{investment.type.replace('_', ' ')}</p>
                    </div>
                </div>
                <div className={`text-sm font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'} flex items-center gap-1`}>
                    {isProfit ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                    {percentage}%
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <p className="text-slate-500 text-xs mb-1">Invested</p>
                    <p className="text-slate-900 dark:text-white font-medium">${investment.investedAmount.toLocaleString()}</p>
                </div>
                <div>
                    <p className="text-slate-500 text-xs mb-1">Current Value</p>
                    <p className="text-slate-900 dark:text-white font-medium">${investment.currentValue.toFixed(2)}</p>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">Units: {investment.units.toFixed(2)}</span>
                <span className={`${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {isProfit ? '+' : ''}${profitLoss.toFixed(2)}
                </span>
            </div>
        </motion.div>
    );
};

const BuyInvestmentModal = ({ isOpen, onClose, onBought }) => {
    const [type, setType] = useState('MUTUAL_FUND');
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/investments/buy-my-investment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type,
                    name,
                    amount
                })
            });
            if (res.ok) {
                onBought();
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md"
            >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">New Investment</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="MUTUAL_FUND">Mutual Fund</option>
                            <option value="STOCK">Stock</option>
                            <option value="BOND">Bond</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Fund/Stock Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                            placeholder="e.g. S&P 500 Index"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Amount ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="1000"
                            required
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
                        >
                            {loading ? 'Processing...' : 'Invest Now'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const Investments = () => {
    const [investments, setInvestments] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchInvestments = async () => {
        try {
            const res = await fetch('/api/investments/my-investments', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setInvestments(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvestments();
    }, []);

    const totalValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0);
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const totalProfit = totalValue - totalInvested;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Investments</h1>
                    <p className="text-slate-400 text-sm">Track your portfolio performance.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> New Investment
                </button>
            </div>

            {/* Portfolio Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <DollarSign size={20} />
                        <span className="text-sm font-medium">Total Portfolio Value</span>
                    </div>
                    <div className="text-3xl font-bold text-white">${totalValue.toFixed(2)}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <PieChart size={20} />
                        <span className="text-sm font-medium">Total Invested</span>
                    </div>
                    <div className="text-3xl font-bold text-white">${totalInvested.toLocaleString()}</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2 text-slate-400">
                        <TrendingUp size={20} />
                        <span className="text-sm font-medium">Total Profit/Loss</span>
                    </div>
                    <div className={`text-3xl font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-slate-900 dark:text-white">Loading...</div>
            ) : investments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {investments.map(inv => (
                        <InvestmentCard key={inv.id} investment={inv} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">Start Investing</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Build your wealth by investing in Mutual Funds, Stocks, and Bonds.
                    </p>
                </div>
            )}

            <BuyInvestmentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onBought={fetchInvestments}
            />
        </div>
    );
};

export default Investments;
