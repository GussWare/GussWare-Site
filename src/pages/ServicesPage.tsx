import React, { useState } from 'react';
import { servicesData } from '../data/services';
import { ServicesGrid } from '../components/services/ServicesGrid';
import { CapabilitiesBadges } from '../components/services/CapabilitiesBadges';
import { ServiceItem } from '../types';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

interface ServicesPageProps {
  onNavigate: (path: string) => void;
  selectedService?: ServiceItem | null;
  onSelectService?: (service: ServiceItem | null) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onNavigate,
  selectedService: initialService,
  onSelectService,
}) => {
  const [activeModalService, setActiveModalService] = useState<ServiceItem | null>(
    initialService || null
  );

  const handleSelect = (service: ServiceItem) => {
    setActiveModalService(service);
    onSelectService?.(service);
  };

  return (
    <div className="py-12 md:py-20 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-4">
          END-TO-END CAPABILITIES
        </span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark mb-6 leading-tight">
          Software Development &amp; Architecture
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          From full-stack web platforms and native mobile applications to bespoke ERP engines, API
          ecosystems, and resilient cloud infrastructure. We combine architectural rigor with agile
          execution.
        </p>
      </div>

      {/* Services Grid */}
      <ServicesGrid onSelectService={handleSelect} />

      {/* Trust Badges & Confidence Section */}
      <CapabilitiesBadges />

      {/* Service Detail Modal */}
      {activeModalService && (
        <Modal
          isOpen={Boolean(activeModalService)}
          onClose={() => setActiveModalService(null)}
          title={activeModalService.title}
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-4xl text-primary">
                {activeModalService.icon}
              </span>
              <div>
                <span className="text-xs font-label-bold text-outline">
                  CAPABILITY {activeModalService.number}
                </span>
                <h4 className="font-headline-md text-xl text-ink-dark">
                  {activeModalService.title}
                </h4>
              </div>
            </div>

            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              {activeModalService.description}
            </p>

            {activeModalService.capabilities && (
              <div>
                <h5 className="font-label-bold text-sm text-ink-dark uppercase tracking-wider mb-3">
                  Key Technical Deliverables
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeModalService.capabilities.map((cap, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-on-surface bg-surface-secondary p-2.5 border border-outline-variant"
                    >
                      <span className="material-symbols-outlined text-primary text-base">
                        check_circle
                      </span>
                      <span>{cap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeModalService.technologies && (
              <div>
                <h5 className="font-label-bold text-sm text-ink-dark uppercase tracking-wider mb-3">
                  Core Technology Stack
                </h5>
                <div className="flex flex-wrap gap-2">
                  {activeModalService.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="bg-surface-secondary text-ink-dark font-label-bold text-xs px-3 py-1 border border-outline-variant"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-outline-variant flex justify-end gap-3">
              <Button variant="outline" onClick={() => setActiveModalService(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon="arrow_forward"
                onClick={() => {
                  setActiveModalService(null);
                  onNavigate('/contact');
                }}
              >
                Request Service
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
