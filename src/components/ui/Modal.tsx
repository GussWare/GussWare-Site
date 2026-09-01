import React, { useEffect } from 'react';
import { cn } from '../../lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-dark/70 backdrop-blur-xs transition-opacity duration-200"
      onClick={onClose}
    >
      <div
        className={cn(
          'bg-surface-primary border border-outline-variant w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl p-6 md:p-8 relative',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-outline-variant">
          {title && <h3 className="font-headline-md text-headline-md text-ink-dark">{title}</h3>}
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};
