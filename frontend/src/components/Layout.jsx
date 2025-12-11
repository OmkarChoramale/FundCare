import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, ArrowRightLeft, PieChart, User, Settings, LogOut, Menu, X, Sun, Moon, TrendingUp, FileText, Users, Zap, Landmark, CreditCard, Shield } from 'lucide-react';

import { useTheme } from '../context/ThemeContext';
import NotificationCenter from './NotificationCenter';

const SidebarItem = ({ icon: Icon, label, path, active }) => {
    return (
        <Link to={path}>
            <motion.div
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-3 px-4 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-300 relative overflow-hidden group ${active
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                    }`}
            >
                {active && (
                    <div className="absolute inset-0 bg-white/20 blur-md opacity-50" />
                )}
                <Icon size={20} className="relative z-10" />
                <span className="font-medium text-sm relative z-10">{label}</span>
                {!active && <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400"><ArrowRightLeft size={14} /></div>}
            </motion.div>
        </Link>
    );
};

const Layout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: ArrowRightLeft, label: 'Transactions', path: '/transfer' },
        { icon: TrendingUp, label: 'Deposits', path: '/deposits' },
        { icon: Users, label: 'Beneficiaries', path: '/beneficiaries' },
        { icon: Zap, label: 'Bill Pay', path: '/bills' },
        { icon: Landmark, label: 'Loans', path: '/loans' },
        { icon: CreditCard, label: 'Cards', path: '/cards' },
        { icon: TrendingUp, label: 'Invest', path: '/investments' },
        ...(user.role === 'ADMIN' ? [{ icon: Shield, label: 'Admin', path: '/admin' }] : []),
        { icon: FileText, label: 'Services', path: '/services' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div
            className="flex h-screen bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500/30 overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: theme === 'dark' ? '#020617' : '#f8fafc' }}
        >
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                className={`fixed md:static inset-y-0 left-0 w-72 bg-white dark:bg-navy-900/50 dark:backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex flex-col z-50 transform md:transform-none transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/30">F</div>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">FundCare</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationCenter />
                        <button onClick={() => setSidebarOpen(false)} className="md:hidden text-slate-400">
                            <X size={24} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-hide">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">Menu</div>
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            {...item}
                            active={location.pathname === item.path}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-slate-200 dark:border-white/5 mx-4 mb-4">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors group"
                    >
                        <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium text-sm">Sign Out</span>
                    </button>
                </div>
            </motion.div>

            {/* Main Content */}
            <div
                className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white transition-colors duration-500 relative"
                style={{ backgroundColor: theme === 'dark' ? '#020617' : '#f8fafc' }}
            >
                {/* Background Gradients for Deep Effect */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-600/5 dark:bg-indigo-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-violet-600/5 dark:bg-violet-600/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen" />
                </div>

                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-200 dark:border-white/5 bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl z-30 sticky top-0">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">F</div>
                        <span className="font-bold text-slate-900 dark:text-white">FundCare</span>
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-600 dark:text-white">
                        <Menu size={24} />
                    </button>
                </div>

                {/* Desktop Header / Theme Toggle Area */}
                <div className="hidden md:flex justify-end p-6 absolute top-0 right-0 z-30">
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/10 transition-all shadow-sm backdrop-blur-md"
                    >
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8 relative z-20 scroll-smooth">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
