import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, UserCheck, Settings, LogOut, Menu, X, Bell, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import Button from './ui/Button';

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logout, user } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { title: 'Overview', path: '/', icon: Home, roles: ['admin', 'mentor', 'student'] },
        { title: 'Students', path: '/students', icon: Users, roles: ['admin', 'mentor'] },
        { title: 'Courses', path: '/courses', icon: BookOpen, roles: ['admin', 'mentor', 'student'] },
        { title: 'Mentorship', path: '/mentorship', icon: UserCheck, roles: ['admin', 'mentor'] },
        { title: 'Settings', path: '/settings', icon: Settings, roles: ['admin'] },
    ];

    const filteredMenuItems = menuItems.filter(item => item.roles.includes(user?.role || 'student'));

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white">
            <div className="p-8 pb-12">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
                        <UserCheck size={24} />
                    </div>
                    <span className="text-xl font-bold text-slate-900 tracking-tight">AcaAssess</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 space-y-1">
                <p className="px-6 mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Main Menu</p>
                {filteredMenuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.title}
                            to={item.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={`flex items-center px-6 py-4 rounded-2xl space-x-3 transition-all duration-200 group relative ${isActive
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                }`}
                        >
                            <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'} />
                            <span className="font-semibold text-sm">{item.title}</span>
                            {isActive && (
                                <motion.div layoutId="nav-pill" className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full mt-6 px-6 py-4 space-x-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-semibold text-sm">Sign Out</span>
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans overflow-x-hidden">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-72 bg-white border-r border-slate-200 fixed h-full z-20">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-xl border-b border-slate-200 z-30 p-4 flex justify-between items-center px-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg"></div>
                    <span className="text-lg font-bold">AcaAssess</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-500">
                    <Menu size={24} />
                </button>
            </header>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 w-72 h-full bg-white z-50 md:hidden shadow-2xl"
                        >
                            <div className="absolute top-6 right-6">
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                                    <X size={20} />
                                </button>
                            </div>
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-72 min-h-screen flex flex-col pt-20 md:pt-0 relative">
                {/* Horizontal Topbar for Desktop */}
                <header className="hidden md:flex h-20 items-center justify-between px-12 bg-white/50 backdrop-blur-md border-b border-slate-200 sticky top-0 z-10 w-full">
                    <div className="relative w-96 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Universal Search..."
                            className="w-full bg-slate-50 border-none py-2.5 pl-12 pr-4 rounded-full text-sm focus:ring-2 focus:ring-indigo-100 transition-all outline-none"
                        />
                    </div>
                    <div className="flex items-center space-x-6">
                        <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
                        </button>
                        <div className="h-10 w-px bg-slate-200"></div>
                        <div className="flex items-center space-x-3">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900 leading-tight">{user?.email ? user.email.split('@')[0] : 'Guest User'}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-0.5">{user?.role || 'Limited'} Access</p>
                            </div>
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold shadow-sm">
                                {user?.email ? user.email[0].toUpperCase() : 'G'}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl w-full mx-auto p-6 md:p-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                    >
                        {children}
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
