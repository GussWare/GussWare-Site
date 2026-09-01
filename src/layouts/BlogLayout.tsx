import React from 'react';
import { BaseLayout } from './BaseLayout';
import { BlogPost } from '../types';
import { Breadcrumbs } from '../components/layout/Breadcrumbs';
import { RelatedReading } from '../components/blog/RelatedReading';
import { BottomCTA } from '../components/layout/BottomCTA';
import { initialBlogPosts } from '../data/blog';

export interface BlogLayoutProps {
  post: BlogPost;
  currentPath: string;
  onNavigate: (path: string) => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogLayout: React.FC<BlogLayoutProps> = ({
  post,
  currentPath,
  onNavigate,
  onSelectPost,
}) => {
  const breadcrumbs = [
    { label: 'HOME', href: '/' },
    { label: 'BLOG', href: '/blog' },
    { label: post.title.toUpperCase() },
  ];

  return (
    <BaseLayout currentPath={currentPath} onNavigate={onNavigate}>
      {/* Breadcrumb Navigation */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-8">
        <Breadcrumbs items={breadcrumbs} onNavigate={onNavigate} />
      </div>

      {/* Article Header Container */}
      <header className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mb-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="badge">{post.category}</span>
            <span className="text-on-surface-variant font-body-md text-sm">{post.readTime}</span>
          </div>

          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Author Meta Row */}
          <div className="flex items-center justify-between border-y border-outline-variant py-6">
            <div className="flex items-center gap-4">
              <img
                src={post.author.avatarUrl}
                alt={post.author.name}
                className="w-12 h-12 rounded-full object-cover border border-outline-variant"
              />
              <div>
                <div className="font-label-bold text-ink-dark text-base">{post.author.name}</div>
                <div className="font-body-md text-sm text-on-surface-variant">
                  {post.author.role} • {post.date}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert('Article link copied to clipboard!');
                }}
                aria-label="Share article"
                className="w-10 h-10 border border-outline-variant flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg" data-icon="share">
                  share
                </span>
              </button>
              <button
                aria-label="Save for later"
                className="w-10 h-10 border border-outline-variant flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg" data-icon="bookmark">
                  bookmark
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Article Content Container */}
      <article className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mb-24">
        <div className="max-w-4xl">
          {/* Featured Image Frame */}
          <div className="mb-12 border border-outline-variant bg-surface-container overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full aspect-[21/9] object-cover"
            />
            {post.caption && (
              <div className="p-3 bg-surface-secondary text-xs text-on-surface-variant border-t border-outline-variant italic">
                {post.caption}
              </div>
            )}
          </div>

          {/* Article Editorial Typography Body */}
          <div
            className="prose-editorial"
            dangerouslySetInnerHTML={{ __html: post.contentHtml || `<p>${post.excerpt}</p>` }}
          />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-outline-variant flex flex-wrap gap-2 items-center">
              <span className="font-label-bold text-xs text-on-surface-variant uppercase mr-2">
                Tags:
              </span>
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="bg-surface-secondary text-ink-dark font-label-bold text-xs px-3 py-1 uppercase"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author Bio Card */}
          <div className="mt-12 p-8 bg-surface-secondary border border-outline-variant flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              src={post.author.avatarUrl}
              alt={post.author.name}
              className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
            />
            <div>
              <span className="text-xs font-label-bold text-accent-orange uppercase tracking-wider block mb-1">
                About the Author
              </span>
              <h4 className="font-headline-md text-xl text-ink-dark mb-1">{post.author.name}</h4>
              <p className="text-xs font-semibold text-primary mb-3">{post.author.role}</p>
              <p className="font-body-md text-sm text-on-surface-variant leading-relaxed">
                Specializing in distributed systems architecture, constructivist design paradigms,
                and human-centered software engineering with over a decade of enterprise experience.
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* Related Reading Section */}
      <RelatedReading
        currentPostId={post.id}
        posts={initialBlogPosts}
        onSelectPost={onSelectPost}
        onViewAll={() => onNavigate('/blog')}
      />

      {/* Bottom CTA */}
      <BottomCTA onNavigate={onNavigate} />
    </BaseLayout>
  );
};
