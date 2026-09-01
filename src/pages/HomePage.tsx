import React from 'react';
import { Button } from '../components/ui/Button';
import { servicesData } from '../data/services';
import { ServiceRow } from '../components/services/ServiceRow';
import { FeaturedProject } from '../components/projects/FeaturedProject';
import { CommunityModelDiagram } from '../components/community/CommunityModelDiagram';
import { ValuePoints } from '../components/community/ValuePoints';
import { ProcessTimeline } from '../components/process/ProcessTimeline';
import { FaqAccordion } from '../components/faq/FaqAccordion';
import { BottomCTA } from '../components/layout/BottomCTA';
import { ProjectItem, ServiceItem } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectProject: (project: ProjectItem) => void;
  onSelectService: (service: ServiceItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProject,
  onSelectService,
}) => {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 md:px-8 pt-12 pb-20 md:pt-20 md:pb-32 max-w-[1280px] mx-auto w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="w-2.5 h-2.5 bg-accent-orange rounded-full animate-pulse" />
            <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest text-xs">
              SOFTWARE &amp; COMMUNITY
            </span>
          </div>

          <h1 className="font-display-xl-mobile md:font-display-xl text-display-xl-mobile md:text-display-xl text-ink-dark mb-8 tracking-tight leading-[1.05]">
            Technology built <br className="hidden sm:inline" />
            <span className="text-primary font-bold">by people.</span>
          </h1>

          <p className="font-body-lg text-body-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
            A collaborative freelance community delivering high-impact digital solutions. We
            combine specialized technical talent with human-centric design to build software that
            scales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              variant="primary"
              size="lg"
              icon="arrow_forward"
              onClick={() => onNavigate('/contact')}
              className="text-base"
            >
              Start a Conversation
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => onNavigate('/services')}
              className="text-base"
            >
              Explore Services
            </Button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-10 border-t border-outline-variant/40 max-w-2xl">
            <div>
              <div className="font-display-lg text-2xl md:text-3xl font-bold text-primary">99.8%</div>
              <div className="text-xs text-on-surface-variant uppercase font-label-bold mt-1">
                System Reliability
              </div>
            </div>
            <div>
              <div className="font-display-lg text-2xl md:text-3xl font-bold text-primary">40+</div>
              <div className="text-xs text-on-surface-variant uppercase font-label-bold mt-1">
                Specialist Talent
              </div>
            </div>
            <div>
              <div className="font-display-lg text-2xl md:text-3xl font-bold text-primary">100%</div>
              <div className="text-xs text-on-surface-variant uppercase font-label-bold mt-1">
                Direct Collaboration
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto w-full border-t border-outline-variant">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-16 items-start">
          <div className="md:col-span-5">
            <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-wider block mb-3">
              Capabilities
            </span>
            <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark leading-tight">
              Software Development &amp; Architecture
            </h2>
          </div>
          <div className="md:col-span-6 md:col-start-7 pt-2 md:pt-4 md:pl-8 md:border-l border-outline-variant">
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg leading-relaxed">
              End-to-end technical execution tailored to your specific operational needs. From agile
              frontends to resilient distributed backends.
            </p>
          </div>
        </div>

        <div className="border-t border-outline-variant">
          {servicesData.map((service) => (
            <ServiceRow
              key={service.id}
              service={service}
              onClick={() => {
                onSelectService(service);
                onNavigate('/services');
              }}
            />
          ))}
        </div>
      </section>

      {/* Featured Project Showcase */}
      <FeaturedProject onNavigate={onNavigate} onSelectProject={onSelectProject} />

      {/* Community Model & Values */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto w-full border-t border-outline-variant">
        <div className="max-w-3xl mb-16">
          <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-4">
            COMMUNITY-DRIVEN TALENT
          </span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark mb-6 leading-tight">
            El modelo de talento de GussWare
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Coordinamos equipos a medida con especialistas freelance de alto nivel para garantizar
            soluciones tecnológicas robustas, adaptadas y de impacto real.
          </p>
        </div>

        {/* Visual Workflow Diagram */}
        <CommunityModelDiagram />

        {/* 4 Core Value Points Bento Grid */}
        <ValuePoints />
      </section>

      {/* Process Flow Timeline */}
      <ProcessTimeline onStartProject={() => onNavigate('/contact')} />

      {/* FAQ Accordion */}
      <FaqAccordion />

      {/* Bottom Call to Action Banner */}
      <BottomCTA onNavigate={onNavigate} />
    </div>
  );
};
