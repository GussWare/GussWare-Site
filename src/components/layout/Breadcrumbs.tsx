import React from 'react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex text-label-bold font-label-bold text-on-surface-variant mb-8 uppercase">
      <ol className="inline-flex items-center space-x-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <span className="material-symbols-outlined text-sm mx-1 text-outline">
                  chevron_right
                </span>
              )}
              {isLast || !item.href ? (
                <span className="text-primary">{item.label}</span>
              ) : (
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (item.href) onNavigate(item.href);
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
