import React from 'react';

const Skeleton = ({ className = '', variant = 'rect', width, height }) => {
    const baseStyles = 'bg-slate-200 animate-pulse rounded-md';
    const variantStyles = {
        rect: '',
        circle: 'rounded-full',
        text: 'h-4 w-full mb-2 last:mb-0',
    };

    const style = {
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '1rem' : undefined),
    };

    return (
        <div
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            style={style}
        />
    );
};

export default Skeleton;
