import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-10 px-8 border-t border-slate-100 bg-white/50 backdrop-blur-sm mt-auto">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-black text-xl italic">A</span>
          </div>
          <div>
            <p className="text-sm font-black text-slate-900 tracking-tighter uppercase group-hover:text-blue-600 transition-colors">Academic Portals</p>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Quality Education First</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-4">
          <div className="flex items-center gap-8">
             <a href="#" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.15em] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-blue-600 after:transition-all hover:after:w-full">Support</a>
             <a href="#" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.15em] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-blue-600 after:transition-all hover:after:w-full">Privacy</a>
             <a href="#" className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-[0.15em] relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[1px] after:bg-blue-600 after:transition-all hover:after:w-full">Terms</a>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.1em] leading-relaxed">
              &copy; {currentYear} Academic Performance Platform.
              <span className="block md:inline md:ml-1 text-slate-400 font-medium">Empowering students through data.</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
