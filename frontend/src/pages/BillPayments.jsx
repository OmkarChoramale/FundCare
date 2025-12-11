import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Smartphone, CreditCard, CheckCircle, AlertCircle, Wallet } from 'lucide-react';

const BillPaymentCard = ({ icon: Icon, label, category, onSelect, active }) => (
    <button
        onClick={() => onSelect(category)}
        className={`p-6 rounded-2xl border flex flex-col items-center gap-4 transition-all ${active ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:text-white'}`}
    >
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>
            <Icon size={24} />
        </div>
        <span className="font-bold">{label}</span>
    </button>
);

const BillPayments = () => {
    const [category, setCategory] = useState('ELECTRICITY');
    const [accounts, setAccounts] = useState([]);
    const [accountId, setAccountId] = useState('');
    const [billerName, setBillerName] = useState('');
    const [consumerNumber, setConsumerNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchAccounts = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                const res = await fetch(`/api/accounts/user/${user.id}`);
                const data = await res.json();
                setAccounts(data);
                if (data.length > 0) setAccountId(data[0].id);
            }
        };
        fetchAccounts();
    }, []);

    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', message: '' });

        try {
            const res = await fetch('/api/bills/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    accountId,
                    billerName,
                    category,
                    consumerNumber,
                    amount
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', message: 'Bill Payment Successful!' });
                setAmount('');
                setConsumerNumber('');
                setBillerName('');
            } else {
                setStatus({ type: 'error', message: data.message || 'Payment failed' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Bill Payments</h1>
            <p className="text-slate-400 text-sm mb-8">Pay your utility bills and recharge instantly.</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
                <BillPaymentCard
                    icon={Zap}
                    label="Electricity"
                    category="ELECTRICITY"
                    active={category === 'ELECTRICITY'}
                    onSelect={setCategory}
                />
                <BillPaymentCard
                    icon={Smartphone}
                    label="Mobile Recharge"
                    category="MOBILE"
                    active={category === 'MOBILE'}
                    onSelect={setCategory}
                />
                <BillPaymentCard
                    icon={CreditCard}
                    label="Credit Card"
                    category="CREDIT_CARD"
                    active={category === 'CREDIT_CARD'}
                    onSelect={setCategory}
                />
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
                {status.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-6 flex items-center gap-3 ${status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}
                    >
                        {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        {status.message}
                    </motion.div>
                )}

                <form onSubmit={handlePay} className="space-y-6 max-w-lg mx-auto">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Pay From</label>
                        <div className="relative">
                            <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <select
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500 appearance-none"
                            >
                                {accounts.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {acc.type} - {acc.accountNumber} (${acc.balance.toLocaleString()})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            {category === 'MOBILE' ? 'Operator Name' : category === 'CREDIT_CARD' ? 'Bank Name' : 'Board Name'}
                        </label>
                        <input
                            type="text"
                            value={billerName}
                            onChange={(e) => setBillerName(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder={category === 'MOBILE' ? 'Airtel, Jio...' : 'TATA Power...'}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            {category === 'MOBILE' ? 'Mobile Number' : category === 'CREDIT_CARD' ? 'Card Number' : 'Consumer Number'}
                        </label>
                        <input
                            type="text"
                            value={consumerNumber}
                            onChange={(e) => setConsumerNumber(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="1234567890"
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
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                    >
                        {loading ? 'Processing...' : 'Pay Bill'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BillPayments;
