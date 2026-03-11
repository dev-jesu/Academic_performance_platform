import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div
            whileHover={hover ? { y: -4, transition: { duration: 0.2 } } : {}}
            className={`bg-white border border-slate-100 rounded-[2rem] p-8 shadow-soft ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
