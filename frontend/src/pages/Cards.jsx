import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Shield, Lock, Unlock, Plus, Wifi, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 10000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border ${type === 'success' ? 'bg-emerald-500/95 border-emerald-500/20 text-white' : 'bg-rose-500/95 border-rose-500/20 text-white'
                } backdrop-blur-md min-w-[300px] justify-between`}
        >
            <div className="flex items-center gap-3">
                {type === 'success' ? <CheckCircle size={24} /> : <AlertTriangle size={24} />}
                <span className="font-bold text-lg">{message}</span>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <XCircle size={20} />
            </button>
        </motion.div>
    );
};

const CardItem = ({ card, onToggleBlock }) => {
    const isBlocked = card.status === 'BLOCKED';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative w-full max-w-sm aspect-[1.586] rounded-2xl p-6 text-white shadow-2xl overflow-hidden transition-all ${isBlocked ? 'grayscale opacity-75' : ''}`}
            style={{
                background: card.type === 'CREDIT'
                    ? 'linear-gradient(135deg, #0f172a 0%, #334155 100%)'
                    : 'linear-gradient(135deg, #4f46e5 0%, #818cf8 100%)'
            }}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                        <Wifi size={24} className="rotate-90" />
                        <span className="text-xs font-mono opacity-70">{card.type} CARD</span>
                    </div>
                    <div className="text-xl font-bold italic opacity-80">FundCare</div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-yellow-400/80 rounded-md"></div>
                        <div className="text-2xl font-mono tracking-widest drop-shadow-md">
                            {card.cardNumber}
                        </div>
                    </div>

                    <div className="flex justify-between items-end">
                        <div>
                            <div className="text-xs opacity-70 mb-1">Card Holder</div>
                            <div className="font-medium tracking-wide">{card.cardHolderName}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs opacity-70 mb-1">Expires</div>
                            <div className="font-mono">{card.expiryDate}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Block Overlay */}
            {isBlocked && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
                    <div className="flex flex-col items-center text-rose-500">
                        <Lock size={48} />
                        <span className="font-bold mt-2">BLOCKED</span>
                    </div>
                </div>
            )}

            {/* Controls */}
            <div className="absolute bottom-4 right-4 z-30">
                <button
                    onClick={() => onToggleBlock(card.id)}
                    className={`p-2 rounded-full backdrop-blur-md border transition-colors ${isBlocked ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30' : 'bg-rose-500/20 border-rose-500/50 text-rose-400 hover:bg-rose-500/30'}`}
                    title={isBlocked ? "Unblock Card" : "Block Card"}
                >
                    {isBlocked ? <Unlock size={20} /> : <Lock size={20} />}
                </button>
            </div>
        </motion.div>
    );
};

const Cards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
    };

    const fetchCards = async () => {
        try {
            const res = await fetch('/api/cards/my-cards', { credentials: 'include' });
            if (res.ok) {
                const data = await res.json();
                setCards(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    const handleIssueCard = async (type) => {
        setProcessing(true);
        try {
            const res = await fetch('/api/cards/issue-my-card', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ type })
            });
            if (res.ok) {
                showToast(`${type === 'CREDIT' ? 'Credit' : 'Debit'} Card Issued Successfully!`, 'success');
                fetchCards();
            } else {
                showToast('Failed to issue card', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Network error', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const handleToggleBlock = async (cardId) => {
        try {
            const res = await fetch(`/api/cards/${cardId}/toggle-block`, {
                method: 'POST',
                credentials: 'include'
            });
            if (res.ok) {
                fetchCards();
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="space-y-8 pb-10">
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Cards</h1>
                    <p className="text-slate-400 text-sm">Manage your virtual debit and credit cards.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => handleIssueCard('DEBIT')}
                        disabled={processing}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        <Plus size={18} /> {processing ? 'Processing...' : 'New Debit Card'}
                    </button>
                    <button
                        onClick={() => handleIssueCard('CREDIT')}
                        disabled={processing}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2 border border-slate-700 disabled:opacity-50"
                    >
                        <Plus size={18} /> {processing ? 'Processing...' : 'New Credit Card'}
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-white">Loading...</div>
            ) : cards.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map(card => (
                        <CardItem key={card.id} card={card} onToggleBlock={handleToggleBlock} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-2xl border-dashed">
                    <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <CreditCard size={32} />
                    </div>
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-2">No Cards Found</h3>
                    <p className="text-slate-400 max-w-md mx-auto mb-6">
                        Issue a new virtual card instantly to start making payments.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <Shield className="text-emerald-400 mb-4" size={32} />
                    <h3 className="text-slate-900 dark:text-white font-bold mb-2">Secure Payments</h3>
                    <p className="text-slate-400 text-sm">Your cards are protected with 256-bit encryption and 2FA.</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <Lock className="text-amber-400 mb-4" size={32} />
                    <h3 className="text-slate-900 dark:text-white font-bold mb-2">Instant Freeze</h3>
                    <p className="text-slate-400 text-sm">Lost your card? Freeze it instantly from the app to prevent misuse.</p>
                </div>
                <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                    <Wifi className="text-indigo-400 mb-4" size={32} />
                    <h3 className="text-slate-900 dark:text-white font-bold mb-2">Contactless Ready</h3>
                    <p className="text-slate-400 text-sm">All cards support NFC for tap-to-pay at supported terminals.</p>
                </div>
            </div>
        </div>
    );
};

export default Cards;
