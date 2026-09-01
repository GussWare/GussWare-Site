import React from 'react';
import { TopNavBar } from '../components/navigation/TopNavBar';
import { Footer } from '../components/layout/Footer';

export interface BaseLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
  showFooter?: boolean;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-surface-primary text-on-surface antialiased selection:bg-accent-orange selection:text-white">
      <TopNavBar currentPath={currentPath} onNavigate={onNavigate} />
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer onNavigate={onNavigate} />}
    </div>
  );
};
