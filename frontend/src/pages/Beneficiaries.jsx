import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Trash2, Search, User, Building } from 'lucide-react';

const BeneficiaryCard = ({ beneficiary, onDelete }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between group hover:border-indigo-500/50 transition-all"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-bold text-lg">
                    {beneficiary.name.charAt(0)}
                </div>
                <div>
                    <h4 className="text-slate-900 dark:text-white font-bold">{beneficiary.name}</h4>
                    <p className="text-xs text-slate-400">{beneficiary.bankName} • {beneficiary.accountNumber}</p>
                    {beneficiary.nickname && (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">
                            {beneficiary.nickname}
                        </span>
                    )}
                </div>
            </div>
            <button
                onClick={() => onDelete(beneficiary.id)}
                className="p-2 rounded-lg text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 size={18} />
            </button>
        </motion.div>
    );
};

const AddBeneficiaryModal = ({ isOpen, onClose, onAdded }) => {
    const [formData, setFormData] = useState({
        name: '',
        accountNumber: '',
        bankName: '',
        ifscCode: '',
        nickname: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await fetch('/api/beneficiaries/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, userId: user.id })
            });
            if (res.ok) {
                onAdded();
                onClose();
                setFormData({ name: '', accountNumber: '', bankName: '', ifscCode: '', nickname: '' });
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Add New Beneficiary</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Account Number</label>
                        <input
                            type="text"
                            value={formData.accountNumber}
                            onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="1234567890"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Bank Name</label>
                            <div className="relative">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                                <input
                                    type="text"
                                    value={formData.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-indigo-500"
                                    placeholder="HDFC"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">IFSC Code</label>
                            <input
                                type="text"
                                value={formData.ifscCode}
                                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                                placeholder="HDFC0001234"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Nickname (Optional)</label>
                        <input
                            type="text"
                            value={formData.nickname}
                            onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500"
                            placeholder="Mom, Rent, etc."
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
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
                            {loading ? 'Adding...' : 'Add Payee'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const Beneficiaries = () => {
    const [beneficiaries, setBeneficiaries] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchBeneficiaries = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            try {
                const res = await fetch(`/api/beneficiaries/user/${user.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setBeneficiaries(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this beneficiary?')) {
            try {
                await fetch(`/api/beneficiaries/${id}`, { method: 'DELETE' });
                fetchBeneficiaries();
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        fetchBeneficiaries();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Beneficiaries</h1>
                    <p className="text-slate-400 text-sm">Manage your saved payees for quick transfers.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    <UserPlus size={18} /> Add Payee
                </button>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : beneficiaries.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {beneficiaries.map(b => (
                        <BeneficiaryCard key={b.id} beneficiary={b} onDelete={handleDelete} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <UserPlus size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">No Beneficiaries Added</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Add your friends and family as beneficiaries to make quick and secure transfers.
                    </p>
                </div>
            )}

            <AddBeneficiaryModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAdded={fetchBeneficiaries}
            />
        </div>
    );
};

export default Beneficiaries;
