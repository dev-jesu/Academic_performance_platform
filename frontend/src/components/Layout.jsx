import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Users, BookOpen, UserCheck, Settings, LogOut } from 'lucide-react';
import useStore from '../store/useStore';

const Layout = ({ children }) => {
    const { logout, user } = useStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { title: 'Dashboard', path: '/', icon: Home },
        { title: 'Students', path: '/students', icon: Users },
        { title: 'Courses', path: '/courses', icon: BookOpen },
        { title: 'Mentorship', path: '/mentorship', icon: UserCheck },
        { title: 'Settings', path: '/settings', icon: Settings },
    ];

    return (
        <div className="flex min-h-screen bg-[#121212] text-[#e0e0e0]">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e1e1e]/80 backdrop-blur-md border-r border-[#333] fixed h-full shadow-xl">
                <div className="p-8">
                    <h1 className="text-2xl font-bold text-[#00bfa5]">AcaAssess</h1>
                </div>
                <nav className="mt-8">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            to={item.path}
                            className={`flex items-center px-8 py-4 space-x-4 transition-all duration-300 ${location.pathname === item.path
                                    ? 'bg-[#00bfa5]/10 border-r-4 border-[#00bfa5] text-[#00bfa5]'
                                    : 'hover:bg-[#333] text-[#a0a0a0]'
                                }`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.title}</span>
                        </Link>
                    ))}
                </nav>
                <div className="absolute bottom-0 w-full p-4">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-8 py-4 space-x-4 text-[#a0a0a0] hover:text-red-400 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                {/* Topbar */}
                <header className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-semibold">
                        {menuItems.find(item => item.path === location.pathname)?.title || 'Overview'}
                    </h2>
                    <div className="flex items-center space-x-4">
                        <span className="text-[#a0a0a0] font-medium">{user?.email || 'Admin'}</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#00bfa5] to-[#ffb300]"></div>
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default Layout;
