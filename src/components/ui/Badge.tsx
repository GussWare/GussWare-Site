import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'primary' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className }) => {
  const variantClasses = {
    default: 'bg-surface-secondary text-ink-dark',
    accent: 'bg-highlight-pink text-tertiary-container',
    primary: 'bg-primary-fixed text-primary',
    outline: 'border border-outline-variant text-on-surface-variant bg-surface-primary',
  }[variant];

  return (
    <span
      className={cn(
        'font-label-bold text-[12px] uppercase tracking-wider px-3 py-1 inline-block select-none rounded-none',
        variantClasses,
        className
      )}
    >
      {children}
    </span>
  );
};
