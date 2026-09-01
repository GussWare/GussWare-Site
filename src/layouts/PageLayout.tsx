import React from 'react';
import { BaseLayout } from './BaseLayout';
import { BottomCTA } from '../components/layout/BottomCTA';
import { Breadcrumbs, BreadcrumbItem } from '../components/layout/Breadcrumbs';

export interface PageLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  title?: string;
  breadcrumbs?: BreadcrumbItem[];
  showBottomCTA?: boolean;
  children: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  currentPath,
  onNavigate,
  breadcrumbs,
  showBottomCTA = true,
  children,
}) => {
  return (
    <BaseLayout currentPath={currentPath} onNavigate={onNavigate}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-8">
          <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
        </div>
      )}
      {children}
      {showBottomCTA && <BottomCTA onNavigate={onNavigate} />}
    </BaseLayout>
  );
};
