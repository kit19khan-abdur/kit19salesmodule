import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const GlassCard = ({ children, className = '', style = {}, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.28 }}
      className={clsx('rounded-xl border border-white/10 bg-white/8 backdrop-blur-md shadow-lg', className)}
      style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))', ...style }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
