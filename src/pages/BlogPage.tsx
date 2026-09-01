import React, { useState } from 'react';
import { initialBlogPosts } from '../data/blog';
import { BlogHero } from '../components/blog/BlogHero';
import { CategoryFilter, BlogCategory } from '../components/blog/CategoryFilter';
import { ArticleGrid } from '../components/blog/ArticleGrid';
import { BlogPost } from '../types';

interface BlogPageProps {
  onNavigate: (path: string) => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate, onSelectPost }) => {
  const [activeCategory, setActiveCategory] = useState<BlogCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  const heroPost =
    initialBlogPosts.find((p) => p.isHero) ||
    initialBlogPosts[0];

  const categories: BlogCategory[] = [
    'All',
    'Development',
    'Technology',
    'Business',
    'Guides',
    'Design',
    'Culture',
  ];

  // Exclude the hero post from the secondary grid only if we are in 'All' view and not searching
  const filteredPosts = initialBlogPosts.filter((post) => {
    const matchesCat = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.tags && post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    return matchesCat && matchesSearch;
  });

  // If in 'All' and not searching, show remaining items in grid
  const gridPosts =
    activeCategory === 'All' && !searchQuery
      ? filteredPosts.filter((p) => p.id !== heroPost.id).slice(0, visibleCount)
      : filteredPosts.slice(0, visibleCount);

  return (
    <div className="py-12 md:py-20">
      {/* Blog Hero Featured Article */}
      {!searchQuery && activeCategory === 'All' && (
        <BlogHero post={heroPost} onSelectPost={onSelectPost} />
      )}

      {/* Categories & Search Filter Bar */}
      <CategoryFilter
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setVisibleCount(6);
        }}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setVisibleCount(6);
        }}
      />

      {/* Articles Grid */}
      <ArticleGrid
        posts={gridPosts}
        onSelectPost={onSelectPost}
        hasMore={gridPosts.length < filteredPosts.length}
        onLoadMore={() => setVisibleCount((prev) => prev + 6)}
      />
    </div>
  );
};
