import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const menuItems = {
    admin: [
      { name: "Dashboard", path: "/admin-dashboard" },
      { name: "Students", path: "/students" },
      { name: "Mentors", path: "/mentors" },
      { name: "Manage Enrollments", path: "/admin/manage-enrollments" },
      { name: "Manage Mentorship", path: "/admin/mentorship-mapping" },
      { name: "Profile", path: "/profile" },
    ],
    mentor: [
      { name: "Dashboard", path: "/mentor-dashboard" },
      { name: "Manage Grades", path: "/mentor/manage-grades" },
      { name: "Profile", path: "/profile" },
    ],
    student: [
      { name: "Dashboard", path: "/student-dashboard" },
      { name: "Profile", path: "/profile" },
    ],
  };

  const items = menuItems[role] || [];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`w-64 glass-sidebar min-h-screen fixed md:sticky top-0 h-screen flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:flex`}>
        <div className="p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="text-white font-black text-2xl tracking-tighter italic">SP</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tighter leading-none">
              PLATFORM
            </h1>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[0.2em] mt-1">Academic Sync</p>
          </div>
        </div>
        
        <nav className="space-y-3">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative
                ${location.pathname === item.path 
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
            >
              {location.pathname === item.path && (
                <div className="absolute left-0 w-1 h-6 bg-blue-600 rounded-full shadow-lg shadow-blue-500/50" />
              )}
              <span className="font-bold tracking-wide uppercase text-[11px]">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Authenticated As</p>
          <p className="text-sm font-bold text-slate-900 capitalize truncate">{user?.name || role}</p>
        </div>
      </div>
    </aside>
    </>
  );
};

export default Sidebar;