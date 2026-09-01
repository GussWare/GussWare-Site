import React from 'react';
import { BlogPost } from '../../types';

interface RelatedReadingProps {
  currentPostId?: string;
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onViewAll?: () => void;
}

export const RelatedReading: React.FC<RelatedReadingProps> = ({
  currentPostId,
  posts,
  onSelectPost,
  onViewAll,
}) => {
  const related = posts.filter((p) => p.id !== currentPostId).slice(0, 3);

  return (
    <section className="bg-surface-secondary py-16 md:py-24 border-t border-outline-variant/40">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-end mb-12 border-b border-outline-variant pb-4">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Related Reading</h2>
          {onViewAll && (
            <button
              onClick={onViewAll}
              className="font-label-bold text-label-bold text-primary hover:underline hidden md:flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {related.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPost(item)}
              className="bg-surface-primary border border-outline-variant group hover:shadow-lg transition-shadow duration-300 flex flex-col h-full cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden relative bg-surface-container">
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="badge">{item.category}</span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-headline-md text-xl mb-3 text-on-surface group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <p className="font-body-md text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
                  {item.excerpt}
                </p>
                <div className="mt-auto flex items-center justify-between text-xs text-on-surface-variant pt-3 border-t border-outline-variant/30">
                  <span>{item.date}</span>
                  <span>{item.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {onViewAll && (
          <div className="mt-8 text-center md:hidden">
            <button
              onClick={onViewAll}
              className="btn-secondary w-full uppercase tracking-wider text-sm py-3"
            >
              View All Articles
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
