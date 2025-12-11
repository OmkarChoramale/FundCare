import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, TrendingUp, Calendar, DollarSign, ShieldCheck, Clock } from 'lucide-react';

const DepositCard = ({ deposit }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 transition-all group-hover:bg-indigo-500/10" />

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                        {deposit.type.replace('_', ' ')}
                    </span>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mt-2">
                        ${deposit.principalAmount.toLocaleString()}
                    </h3>
                </div>
                <div className="text-right">
                    <div className="text-emerald-400 font-bold text-lg">{deposit.interestRate}%</div>
                    <div className="text-slate-500 text-xs">Interest Rate</div>
                </div>
            </div>

            <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                        <Calendar size={14} /> Maturity Date
                    </span>
                    <span className="text-slate-200">{new Date(deposit.maturityDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2">
                        <TrendingUp size={14} /> Maturity Amount
                    </span>
                    <span className="text-emerald-400 font-bold">${deposit.maturityAmount.toLocaleString()}</span>
                </div>
            </div>
        </motion.div>
    );
};

const CreateDepositModal = ({ isOpen, onClose, onCreated }) => {
    const [type, setType] = useState('FIXED_DEPOSIT');
    const [amount, setAmount] = useState('');
    const [duration, setDuration] = useState(12);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/deposits/create-my-deposit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type,
                    amount: parseFloat(amount),
                    durationMonths: parseInt(duration)
                })
            });

            if (res.ok) {
                onCreated();
                onClose();
            } else {
                alert("Failed to create deposit");
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
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md relative"
            >
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Open New Deposit</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Deposit Type</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setType('FIXED_DEPOSIT')}
                                className={`p-3 rounded-xl border text-sm font-bold transition-all ${type === 'FIXED_DEPOSIT' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Fixed Deposit
                            </button>
                            <button
                                type="button"
                                onClick={() => setType('RECURRING_DEPOSIT')}
                                className={`p-3 rounded-xl border text-sm font-bold transition-all ${type === 'RECURRING_DEPOSIT' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700'}`}
                            >
                                Recurring Deposit
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Amount ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="5000"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Duration (Months)</label>
                        <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                <option value="6">6 Months</option>
                                <option value="12">12 Months (1 Year)</option>
                                <option value="24">24 Months (2 Years)</option>
                                <option value="36">36 Months (3 Years)</option>
                                <option value="60">60 Months (5 Years)</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex gap-3">
                        <ShieldCheck className="text-emerald-500 shrink-0" size={20} />
                        <div className="text-xs text-emerald-200">
                            <span className="font-bold block mb-1">Guaranteed Returns</span>
                            Interest rate of {type === 'FIXED_DEPOSIT' ? '6.5%' : '7.0%'} p.a. locked for the entire tenure.
                        </div>
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
                        >
                            {loading ? 'Creating...' : 'Create Deposit'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const Deposits = () => {
    const [deposits, setDeposits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchDeposits = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            try {
                const res = await fetch(`/api/deposits/user/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setDeposits(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchDeposits();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Deposits & Investments</h1>
                    <p className="text-slate-400 text-sm">Grow your wealth with secure fixed and recurring deposits.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Open New Deposit
                </button>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : deposits.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {deposits.map(deposit => (
                        <DepositCard key={deposit.id} deposit={deposit} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <TrendingUp size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">No Active Deposits</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Start saving for your future goals with our high-interest Fixed and Recurring Deposit schemes.
                    </p>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors"
                    >
                        Start Saving Now
                    </button>
                </div>
            )}

            <CreateDepositModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={fetchDeposits}
            />
        </div>
    );
};

export default Deposits;
