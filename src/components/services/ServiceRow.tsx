import React from 'react';
import { ServiceItem } from '../../types';

interface ServiceRowProps {
  service: ServiceItem;
  onClick?: () => void;
}

export const ServiceRow: React.FC<ServiceRowProps> = ({ service, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group block border-b border-outline-variant py-8 md:py-12 cursor-pointer transition-colors duration-300 hover:bg-surface-secondary px-4 md:px-0"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center">
        <div className="md:col-span-2">
          <span className="font-headline-md text-headline-md text-outline font-light group-hover:text-primary transition-colors">
            {service.number}
          </span>
        </div>
        <div className="md:col-span-4">
          <h3 className="font-headline-lg text-headline-lg text-ink-dark group-hover:text-primary transition-colors duration-300">
            {service.title}
          </h3>
        </div>
        <div className="md:col-span-5">
          <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
            {service.description}
          </p>
        </div>
        <div className="md:col-span-1 flex justify-end items-center mt-4 md:mt-0">
          <span className="material-symbols-outlined text-outline group-hover:text-accent-orange group-hover:translate-x-2 transition-all duration-300 text-3xl">
            arrow_forward
          </span>
        </div>
      </div>
    </div>
  );
};
