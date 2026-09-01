import React, { useState, useEffect } from 'react';
import { ASSETS } from '../../data/assets';
import { NavItem } from '../../types';
import { cn } from '../../lib/utils';

interface TopNavBarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const navItems: NavItem[] = [
  { label: 'Services', href: '/services' },
  { label: 'How We Work', href: '/how-we-work' },
  { label: 'Projects', href: '/projects' },
  { label: 'Community', href: '/community' },
  { label: 'Blog', href: '/blog' },
];

export const TopNavBar: React.FC<TopNavBarProps> = ({ currentPath, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 15) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    onNavigate(href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-header"
      className={cn(
        'sticky top-0 w-full z-50 bg-surface-primary border-b border-outline-variant transition-all duration-200',
        isScrolled ? 'shadow-xs h-16' : 'h-20'
      )}
    >
      <div className="flex justify-between items-center w-full px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto h-full">
        {/* Brand Logo & Wordmark */}
        <a
          href="/"
          onClick={(e) => handleLinkClick(e, '/')}
          aria-label="GussWare Home"
          className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-none"
        >
          <div className="h-8 w-auto flex items-center">
            <img
              src={ASSETS.logo}
              alt="GussWare Brand Mark"
              className="h-8 w-auto object-contain"
            />
          </div>
          <span className="font-headline-md text-[26px] md:text-[28px] font-bold text-primary tracking-tight group-hover:opacity-85 transition-opacity">
            GussWare
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = currentPath === item.href || (item.href === '/blog' && currentPath.startsWith('/blog'));
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={cn(
                  'font-navigation text-[15px] transition-all duration-200 cursor-pointer active:scale-95 p-1 relative',
                  isActive
                    ? 'text-secondary font-bold border-b-2 border-secondary pb-0.5'
                    : 'text-on-surface-variant hover:text-primary'
                )}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Desktop CTA & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <a
            href="/contact"
            onClick={(e) => handleLinkClick(e, '/contact')}
            className="hidden md:inline-flex items-center justify-center bg-accent-orange text-white font-label-bold text-label-bold px-6 py-3 rounded-none hover:bg-[#e04600] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-orange active:scale-95 uppercase tracking-wider"
          >
            Start a Conversation
          </a>

          <button
            id="mobile-menu-btn"
            aria-controls="mobile-menu"
            aria-expanded={isMobileMenuOpen}
            aria-label="Toggle Menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-none cursor-pointer"
          >
            <span className="material-symbols-outlined" data-icon="menu">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-surface-primary border-t border-outline-variant absolute w-full left-0 top-full shadow-lg transition-all animate-in fade-in slide-in-from-top-2"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col p-4 gap-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleLinkClick(e, item.href)}
                className={cn(
                  'font-navigation text-navigation p-3.5 hover:bg-surface-container-low rounded-none transition-colors',
                  currentPath === item.href ? 'text-primary font-bold bg-surface-container-low' : 'text-on-surface-variant'
                )}
              >
                {item.label}
              </a>
            ))}
            <a
              href="/contact"
              onClick={(e) => handleLinkClick(e, '/contact')}
              className="mt-3 flex items-center justify-center bg-accent-orange text-white font-label-bold text-label-bold px-6 py-3.5 rounded-none hover:bg-opacity-90 transition-colors w-full uppercase tracking-wider text-center"
            >
              Start a Conversation
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};
