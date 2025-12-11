import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, CheckCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    email: data.email,
                    password: data.password
                }),
            });

            if (response.ok) {
                const result = await response.json();
                localStorage.setItem('user', JSON.stringify(result.user));

                if (result.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/dashboard');
                }
            } else {
                alert('Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            alert('Connection error');
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex relative overflow-hidden transition-colors">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-indigo-950/20 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-slate-950 z-0" />
                <div className="absolute top-[-20%] left-[-20%] w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-lg px-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold mb-8 leading-tight">
                            Welcome back to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">
                                FundCare
                            </span>
                        </h1>
                        <div className="space-y-6">
                            {[
                                "Real-time transaction monitoring",
                                "Advanced fraud protection",
                                "Instant global transfers"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-4 text-slate-300">
                                    <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <CheckCircle size={16} />
                                    </div>
                                    <span className="text-lg">{item}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-navy-950 relative transition-colors duration-500">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2">Sign in</h2>
                        <p className="opacity-70">Enter your credentials to access your account.</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="name@company.com"
                                    className="w-full bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                                <a href="#" className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="w-full bg-slate-50 dark:bg-navy-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-4 pl-12 pr-4 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all flex items-center justify-center gap-2 group transform hover:-translate-y-0.5"
                        >
                            <span>Sign In</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center opacity-70">
                        Don't have an account? <Link to="/signup" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-bold">Sign up</Link>
                    </p>
                    <div className="mt-4 text-center space-y-2">
                        <button
                            onClick={() => alert("Please use your Admin credentials to log in via the main form.")}
                            className="text-sm text-slate-400 hover:text-indigo-500 transition-colors block w-full"
                        >
                            Admin Login
                        </button>
                        <button
                            onClick={() => {
                                const current = localStorage.getItem('theme') || 'dark';
                                const next = current === 'dark' ? 'light' : 'dark';
                                localStorage.setItem('theme', next);
                                window.location.reload();
                            }}
                            className="text-xs text-slate-400 hover:text-indigo-500 transition-colors uppercase tracking-wider font-bold"
                        >
                            Toggle Theme (Fix Display)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
