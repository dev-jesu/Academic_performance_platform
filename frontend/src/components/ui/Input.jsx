import React from 'react';

const Input = ({ label, icon: Icon, error, className = '', ...props }) => {
    return (
        <div className="space-y-2 w-full">
            {label && <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>}
            <div className="relative group">
                {Icon && (
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                )}
                <input
                    className={`w-full bg-slate-50 border border-slate-200 py-4 ${Icon ? 'pl-12' : 'pl-5'} pr-5 rounded-2xl focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50 transition-all text-slate-900 placeholder:text-slate-400 outline-none ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-50' : ''} ${className}`}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 ml-1 font-medium">{error}</p>}
        </div>
    );
};

export default Input;
