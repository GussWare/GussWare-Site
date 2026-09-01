import React from 'react';
import { cn } from '../../lib/utils';

export type BlogCategory = 'All' | 'Development' | 'Technology' | 'Business' | 'Guides' | 'Design' | 'Culture';

interface CategoryFilterProps {
  categories: BlogCategory[];
  activeCategory: BlogCategory;
  onSelectCategory: (cat: BlogCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <section className="px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto mb-12">
      <div className="flex flex-wrap gap-4 justify-between items-center">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 md:gap-3 items-center">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={cn(
                  'px-5 py-2 rounded-full font-label-bold text-label-bold text-sm transition-all duration-200 cursor-pointer select-none',
                  isActive
                    ? 'bg-primary text-white shadow-xs'
                    : 'bg-surface-secondary text-on-surface-variant border border-outline-variant hover:bg-highlight-pink hover:border-highlight-pink hover:text-ink-dark'
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72 mt-2 md:mt-0">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base pointer-events-none"
            data-icon="search"
          >
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search articles..."
            className="w-full bg-surface-primary border border-outline-variant pl-9 pr-4 py-2 font-body-md text-sm text-on-surface focus:outline-none focus:border-secondary transition-colors rounded-none placeholder:text-outline"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-outline hover:text-ink-dark text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
