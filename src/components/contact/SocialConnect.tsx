import React from 'react';

export const SocialConnect: React.FC = () => {
  return (
    <div className="pt-8 border-t border-outline-variant/30 mt-8">
      <p className="font-body-md text-body-md text-on-surface mb-6">
        Connect with us on social media to see our latest projects and community insights.
      </p>
      <div className="flex gap-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          className="w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <i className="fa-brands fa-facebook-f text-sm" />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Twitter (X)"
          className="w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <i className="fa-brands fa-x-twitter text-sm" />
        </a>
        <a
          href="https://tiktok.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
          className="w-10 h-10 bg-primary-container text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <i className="fa-brands fa-tiktok text-sm" />
        </a>
      </div>
    </div>
  );
};
