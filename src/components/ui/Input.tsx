import React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'underline' | 'boxed';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  variant = 'underline',
  id,
  className,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="font-label-bold text-label-bold text-ink-dark">
          {label}
        </label>
      )}
      {variant === 'underline' ? (
        <input
          id={inputId}
          className={cn(
            'form-input-line w-full font-body-md text-body-md text-on-surface placeholder:text-outline',
            error && 'border-b-red-600',
            className
          )}
          {...props}
        />
      ) : (
        <input
          id={inputId}
          className={cn(
            'w-full bg-surface-primary border border-outline-variant px-4 py-3 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors rounded-none placeholder:text-outline',
            error && 'border-red-600',
            className
          )}
          {...props}
        />
      )}
      {helperText && !error && <span className="text-xs text-on-surface-variant">{helperText}</span>}
      {error && <span className="text-xs text-red-600 font-semibold">{error}</span>}
    </div>
  );
};

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, error, id, className, ...props }) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="font-label-bold text-label-bold text-ink-dark">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        className={cn(
          'w-full bg-surface-primary border border-outline-variant p-4 font-body-md text-body-md text-on-surface focus:outline-none focus:border-secondary transition-colors rounded-none placeholder:text-outline min-h-[120px] resize-y',
          error && 'border-red-600',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-semibold">{error}</span>}
    </div>
  );
};
