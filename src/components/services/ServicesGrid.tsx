import React from 'react';
import { servicesData } from '../../data/services';
import { ServiceItem } from '../../types';

interface ServicesGridProps {
  onSelectService?: (service: ServiceItem) => void;
}

export const ServicesGrid: React.FC<ServicesGridProps> = ({ onSelectService }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {servicesData.map((service) => (
        <div
          key={service.id}
          onClick={() => onSelectService?.(service)}
          className="bg-surface-primary border border-outline-variant p-8 md:p-10 transition-all duration-200 hover:bg-surface-secondary hover:border-primary group relative overflow-hidden cursor-pointer"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-surface-secondary rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
          
          <div className="text-primary-container mb-6">
            <span
              className="material-symbols-outlined text-4xl group-hover:scale-110 transition-transform"
              data-icon={service.icon}
              data-weight="fill"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              {service.icon}
            </span>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline-md text-[24px] text-ink-dark group-hover:text-primary transition-colors">
              {service.title}
            </h3>
            <span className="font-label-bold text-xs text-outline">{service.number}</span>
          </div>
          
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed mb-6">
            {service.description}
          </p>

          <div className="inline-flex items-center text-sm font-label-bold text-primary group-hover:text-accent-orange transition-colors">
            <span>Explore capabilities</span>
            <span className="material-symbols-outlined text-sm ml-1 transform group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
