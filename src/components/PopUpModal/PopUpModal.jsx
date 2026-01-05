import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './PopUpModal.css';

/**
 * Reusable PopUpModal Component
 * 
 * @param {boolean} isOpen - Controls modal visibility
 * @param {function} onClose - Callback when modal closes
 * @param {string} title - Modal title
 * @param {React.ReactNode} children - Form or content to render inside modal
 * @param {string} size - Modal size: 'sm', 'md', 'lg', 'xl' (default: 'md')
 * @param {boolean} showCloseButton - Show/hide close button (default: true)
 * @param {boolean} closeOnOverlay - Close modal on overlay click (default: true)
 * @param {boolean} closeOnEsc - Close modal on ESC key (default: true)
 */
const PopUpModal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEsc = true,
  footer,
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen || !closeOnEsc) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, closeOnEsc]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const handleOverlayClick = (e) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose?.();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick}
    >
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-lg shadow-2xl animate-slideIn`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            )}
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-1 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        {/* Modal Body */}
        <div className="px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default PopUpModal;
