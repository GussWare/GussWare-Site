import React from 'react';
import { ProcessTimeline } from '../components/process/ProcessTimeline';
import { processSteps } from '../data/process';
import { Button } from '../components/ui/Button';

interface HowWeWorkPageProps {
  onNavigate: (path: string) => void;
}

export const HowWeWorkPage: React.FC<HowWeWorkPageProps> = ({ onNavigate }) => {
  const deepDivePhases = [
    {
      num: '01',
      title: 'Discover & Requirements Analysis',
      goal: 'Align on business context, operational bottlenecks, compliance requirements, and technical prerequisites.',
      deliverables: [
        'Stakeholder alignment workshops',
        'Requirements specifications document',
        'Architecture feasibility audit',
        'Risk & dependency matrix',
      ],
      icon: 'search',
    },
    {
      num: '02',
      title: 'Define & Strategic Architecture',
      goal: 'Structure the technical blueprint, database schemas, API contracts, and sprint roadmaps.',
      deliverables: [
        'Interactive wireframes & UX prototypes',
        'System architecture diagram & data models',
        'Milestone deliverables & SLA definition',
        'Specialist team allocation',
      ],
      icon: 'architecture',
    },
    {
      num: '03',
      title: 'Build, Integrate & Iterate',
      goal: 'Execute agile development sprints with continuous integration, automated testing, and bi-weekly demonstrations.',
      deliverables: [
        'Type-safe, production-ready codebase',
        'Automated CI/CD pipeline',
        'Peer code reviews & security scans',
        'Bi-weekly staging deployment reviews',
      ],
      icon: 'code_blocks',
    },
    {
      num: '04',
      title: 'Launch, Deploy & Scale',
      goal: 'Execute zero-downtime production deployment, telemetry configuration, handover documentation, and ongoing support.',
      deliverables: [
        'Production release orchestration',
        'Real-time monitoring & observability dashboards',
        'Comprehensive technical documentation',
        'Ongoing maintenance & SLA guarantees',
      ],
      icon: 'rocket_launch',
    },
  ];

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mb-16">
        <div className="max-w-3xl">
          <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-4">
            PROVEN METHODOLOGY
          </span>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark mb-6 leading-tight">
            How We Deliver Digital Excellence
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Our constructivist engineering methodology merges rigorous structural planning with
            human intuition. We break complex technical hurdles into predictable, transparent
            milestones.
          </p>
        </div>
      </div>

      {/* Interactive Process Timeline */}
      <ProcessTimeline onStartProject={() => onNavigate('/contact')} />

      {/* Deep-Dive Phases Breakdown */}
      <section className="py-16 md:py-24 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 border-t border-outline-variant">
        <div className="max-w-3xl mb-16">
          <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-2">
            DELIVERABLES &amp; RIGOR
          </span>
          <h2 className="font-headline-lg text-headline-lg text-ink-dark">
            Detailed Phase Deliverables
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deepDivePhases.map((phase) => (
            <div
              key={phase.num}
              className="bg-surface-primary border border-outline-variant p-8 md:p-10 flex flex-col justify-between hover:border-primary transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="material-symbols-outlined text-primary text-3xl">
                    {phase.icon}
                  </span>
                  <span className="font-headline-md text-2xl text-outline font-mono">
                    {phase.num}
                  </span>
                </div>
                <h3 className="font-headline-md text-2xl text-ink-dark mb-3">{phase.title}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6 leading-relaxed">
                  {phase.goal}
                </p>

                <div className="pt-4 border-t border-outline-variant/30">
                  <h4 className="font-label-bold text-xs text-ink-dark uppercase tracking-wider mb-3">
                    Concrete Deliverables
                  </h4>
                  <ul className="space-y-2">
                    {phase.deliverables.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-on-surface-variant"
                      >
                        <span className="material-symbols-outlined text-primary text-base flex-shrink-0 mt-0.5">
                          check
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 md:p-12 bg-surface-secondary border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="font-headline-md text-2xl text-ink-dark mb-2">
              Ready to scope your upcoming initiative?
            </h3>
            <p className="font-body-md text-on-surface-variant max-w-xl">
              We'll conduct a discovery review with our principal architects and provide a structured
              project roadmap.
            </p>
          </div>
          <Button variant="primary" size="lg" icon="arrow_forward" onClick={() => onNavigate('/contact')}>
            Schedule Discovery
          </Button>
        </div>
      </section>
    </div>
  );
};
