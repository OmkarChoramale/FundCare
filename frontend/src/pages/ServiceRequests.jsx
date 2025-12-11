import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Key, CreditCard, MapPin, Plus, Clock, CheckCircle, XCircle } from 'lucide-react';

const RequestCard = ({ request }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'REJECTED': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'CHEQUE_BOOK': return FileText;
            case 'LOCKER_FACILITY': return Key;
            case 'DEBIT_CARD_REPLACEMENT': return CreditCard;
            case 'ADDRESS_CHANGE': return MapPin;
            default: return FileText;
        }
    };

    const Icon = getIcon(request.type);

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="text-slate-900 dark:text-white font-medium">{request.type.replace(/_/g, ' ')}</h4>
                    <p className="text-xs text-slate-500">{new Date(request.requestDate).toLocaleDateString()}</p>
                </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(request.status)}`}>
                {request.status}
            </div>
        </motion.div>
    );
};

const NewRequestModal = ({ isOpen, onClose, onCreated }) => {
    const [type, setType] = useState('CHEQUE_BOOK');
    const [accountId, setAccountId] = useState('');
    const [details, setDetails] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);

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
        if (isOpen) fetchAccounts();
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/requests/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId, type, details })
            });
            if (res.ok) {
                onCreated();
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">New Service Request</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Request Type</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="CHEQUE_BOOK">Cheque Book</option>
                            <option value="LOCKER_FACILITY">Locker Facility</option>
                            <option value="DEBIT_CARD_REPLACEMENT">Debit Card Replacement</option>
                            <option value="ADDRESS_CHANGE">Address Change</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Account</label>
                        <select
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
                        >
                            {accounts.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.type} - {acc.accountNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">Additional Details</label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 h-24 resize-none"
                            placeholder="Any specific instructions..."
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
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

const ServiceRequests = () => {
    const [requests, setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        try {
            const res = await fetch('/api/requests/my-requests', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Service Requests</h1>
                    <p className="text-slate-400 text-sm">Manage your banking service requests.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                >
                    <Plus size={18} /> New Request
                </button>
            </div>

            {loading ? (
                <div className="text-slate-900 dark:text-white">Loading...</div>
            ) : requests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {requests.map(req => (
                        <RequestCard key={req.id} request={req} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <FileText size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">No Service Requests</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Need a cheque book or locker? Create a new service request here.
                    </p>
                </div>
            )}

            <NewRequestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={fetchRequests}
            />
        </div>
    );
};

export default ServiceRequests;
