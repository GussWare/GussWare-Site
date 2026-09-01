import React from 'react';
import { communityValuePoints } from '../../data/community';

export const ValuePoints: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
      {communityValuePoints.map((point, index) => {
        const isAlternate = index % 2 === 0;
        return (
          <div
            key={point.id}
            className={`p-8 flex flex-col justify-between items-start transition-all duration-300 group border cursor-default ${
              isAlternate
                ? 'bg-surface-secondary border-transparent hover:bg-highlight-pink hover:border-neutral'
                : 'bg-surface-primary border-outline-variant hover:border-primary'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center mb-16 shadow-xs ${
                isAlternate ? 'bg-surface-primary' : 'bg-surface-secondary'
              }`}
            >
              <span className="material-symbols-outlined text-primary text-2xl" data-icon={point.icon}>
                {point.icon}
              </span>
            </div>
            <div>
              <h3 className="font-headline-md text-2xl text-ink-dark mb-3">
                {point.title}
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant group-hover:text-ink-dark transition-colors leading-relaxed">
                {point.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
