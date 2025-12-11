import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Info, AlertTriangle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationCenter = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            try {
                const [notifsRes, countRes] = await Promise.all([
                    fetch(`/api/notifications/user/${user.id}`),
                    fetch(`/api/notifications/user/${user.id}/unread-count`)
                ]);

                if (notifsRes.ok) setNotifications(await notifsRes.json());
                if (countRes.ok) {
                    const data = await countRes.json();
                    setUnreadCount(data.count);
                }
            } catch (e) {
                console.error(e);
            }
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) {
            console.error(e);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SUCCESS': return <Check size={16} className="text-emerald-400" />;
            case 'WARNING': return <AlertTriangle size={16} className="text-amber-400" />;
            case 'ERROR': return <XCircle size={16} className="text-rose-400" />;
            default: return <Info size={16} className="text-blue-400" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'SUCCESS': return 'bg-emerald-500/10';
            case 'WARNING': return 'bg-amber-500/10';
            case 'ERROR': return 'bg-rose-500/10';
            default: return 'bg-blue-500/10';
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-slate-800"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden z-50"
                    >
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 dark:text-white text-sm">Notifications</h3>
                            <span className="text-xs text-slate-500">{unreadCount} unread</span>
                        </div>

                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div
                                        key={notif.id}
                                        className={`p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer ${notif.read ? 'opacity-60' : 'bg-slate-800/20'}`}
                                        onClick={() => !notif.read && markAsRead(notif.id)}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getBgColor(notif.type)}`}>
                                                {getIcon(notif.type)}
                                            </div>
                                            <div>
                                                <h4 className={`text-sm font-medium ${notif.read ? 'text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                                                    {notif.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                                                <p className="text-[10px] text-slate-600 mt-2">
                                                    {new Date(notif.timestamp).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-500 text-sm">
                                    No notifications yet
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationCenter;
