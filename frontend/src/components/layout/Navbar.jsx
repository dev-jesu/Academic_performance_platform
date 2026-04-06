import React from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Navbar = ({ title }) => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate("/");
  };

  return (
    <header className="glass-navbar sticky top-0 z-40 px-8 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
        <h2 className="text-xl font-black text-slate-900 tracking-tight">{title || "Dashboard"}</h2>
      </div>
      
      <div className="flex items-center gap-8">

        
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-black text-slate-900 leading-none capitalize">{user?.name || user?.role}</p>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest mt-1.5 opacity-80">{user?.role} Portal</p>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-lg">
            {(user?.name || user?.role)?.[0].toUpperCase() || 'U'}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-2 px-4 py-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
        >
          <span className="text-xs font-black uppercase tracking-widest">Logout</span>
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;