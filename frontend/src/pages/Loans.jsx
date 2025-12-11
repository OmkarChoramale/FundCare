import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, GraduationCap, Car, Home, Briefcase, Plus, CheckCircle, Clock, XCircle } from 'lucide-react';

const LoanCard = ({ loan }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'HOME_LOAN': return Home;
            case 'EDUCATION_LOAN': return GraduationCap;
            case 'CAR_LOAN': return Car;
            case 'PERSONAL_LOAN': return Briefcase;
            default: return Landmark;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'REJECTED': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'ACTIVE': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
            default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
    };

    const Icon = getIcon(loan.type);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-all"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Icon size={100} />
            </div>

            <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400">
                    <Icon size={24} />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(loan.status)}`}>
                    {loan.status}
                </span>
            </div>

            <div className="relative z-10">
                <h3 className="text-slate-400 text-sm font-medium mb-1">{loan.type.replace(/_/g, ' ')}</h3>
                <div className="text-2xl font-bold text-slate-900 dark:text-white mb-4">${loan.amount.toLocaleString()}</div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-slate-500 text-xs">Interest Rate</p>
                        <p className="text-slate-600 dark:text-white font-medium">{loan.interestRate}%</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs">Tenure</p>
                        <p className="text-slate-600 dark:text-white font-medium">{loan.tenureMonths} Months</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs">EMI</p>
                        <p className="text-slate-600 dark:text-white font-medium">${loan.emiAmount.toLocaleString()}/mo</p>
                    </div>
                    <div>
                        <p className="text-slate-500 text-xs">Applied On</p>
                        <p className="text-slate-600 dark:text-white font-medium">{new Date(loan.applicationDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ApplyLoanModal = ({ isOpen, onClose, onApplied }) => {
    const [type, setType] = useState('PERSONAL_LOAN');
    const [amount, setAmount] = useState('');
    const [tenure, setTenure] = useState('12');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/loans/apply-my-loan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    type,
                    amount,
                    tenure
                })
            });
            if (res.ok) {
                onApplied();
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Apply for Loan</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Loan Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="PERSONAL_LOAN">Personal Loan (12.5%)</option>
                            <option value="HOME_LOAN">Home Loan (8.5%)</option>
                            <option value="CAR_LOAN">Car Loan (9.0%)</option>
                            <option value="EDUCATION_LOAN">Education Loan (10.0%)</option>
                            <option value="GOLD_LOAN">Gold Loan (7.5%)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Amount ($)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                            placeholder="50000"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Tenure (Months)</label>
                        <select
                            value={tenure}
                            onChange={(e) => setTenure(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="12">12 Months (1 Year)</option>
                            <option value="24">24 Months (2 Years)</option>
                            <option value="36">36 Months (3 Years)</option>
                            <option value="60">60 Months (5 Years)</option>
                            <option value="120">120 Months (10 Years)</option>
                        </select>
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
                            {loading ? 'Submitting...' : 'Apply Now'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const Loans = () => {
    const [loans, setLoans] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchLoans = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            try {
                const res = await fetch(`/api/loans/user/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setLoans(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchLoans();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Loans</h1>
                    <p className="text-slate-400 text-sm">Manage your active loans and applications.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> Apply New Loan
                </button>
            </div>

            {loading ? (
                <div className="text-slate-900 dark:text-white">Loading...</div>
            ) : loans.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loans.map(loan => (
                        <LoanCard key={loan.id} loan={loan} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <Landmark size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">No Active Loans</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Need financial support? Apply for a Personal, Home, or Education loan today.
                    </p>
                </div>
            )}

            <ApplyLoanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onApplied={fetchLoans}
            />
        </div>
    );
};

export default Loans;
