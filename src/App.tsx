import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { ServicesPage } from './pages/ServicesPage';
import { HowWeWorkPage } from './pages/HowWeWorkPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CommunityPage } from './pages/CommunityPage';
import { BlogPage } from './pages/BlogPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { PageLayout } from './layouts/PageLayout';
import { BlogLayout } from './layouts/BlogLayout';
import { initialBlogPosts } from './data/blog';
import { BlogPost, ProjectItem, ServiceItem } from './types';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => {
    // If initial URL is /blog/:slug, locate the post
    if (typeof window !== 'undefined') {
      const match = window.location.pathname.match(/^\/blog\/(.+)$/);
      if (match) {
        const slug = match[1];
        return initialBlogPosts.find((p) => p.slug === slug || p.id === slug) || initialBlogPosts[0];
      }
    }
    return null;
  });

  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Sync with browser back/forward history
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);

      const blogMatch = path.match(/^\/blog\/(.+)$/);
      if (blogMatch) {
        const slug = blogMatch[1];
        const post = initialBlogPosts.find((p) => p.slug === slug || p.id === slug);
        if (post) {
          setSelectedPost(post);
        }
      } else {
        setSelectedPost(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    const blogMatch = path.match(/^\/blog\/(.+)$/);
    if (blogMatch) {
      const slug = blogMatch[1];
      const post = initialBlogPosts.find((p) => p.slug === slug || p.id === slug);
      if (post) setSelectedPost(post);
    } else {
      setSelectedPost(null);
    }
  };

  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    navigate(`/blog/${post.slug}`);
  };

  // Render individual views
  const renderContent = () => {
    // 1. Single Blog Post Detail Route: /blog/:slug
    if (selectedPost || currentPath.startsWith('/blog/')) {
      const post = selectedPost || initialBlogPosts[0];
      return (
        <BlogLayout
          post={post}
          currentPath={currentPath}
          onNavigate={navigate}
          onSelectPost={handleSelectPost}
        />
      );
    }

    // 2. Main Page Routes
    switch (currentPath) {
      case '/services':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'SERVICES' }]}
          >
            <ServicesPage
              onNavigate={navigate}
              selectedService={selectedService}
              onSelectService={setSelectedService}
            />
          </PageLayout>
        );

      case '/how-we-work':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'HOW WE WORK' }]}
          >
            <HowWeWorkPage onNavigate={navigate} />
          </PageLayout>
        );

      case '/projects':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'PROJECTS' }]}
          >
            <ProjectsPage onNavigate={navigate} onSelectProject={setSelectedProject} />
          </PageLayout>
        );

      case '/community':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'COMMUNITY' }]}
          >
            <CommunityPage onNavigate={navigate} />
          </PageLayout>
        );

      case '/blog':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'BLOG' }]}
          >
            <BlogPage onNavigate={navigate} onSelectPost={handleSelectPost} />
          </PageLayout>
        );

      case '/contact':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'CONTACT' }]}
            showBottomCTA={false}
          >
            <ContactPage onNavigate={navigate} />
          </PageLayout>
        );

      case '/privacy':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'PRIVACY POLICY' }]}
            showBottomCTA={false}
          >
            <LegalPage type="privacy" onNavigate={navigate} />
          </PageLayout>
        );

      case '/terms':
        return (
          <PageLayout
            currentPath={currentPath}
            onNavigate={navigate}
            breadcrumbs={[{ label: 'HOME', href: '/' }, { label: 'TERMS OF SERVICE' }]}
            showBottomCTA={false}
          >
            <LegalPage type="terms" onNavigate={navigate} />
          </PageLayout>
        );

      case '/':
      default:
        return (
          <PageLayout currentPath={currentPath} onNavigate={navigate} showBottomCTA={false}>
            <HomePage
              onNavigate={navigate}
              onSelectProject={(proj) => {
                setSelectedProject(proj);
                navigate('/projects');
              }}
              onSelectService={(serv) => {
                setSelectedService(serv);
                navigate('/services');
              }}
            />
          </PageLayout>
        );
    }
  };

  return <>{renderContent()}</>;
}
