import React from 'react';
import clsx from 'clsx';
import { getInitials, generateAvatarColor } from '../utils/helpers';

/**
 * Avatar Component
 * Displays a circular avatar with gradient background and initials
 */
const Avatar = ({ name, size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  };
  
  return (
    <div 
      className={clsx(
        'rounded-full flex items-center justify-center font-bold text-white bg-gradient-to-br shrink-0',
        generateAvatarColor(name),
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
