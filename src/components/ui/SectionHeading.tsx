import React from 'react';
import { cn } from '../../lib/utils';

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center' | 'split';
  splitDescription?: string;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  align = 'left',
  splitDescription,
  className,
}) => {
  if (align === 'split') {
    return (
      <div className={cn('grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-start', className)}>
        <div className="md:col-span-5">
          {eyebrow && (
            <span className="font-label-bold text-label-bold text-primary-container uppercase tracking-wider block mb-3">
              {eyebrow}
            </span>
          )}
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark leading-tight">
            {title}
          </h2>
        </div>
        <div className="md:col-span-6 md:col-start-7 pt-2 md:pt-4 md:pl-8 md:border-l border-outline-variant">
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
            {splitDescription || description}
          </p>
        </div>
      </div>
    );
  }

  if (align === 'center') {
    return (
      <div className={cn('max-w-3xl mx-auto text-center mb-16', className)}>
        {eyebrow && (
          <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-3">
            {eyebrow}
          </span>
        )}
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark leading-tight mb-6">
          {title}
        </h2>
        {description && (
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={cn('max-w-3xl mb-12', className)}>
      {eyebrow && (
        <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-3">
          {eyebrow}
        </span>
      )}
      <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark leading-tight mb-4">
        {title}
      </h2>
      {description && (
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};
