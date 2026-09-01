import React from 'react';
import { BlogPost } from '../../types';

interface ArticleCardProps {
  post: BlogPost;
  onSelectPost: (post: BlogPost) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ post, onSelectPost }) => {
  return (
    <article
      onClick={() => onSelectPost(post)}
      className="bg-surface-primary border border-outline-variant flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group h-full"
    >
      <div className="h-48 md:h-56 w-full relative overflow-hidden bg-surface-container">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-surface-secondary text-ink-dark font-label-bold text-[11px] uppercase tracking-wider px-2 py-0.5 shadow-xs">
            {post.category}
          </span>
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2.5 text-xs text-on-surface-variant">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
          <h3 className="font-headline-md text-xl font-semibold text-ink-dark mb-3 group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="font-body-md text-sm text-on-surface-variant mb-6 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 font-label-bold text-sm text-primary group-hover:text-accent-orange transition-colors pt-2 border-t border-outline-variant/30">
          <span>Read more</span>
          <span
            className="material-symbols-outlined text-sm transform group-hover:translate-x-1 transition-transform"
            data-icon="arrow_forward"
          >
            arrow_forward
          </span>
        </div>
      </div>
    </article>
  );
};
