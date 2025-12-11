import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Trash2, ShieldAlert, Save, AlertTriangle, User, CreditCard, Landmark } from 'lucide-react';
import axios from 'axios';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [accounts, setAccounts] = useState([]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [deleteData, setDeleteData] = useState({
        password: '',
        confirmText: ''
    });

    const [adminRequest, setAdminRequest] = useState('');

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await axios.get('http://localhost:8080/api/accounts/my-accounts', { withCredentials: true });
                setAccounts(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAccounts();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/settings/change-password', {
                userId: user.id,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password changed successfully' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password' });
        }
        setLoading(false);
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        if (deleteData.confirmText !== 'DELETE') {
            setMessage({ type: 'error', text: 'Please type DELETE to confirm' });
            return;
        }

        if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/settings/delete-account', {
                userId: user.id,
                password: deleteData.password
            });
            localStorage.removeItem('user');
            window.location.href = '/login';
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete account' });
        }
        setLoading(false);
    };

    const handleAdminRequest = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/settings/request-admin', {
                userId: user.id,
                reason: adminRequest
            });
            setMessage({ type: 'success', text: 'Admin access request submitted successfully' });
            setAdminRequest('');
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to submit request' });
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-8 pb-20">
            <header>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage your account preferences and security</p>
            </header>

            {message.text && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}
                >
                    {message.text}
                </motion.div>
            )}

            <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-4 px-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'profile' ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    My Profile
                    {activeTab === 'profile' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('security')}
                    className={`pb-4 px-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'security' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Security
                    {activeTab === 'security' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400" />
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('danger')}
                    className={`pb-4 px-4 font-medium transition-colors relative whitespace-nowrap ${activeTab === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                        }`}
                >
                    Danger Zone
                    {activeTab === 'danger' && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-400" />
                    )}
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                {activeTab === 'profile' && (
                    <div className="space-y-8">
                        <section>
                            <div className="flex items-center gap-2 mb-6">
                                <User className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Personal Information</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user?.fullName}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{user?.email}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User ID</label>
                                    <div className="text-lg font-mono text-gray-900 dark:text-white">#{user?.id}</div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Account Status</label>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                        Active
                                    </span>
                                </div>
                            </div>
                        </section>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <div className="flex items-center gap-2 mb-6">
                                <Landmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Bank Account Details</h2>
                            </div>
                            {accounts.length > 0 ? (
                                <div className="space-y-6">
                                    {accounts.map((acc, index) => (
                                        <div key={acc.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="font-bold text-gray-900 dark:text-white">{acc.type} ACCOUNT</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">FundCare Bank</p>
                                                </div>
                                                {index === 0 && (
                                                    <span className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs font-bold px-2 py-1 rounded">Primary</span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Account Number</label>
                                                    <div className="font-mono font-bold text-lg text-gray-900 dark:text-white">{acc.accountNumber}</div>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">IFSC Code</label>
                                                    <div className="font-mono font-bold text-lg text-gray-900 dark:text-white">FCB0001234</div>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Balance</label>
                                                    <div className="font-bold text-lg text-emerald-600 dark:text-emerald-400">${acc.balance.toLocaleString()}</div>
                                                </div>
                                                <div>
                                                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Branch</label>
                                                    <div className="font-bold text-lg text-gray-900 dark:text-white">Main Branch, NY</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    No accounts found.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="space-y-8">
                        <section>
                            <div className="flex items-center gap-2 mb-4">
                                <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
                            </div>
                            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    Update Password
                                </button>
                            </form>
                        </section>

                        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldAlert className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Request Admin Access</h2>
                            </div>
                            <form onSubmit={handleAdminRequest} className="space-y-4 max-w-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Request</label>
                                    <textarea
                                        required
                                        rows="3"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                                        placeholder="Why do you need admin access?"
                                        value={adminRequest}
                                        onChange={(e) => setAdminRequest(e.target.value)}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                                >
                                    Submit Request
                                </button>
                            </form>
                        </div>
                    </div>
                )}

                {activeTab === 'danger' && (
                    <div className="space-y-6">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3">
                            <AlertTriangle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-900 dark:text-red-200">Warning: Irreversible Action</h3>
                                <p className="text-red-700 dark:text-red-300 text-sm mt-1">
                                    Deleting your account will permanently remove all your data, including transaction history, accounts, and investments. This action cannot be undone.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleDeleteAccount} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500"
                                    value={deleteData.password}
                                    onChange={(e) => setDeleteData({ ...deleteData, password: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type "DELETE" to confirm</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-red-500"
                                    value={deleteData.confirmText}
                                    onChange={(e) => setDeleteData({ ...deleteData, confirmText: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 w-full justify-center"
                            >
                                <Trash2 className="w-4 h-4" />
                                Delete Account Permanently
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Settings;
