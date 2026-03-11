import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    disabled = false,
    loading = false,
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-2xl font-bold transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

    const variants = {
        primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200",
        secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50",
        outline: "bg-transparent text-slate-600 border border-slate-200 hover:border-indigo-600 hover:text-indigo-600",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-900",
        danger: "bg-red-50 text-red-600 hover:bg-red-100",
        accent: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            ) : children}
        </button>
    );
};

export default Button;
