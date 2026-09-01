import React from 'react';
import { ASSETS } from '../../data/assets';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    onNavigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface-secondary text-ink-dark pt-20 pb-10 border-t border-outline-variant/30 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2 pr-0 lg:pr-8">
            <a href="/" onClick={(e) => handleNav(e, '/')} className="inline-block mb-6">
              <img
                alt="GussWare Logo"
                className="h-14 w-auto object-contain"
                src={ASSETS.logo}
              />
            </a>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
              Technology built by people. A collaborative freelance community delivering high-impact
              digital solutions with industrial precision and human-centric warmth.
            </p>
            <div className="flex space-x-3">
              <a
                aria-label="Global Community Hub"
                className="w-10 h-10 border border-ink-dark flex items-center justify-center hover:bg-ink-dark hover:text-white transition-colors rounded-none"
                href="#hub"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/community');
                }}
              >
                <span className="material-symbols-outlined text-lg" data-icon="language">
                  language
                </span>
              </a>
              <a
                aria-label="Client Projects Portal"
                className="w-10 h-10 border border-ink-dark flex items-center justify-center hover:bg-ink-dark hover:text-white transition-colors rounded-none"
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate('/projects');
                }}
              >
                <span className="material-symbols-outlined text-lg" data-icon="work">
                  work
                </span>
              </a>
            </div>
          </div>

          {/* Explore Column */}
          <div>
            <h4 className="font-label-bold text-label-bold text-primary mb-6 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/"
                  onClick={(e) => handleNav(e, '/')}
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/how-we-work"
                  onClick={(e) => handleNav(e, '/how-we-work')}
                >
                  How We Work
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/projects"
                  onClick={(e) => handleNav(e, '/projects')}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/community"
                  onClick={(e) => handleNav(e, '/community')}
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/blog"
                  onClick={(e) => handleNav(e, '/blog')}
                >
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-label-bold text-label-bold text-primary mb-6 uppercase tracking-wider">
              Services
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                >
                  Web Development
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                >
                  Mobile Development
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                >
                  Custom Software
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                >
                  APIs &amp; Integrations
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                >
                  DevOps
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/services"
                  onClick={(e) => handleNav(e, '/services')}
                >
                  Consulting
                </a>
              </li>
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="font-label-bold text-label-bold text-primary mb-6 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/projects"
                  onClick={(e) => handleNav(e, '/projects')}
                >
                  Projects
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/blog"
                  onClick={(e) => handleNav(e, '/blog')}
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/community"
                  onClick={(e) => handleNav(e, '/community')}
                >
                  Community
                </a>
              </li>
              <li>
                <a
                  className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  href="/how-we-work"
                  onClick={(e) => handleNav(e, '/how-we-work')}
                >
                  Process Flow
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-label-bold text-label-bold text-primary mb-6 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3.5">
              <li>
                <a
                  className="font-body-md text-body-md text-ink-dark font-bold hover:text-accent-orange transition-colors flex items-center group cursor-pointer"
                  href="/contact"
                  onClick={(e) => handleNav(e, '/contact')}
                >
                  Start a Conversation
                  <span
                    className="material-symbols-outlined ml-1 text-sm transform group-hover:translate-x-1 transition-transform"
                    data-icon="arrow_outward"
                  >
                    arrow_outward
                  </span>
                </a>
              </li>
              <li className="pt-2 text-sm text-on-surface-variant">
                <span>hello@gussware.com</span>
              </li>
              <li className="text-sm text-on-surface-variant">
                <span>Global Remote Guild</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Bottom Bar */}
        <div className="pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-body-md text-body-md text-on-surface-variant text-sm">
            © 2024 GussWare. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a
              className="font-body-md text-body-md text-on-surface-variant text-sm hover:text-primary transition-colors cursor-pointer"
              href="/privacy"
              onClick={(e) => handleNav(e, '/privacy')}
            >
              Privacy Policy
            </a>
            <a
              className="font-body-md text-body-md text-on-surface-variant text-sm hover:text-primary transition-colors cursor-pointer"
              href="/terms"
              onClick={(e) => handleNav(e, '/terms')}
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
