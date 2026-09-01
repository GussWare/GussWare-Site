import React from 'react';
import { BlogPost } from '../../types';

interface BlogHeroProps {
  post: BlogPost;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogHero: React.FC<BlogHeroProps> = ({ post, onSelectPost }) => {
  return (
    <section className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mb-16 md:mb-24">
      <div
        onClick={() => onSelectPost(post)}
        className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-surface-primary border border-outline-variant overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
      >
        <div className="h-64 md:h-full min-h-[360px] md:min-h-[440px] w-full relative overflow-hidden bg-surface-container">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="p-8 md:p-12">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-surface-secondary text-ink-dark font-label-bold text-xs uppercase tracking-wider px-2.5 py-1 rounded-none">
              {post.category}
            </span>
            <span className="text-on-surface-variant font-body-md text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm" data-icon="schedule">
                schedule
              </span>
              {post.readTime}
            </span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-ink-dark mb-4 leading-tight group-hover:text-primary transition-colors">
            {post.title}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="inline-flex items-center gap-2 font-label-bold text-label-bold text-primary group-hover:text-accent-orange transition-colors">
            <span>Read Article</span>
            <span
              className="material-symbols-outlined transform group-hover:translate-x-1.5 transition-transform"
              data-icon="arrow_forward"
            >
              arrow_forward
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
