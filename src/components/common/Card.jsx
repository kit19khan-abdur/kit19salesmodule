import React from 'react';
import clsx from 'clsx';

const Card = React.forwardRef(({ children, className = '', title, subtitle, actions, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx('bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden', className)} {...props}>
      {(title || subtitle || actions) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
              {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}
      <div className="px-6 py-4">{children}</div>
    </div>
  );
});

export default Card;
