import React from 'react';

export const CapabilitiesBadges: React.FC = () => {
  const trustSignals = [
    { icon: 'verified', label: 'Vetted Talent', desc: 'Top 3% specialized freelance network' },
    { icon: 'domain', label: 'Domain Expertise', desc: 'Enterprise architecture & vertical solutions' },
    { icon: 'security', label: 'Secure by Design', desc: 'Zero-trust security & compliance rigor' },
    { icon: 'trending_up', label: 'Scalable Solutions', desc: 'Elastic architectures ready for growth' },
  ];

  return (
    <div className="mt-24 pt-12 border-t border-outline-variant grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div>
        <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-wider block mb-2">
          CONFIDENCE & RIGOR
        </span>
        <h4 className="font-headline-lg text-headline-lg text-ink-dark mb-4 leading-tight">
          Production-Ready Reliability
        </h4>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Our freelance ecosystem delivers enterprise-grade architecture with startup agility. We have
          experience building robust systems across multiple domains, ensuring your product is scalable
          from day one.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {trustSignals.map((item, index) => (
          <div key={index} className="bg-surface-secondary p-6 flex flex-col items-start hover:bg-highlight-pink transition-colors group">
            <span
              className="material-symbols-outlined text-primary-container text-3xl mb-2"
              data-icon={item.icon}
              data-weight="fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {item.icon}
            </span>
            <span className="font-label-bold text-label-bold text-ink-dark mb-1">
              {item.label}
            </span>
            <span className="text-xs text-on-surface-variant leading-tight">
              {item.desc}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
