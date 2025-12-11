import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Globe, Smartphone, ChevronRight, CreditCard, Lock, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-600 dark:text-white transition-colors"
        >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
};

const Navbar = () => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/50 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 transition-colors">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold">
                    F
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">FundCare</span>
            </div>
            <div className="flex items-center gap-8">
                <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <a href="#features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Features</a>
                    <a href="#security" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Security</a>
                    <a href="#business" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Business</a>
                </div>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    {localStorage.getItem('user') ? (
                        <Link to="/dashboard" className="px-5 py-2.5 bg-white text-slate-950 text-sm font-bold rounded-full hover:bg-indigo-50 transition-all shadow-lg shadow-white/10">
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link to="/login" className="text-sm font-medium text-slate-600 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors">
                                Sign In
                            </Link>
                            <Link to="/signup" className="px-5 py-2.5 bg-indigo-600 dark:bg-white text-white dark:text-slate-950 text-sm font-bold rounded-full hover:bg-indigo-700 dark:hover:bg-indigo-50 transition-all shadow-lg shadow-indigo-600/20 dark:shadow-white/10">
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    </nav>
);

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors">
            {/* Deep Aurora Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-violet-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] left-[40%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '4s' }} />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-6 backdrop-blur-md">
                            The Future of Banking
                        </span>
                        <h1 className="text-6xl md:text-8xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight mb-8">
                            Banking with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400">
                                Deep Intelligence
                            </span>
                        </h1>
                        <p className="text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Experience the next evolution of financial technology. Seamless transactions,
                            powerful analytics, and military-grade security in one beautiful interface.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-600/25 flex items-center gap-2 group">
                                Open Account
                                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/login" className="px-8 py-4 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-full font-bold text-lg transition-all backdrop-blur-md shadow-lg dark:shadow-none">
                                View Demo
                            </Link>
                        </div>
                    </motion.div>

                    {/* Abstract UI Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40, rotateX: 20 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        transition={{ delay: 0.4, duration: 1, ease: "easeOut" }}
                        className="mt-20 relative mx-auto max-w-5xl perspective-1000"
                    >
                        <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-indigo-500/10 ring-1 ring-white/10">
                            <div className="rounded-xl overflow-hidden bg-slate-950 aspect-[16/9] relative">
                                {/* Mock UI Elements */}
                                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-950" />
                                <div className="absolute top-0 left-0 w-64 h-full border-r border-white/5 bg-slate-900/50 p-6 hidden md:block">
                                    <div className="w-32 h-4 bg-white/10 rounded mb-8" />
                                    <div className="space-y-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="w-full h-8 bg-white/5 rounded" />
                                        ))}
                                    </div>
                                </div>
                                <div className="absolute top-8 right-8 left-8 md:left-72">
                                    <div className="flex justify-between items-end mb-8">
                                        <div className="w-48 h-8 bg-white/10 rounded" />
                                        <div className="w-32 h-10 bg-indigo-600/20 rounded" />
                                    </div>
                                    <div className="grid grid-cols-3 gap-6">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-32 bg-white/5 rounded-xl border border-white/5" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

const Feature = ({ icon: Icon, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.6 }}
        className="p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors group"
    >
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6 group-hover:scale-110 transition-transform">
            <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{desc}</p>
    </motion.div>
);

const Features = () => (
    <section className="py-32 bg-white dark:bg-slate-950 relative transition-colors" id="features">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Feature
                    icon={Shield}
                    title="Bank-Grade Security"
                    desc="Your assets are protected by AES-256 encryption and biometric authentication protocols."
                    delay={0.1}
                />
                <Feature
                    icon={Globe}
                    title="Global Payments"
                    desc="Send money to over 140 countries with real-time exchange rates and zero hidden fees."
                    delay={0.2}
                />
                <Feature
                    icon={Smartphone}
                    title="Mobile First"
                    desc="Manage your entire financial life from your pocket with our award-winning mobile app."
                    delay={0.3}
                />
            </div>
        </div>
    </section>
);

const Home = () => {
    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-900 dark:text-slate-200 selection:bg-indigo-500/30 transition-colors">
            <Navbar />
            <Hero />
            <Features />

            {/* Footer */}
            <footer className="py-12 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-950 transition-colors">
                <div className="container mx-auto px-6 text-center text-slate-500 text-sm">
                    <p>&copy; 2025 FundCare Bank. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Home;
