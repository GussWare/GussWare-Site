import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  asLink?: boolean;
  href?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  asLink = false,
  href,
  icon,
  iconPosition = 'right',
  className,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-label-bold transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none rounded-none uppercase tracking-wider select-none';

  const sizeClasses = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3.5 text-label-bold',
    lg: 'px-8 py-4 text-label-bold',
  }[size];

  const variantClasses = {
    primary:
      'bg-accent-orange text-white hover:bg-opacity-90 active:scale-[0.98] shadow-sm hover:shadow-[0_4px_12px_rgba(255,80,0,0.3)]',
    secondary:
      'bg-transparent border-2 border-ink-dark text-ink-dark hover:bg-ink-dark hover:text-white active:scale-[0.98]',
    outline:
      'border-2 border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary hover:bg-surface-container-low active:scale-[0.98]',
    ghost:
      'bg-transparent text-primary hover:text-accent-orange hover:underline px-0 py-0 normal-case tracking-normal',
  }[variant];

  const content = (
    <>
      {icon && iconPosition === 'left' && (
        <span className="material-symbols-outlined mr-2 text-lg">{icon}</span>
      )}
      <span>{children}</span>
      {icon && iconPosition === 'right' && (
        <span className="material-symbols-outlined ml-2 text-lg transform group-hover:translate-x-1 transition-transform">
          {icon}
        </span>
      )}
    </>
  );

  if (asLink && href) {
    return (
      <a href={href} className={cn(baseClasses, sizeClasses, variantClasses, 'group', className)}>
        {content}
      </a>
    );
  }

  return (
    <button className={cn(baseClasses, sizeClasses, variantClasses, 'group', className)} {...props}>
      {content}
    </button>
  );
};
