import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import useStore from '../../store/useStore';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error, clearError } = useStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const loadToast = toast.loading('Authenticating...');
        try {
            const success = await login(email, password);
            if (success) {
                toast.success('Login successful!', { id: loadToast });
                navigate('/');
            } else {
                toast.error('Login failed. Please check your credentials.', { id: loadToast });
            }
        } catch (err) {
            toast.error('Connection error. Please try again.', { id: loadToast });
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#1e1e1e]/60 backdrop-blur-xl border border-[#333] p-10 rounded-3xl shadow-2xl relative overflow-hidden group"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00bfa5] to-[#ffb300]"></div>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-[#a0a0a0]">Sign in to access your dashboard</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] group-focus-within:text-[#00bfa5] transition-colors" size={20} />
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => { setEmail(e.target.value); clearError(); }}
                            required
                            className="w-full bg-[#121212] border border-[#333] py-4 pl-12 pr-4 rounded-xl focus:border-[#00bfa5] focus:outline-none focus:ring-1 focus:ring-[#00bfa5] transition-all text-white placeholder:text-[#555]"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a0a0a0] group-focus-within:text-[#00bfa5] transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); clearError(); }}
                            required
                            className="w-full bg-[#121212] border border-[#333] py-4 pl-12 pr-4 rounded-xl focus:border-[#00bfa5] focus:outline-none focus:ring-1 focus:ring-[#00bfa5] transition-all text-white placeholder:text-[#555]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#00bfa5] to-[#00897b] text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(0,191,165,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <span>Sign In</span>}
                    </button>
                </form>

                <p className="mt-8 text-center text-[#a0a0a0] text-sm">
                    AcaAssess Platform v1.0
                </p>
            </motion.div>
        </div>
    );
};

export default Login;
