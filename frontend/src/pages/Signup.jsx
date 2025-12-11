import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight, Shield } from 'lucide-react';

const Signup = () => {
    const navigate = useNavigate();
    const formRef = useRef(null);

    const handleSignup = async (e) => {
        if (e) e.preventDefault();
        console.log("Signup triggered");

        const form = formRef.current;
        if (!form) return;

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        console.log("Form data:", data);

        if (!data.fullName || !data.email || !data.password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            console.log("Sending request to backend...");
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    fullName: data.fullName,
                    email: data.email,
                    password: data.password
                }),
            });
            console.log("Response received:", response.status);

            if (response.ok) {
                alert('Account created successfully! Please login.');
                navigate('/login');
            } else {
                const error = await response.json();
                console.error("Signup error:", error);
                alert(error.message || 'Signup failed');
            }
        } catch (err) {
            console.error("Fetch error:", err);
            alert('Connection error');
        }
    };

    return (
        <div className="min-h-screen w-full bg-slate-950 flex relative overflow-hidden text-white">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex w-1/2 relative bg-emerald-950/20 items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-emerald-600/20 to-slate-950 z-0" />
                <div className="absolute bottom-[-20%] right-[-20%] w-[800px] h-[800px] bg-emerald-500/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-lg px-12 text-right">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold mb-8 leading-tight">
                            Join the future of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-400">
                                Digital Banking
                            </span>
                        </h1>
                        <p className="text-xl opacity-80 leading-relaxed text-slate-300">
                            Create an account in minutes and experience banking without borders, hidden fees, or headaches.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-950 relative">
                <div className="w-full max-w-md">
                    <div className="mb-10">
                        <h2 className="text-3xl font-bold mb-2 text-white">Create Account</h2>
                        <p className="text-slate-400">Start your journey with FundCare today.</p>
                    </div>

                    <form ref={formRef} onSubmit={handleSignup} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                <input
                                    type="text"
                                    name="fullName"
                                    required
                                    minLength={3}
                                    placeholder="John Doe"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="name@company.com"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={20} />
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    minLength={6}
                                    placeholder="Create a strong password"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSignup}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group mt-4"
                        >
                            <span>Create Account</span>
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <p className="mt-8 text-center opacity-70">
                        Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
