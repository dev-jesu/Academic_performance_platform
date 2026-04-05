import React from "react";

const EmptyState = ({ message = "No data records found in this sector", actionLabel, onAction }) => {
  return (
    <div className="p-20 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-6 group border border-slate-200">
        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300">📁</span>
      </div>
      <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{message}</h3>
      <p className="text-[10px] text-slate-400 font-bold max-w-[200px] uppercase leading-relaxed">
        The system has scanned the registries and found 0 matching entries for the current query.
      </p>
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-8 btn-glass text-[10px] uppercase tracking-widest px-8"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
