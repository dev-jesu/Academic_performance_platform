import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Navbar = ({ title, onMenuClick }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <header className="glass-navbar sticky top-0 z-40 px-4 md:px-6 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden w-8 h-8 flex flex-col justify-center gap-1.5 p-1.5 text-slate-500 hover:text-blue-600 transition-colors"
        >
          <span className="w-full h-0.5 bg-current rounded-full" />
          <span className="w-3/4 h-0.5 bg-current rounded-full" />
          <span className="w-full h-0.5 bg-current rounded-full" />
        </button>
        <div className="w-1 h-6 bg-blue-600 rounded-full hidden md:block" />
        <h2 className="text-lg font-black text-slate-900 tracking-tight">{title || "Dashboard"}</h2>
      </div>
      
      <div className="flex items-center gap-8">

        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-900 leading-none capitalize">{user?.name || user?.role}</p>
            <p className="text-[9px] text-blue-600 font-black uppercase tracking-widest mt-1 opacity-80">{user?.role} Portal</p>
          </div>
          <div className="w-9 h-9 rounded-xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-base">
            {(user?.name || user?.role)?.[0].toUpperCase() || 'U'}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
        >
          <span className="text-[10px] font-black uppercase tracking-widest">Logout</span>
          <span className="text-xs group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;