import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../../store/useStore';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const { login, isAuthLoading, clearError } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading(isLogin ? 'Signing in...' : 'Creating your account...');
        try {
            if (isLogin) {
                const success = await login(email, password);
                if (success) {
                    toast.success('Welcome back!', { id: loadToast });
                    navigate('/');
                } else {
                    toast.error('Invalid email or password.', { id: loadToast });
                }
            } else {
                const { default: apiClient } = await import('../../api/apiClient');
                await apiClient.post('/auth/signup', { email, password });
                toast.success('Account created! You can now log in.', { id: loadToast });
                setIsLogin(true);
            }
        } catch (err) {
            toast.error(err.response?.data?.detail || 'An error occurred. Please try again.', { id: loadToast });
        }
    };

    return (
        <div className="relative min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-teal-50 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full max-w-[440px] relative z-10"
            >
                <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 p-10 md:p-12">
                    {/* Logo Section */}
                    <div className="flex flex-col items-center mb-10">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 mb-6">
                            <ShieldCheck className="text-white" size={32} />
                        </div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h1>
                        <p className="text-slate-500 mt-2 font-medium">
                            {isLogin ? 'Welcome back to AcaAssess' : 'Get started with your dashboard'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value); clearError(); }}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 py-4 pl-12 pr-4 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900 placeholder:text-slate-400 outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-slate-700">Password</label>
                                {isLogin && (
                                    <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">
                                        Forgot password?
                                    </button>
                                )}
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); clearError(); }}
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 py-4 pl-12 pr-4 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900 placeholder:text-slate-400 outline-none"
                                />
                            </div>
                        </div>

                        {isLogin && (
                            <div className="flex items-center space-x-2 ml-1">
                                <label className="relative flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={rememberMe}
                                        onChange={() => setRememberMe(!rememberMe)}
                                    />
                                    <div className="w-5 h-5 bg-slate-100 border border-slate-200 rounded-md peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all"></div>
                                    <CheckCircle2 className={`absolute left-0 top-0 text-white p-1 opacity-0 ${rememberMe ? 'opacity-100' : ''}`} size={20} />
                                </label>
                                <span className="text-sm font-medium text-slate-600">Remember me for 30 days</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isAuthLoading}
                            className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl hover:bg-slate-800 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-lg shadow-slate-200"
                        >
                            {isAuthLoading ? <Loader2 className="animate-spin" size={20} /> : <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-slate-500 text-sm font-medium"
                        >
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <span className="text-indigo-600 font-bold hover:underline">
                                {isLogin ? 'Create Account' : 'Sign In'}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Developer Note (Temporary) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-8 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start space-x-3"
                >
                    <div className="p-1 rounded-full bg-amber-200 text-amber-700">
                        <Lock size={14} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-amber-800 uppercase tracking-widest">Testing Bypass</p>
                        <p className="text-xs text-amber-700 mt-1">Use <b>guest@example.com</b> / <b>guest123</b> to skip auth.</p>
                    </div>
                </motion.div>

                <p className="mt-8 text-center text-slate-400 text-xs font-medium tracking-wide">
                    &copy; 2026 AcaAssess Platform. Built for Excellence.
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
