import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightLeft, User, Users, Wallet, CheckCircle, AlertCircle, RefreshCw, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Transfer = () => {
    const [activeTab, setActiveTab] = useState('quick');
    const [accounts, setAccounts] = useState([]);
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [processing, setProcessing] = useState(false);

    // Form States
    const [senderAccountId, setSenderAccountId] = useState('');
    const [receiverAccountNumber, setReceiverAccountNumber] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');

    // Self Transfer Specific
    const [selfReceiverAccountId, setSelfReceiverAccountId] = useState('');

    // Beneficiary Specific
    const [selectedBeneficiaryId, setSelectedBeneficiaryId] = useState('');

    // UPI Specific
    const [upiId, setUpiId] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                try {
                    const [accRes, benRes] = await Promise.all([
                        fetch(`/api/accounts/user/${user.id}`),
                        fetch(`/api/beneficiaries/user/${user.id}`)
                    ]);

                    if (accRes.ok) {
                        const accData = await accRes.json();
                        setAccounts(accData);
                        if (accData.length > 0) setSenderAccountId(accData[0].id);
                    }

                    if (benRes.ok) {
                        const benData = await benRes.json();
                        setBeneficiaries(benData);
                    }
                } catch (e) {
                    console.error(e);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchData();
    }, []);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setStatus({ type: '', message: '' });

        let finalReceiverAccount = receiverAccountNumber;
        let type = 'THIRD_PARTY_TRANSFER';
        let mode = 'IMPS';
        let finalDescription = description;

        if (activeTab === 'self') {
            const receiverAcc = accounts.find(a => a.id === parseInt(selfReceiverAccountId));
            if (!receiverAcc) {
                setStatus({ type: 'error', message: 'Invalid receiver account' });
                setProcessing(false);
                return;
            }
            finalReceiverAccount = receiverAcc.accountNumber;
            type = 'SELF_TRANSFER';
            mode = 'INTERNAL';
        } else if (activeTab === 'beneficiary') {
            // Already set via selection
            mode = 'NEFT'; // Default for beneficiary
        } else if (activeTab === 'upi') {
            if (!upiId.includes('@')) {
                setStatus({ type: 'error', message: 'Invalid UPI ID' });
                setProcessing(false);
                return;
            }
            mode = 'UPI';
            finalDescription = `UPI Payment to ${upiId}: ${description}`;
            // Demo logic for receiver
            finalReceiverAccount = accounts[0].accountNumber;
        }

        try {
            const res = await fetch('/api/transactions/transfer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    senderAccountId,
                    receiverAccountNumber: finalReceiverAccount,
                    amount,
                    description: finalDescription,
                    type,
                    mode
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus({ type: 'success', message: 'Transfer Successful!' });
                setAmount('');
                setDescription('');
            } else {
                setStatus({ type: 'error', message: data.message || 'Transfer failed' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error' });
        } finally {
            setProcessing(false);
        }
    };

    const handleBeneficiarySelect = (e) => {
        const benId = e.target.value;
        setSelectedBeneficiaryId(benId);
        const ben = beneficiaries.find(b => b.id === parseInt(benId));
        if (ben) {
            setReceiverAccountNumber(ben.accountNumber);
        } else {
            setReceiverAccountNumber('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Transfer Funds</h1>
            <p className="text-slate-400 text-sm mb-8">Securely move money between accounts or to other people.</p>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button
                        onClick={() => setActiveTab('quick')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'quick' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <ArrowRightLeft size={18} /> Quick Transfer
                    </button>
                    <button
                        onClick={() => setActiveTab('self')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'self' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <RefreshCw size={18} /> Self Transfer
                    </button>
                    <button
                        onClick={() => setActiveTab('beneficiary')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'beneficiary' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <Users size={18} /> Beneficiary
                    </button>
                    <button
                        onClick={() => setActiveTab('upi')}
                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'upi' ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border-b-2 border-indigo-500' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                    >
                        <QrCode size={18} /> UPI / QR
                    </button>
                </div>

                <div className="p-8">
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

                    <form onSubmit={handleTransfer} className="space-y-6">
                        {/* From Account (Common) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">From Account</label>
                            <div className="relative">
                                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <select
                                    value={senderAccountId}
                                    onChange={(e) => setSenderAccountId(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                >
                                    {accounts.map(acc => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.type} - {acc.accountNumber} (${acc.balance.toLocaleString()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Dynamic Fields based on Tab */}
                        {activeTab === 'quick' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <label className="block text-sm font-medium text-slate-400 mb-2">To Account Number</label>
                                <input
                                    type="text"
                                    value={receiverAccountNumber}
                                    onChange={(e) => setReceiverAccountNumber(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Enter 10-digit account number"
                                    required
                                />
                            </motion.div>
                        )}

                        {activeTab === 'self' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <label className="block text-sm font-medium text-slate-400 mb-2">To Account</label>
                                <div className="relative">
                                    <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <select
                                        value={selfReceiverAccountId}
                                        onChange={(e) => setSelfReceiverAccountId(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                        required
                                    >
                                        <option value="">Select Account</option>
                                        {accounts.filter(a => a.id !== parseInt(senderAccountId)).map(acc => (
                                            <option key={acc.id} value={acc.id}>
                                                {acc.type} - {acc.accountNumber} (${acc.balance.toLocaleString()})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'beneficiary' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Select Beneficiary</label>
                                <div className="relative">
                                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <select
                                        value={selectedBeneficiaryId}
                                        onChange={handleBeneficiarySelect}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 appearance-none"
                                        required
                                    >
                                        <option value="">Select Payee</option>
                                        {beneficiaries.map(ben => (
                                            <option key={ben.id} value={ben.id}>
                                                {ben.name} ({ben.bankName})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {receiverAccountNumber && (
                                    <div className="mt-2 text-xs text-slate-500 pl-1">
                                        Account: {receiverAccountNumber}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'upi' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <label className="block text-sm font-medium text-slate-400 mb-2">UPI ID / VPA</label>
                                <div className="relative">
                                    <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                    <input
                                        type="text"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                        placeholder="merchant@upi"
                                        required
                                    />
                                </div>
                                <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 flex items-center justify-center flex-col gap-2 text-slate-500">
                                    <QrCode size={48} className="opacity-50" />
                                    <span className="text-xs">Scan QR Code (Simulation)</span>
                                </div>
                            </motion.div>
                        )}

                        {/* Amount & Description (Common) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Amount ($)</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Description</label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="Rent, Dinner, etc."
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg shadow-indigo-600/20"
                        >
                            {processing ? 'Processing Transfer...' : 'Confirm Transfer'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Transfer;
