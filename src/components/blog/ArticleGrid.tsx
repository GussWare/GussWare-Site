import React from 'react';
import { BlogPost } from '../../types';
import { ArticleCard } from './ArticleCard';

interface ArticleGridProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
}

export const ArticleGrid: React.FC<ArticleGridProps> = ({
  posts,
  onSelectPost,
  onLoadMore,
  hasMore = false,
}) => {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 bg-surface-secondary border border-outline-variant max-w-[1280px] mx-auto px-4 my-8">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">article</span>
        <h3 className="font-headline-md text-xl text-ink-dark mb-2">No articles found</h3>
        <p className="text-on-surface-variant text-sm">
          Try searching with different keywords or selecting another category.
        </p>
      </div>
    );
  }

  return (
    <section className="px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto mb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <ArticleCard key={post.id} post={post} onSelectPost={onSelectPost} />
        ))}
      </div>

      {hasMore && onLoadMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onLoadMore}
            className="border-2 border-ink-dark text-ink-dark font-label-bold text-label-bold px-8 py-3.5 hover:bg-ink-dark hover:text-white transition-all cursor-pointer uppercase tracking-wider rounded-none"
          >
            Load More Articles
          </button>
        </div>
      )}
    </section>
  );
};
