import React from 'react';
import { cn } from '../../lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  size = 'default',
  ...props
}) => {
  const sizeClasses = {
    narrow: 'max-w-[800px]',
    default: 'max-w-[1280px]',
    wide: 'max-w-[1440px]',
  }[size];

  return (
    <div className={cn('w-full mx-auto px-4 sm:px-6 md:px-8', sizeClasses, className)} {...props}>
      {children}
    </div>
  );
};
