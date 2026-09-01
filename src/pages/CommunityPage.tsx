import React, { useState } from 'react';
import { CommunityModelDiagram } from '../components/community/CommunityModelDiagram';
import { ValuePoints } from '../components/community/ValuePoints';
import { TalentSpecialists } from '../components/community/TalentSpecialists';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

interface CommunityPageProps {
  onNavigate: (path: string) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({
    name: '',
    email: '',
    role: 'Frontend Architect',
    githubOrPortfolio: '',
    experience: '',
  });
  const [isApplied, setIsApplied] = useState(false);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplied(true);
    setTimeout(() => {
      setIsApplyModalOpen(false);
      setIsApplied(false);
    }, 2000);
  };

  return (
    <div className="py-12 md:py-20 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-16">
        <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-4">
          SPECIALIST NETWORK
        </span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark mb-6 leading-tight">
          El modelo de talento de GussWare
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Unimos a los mejores talentos freelance con empresas líderes para crear soluciones
          digitales excepcionales. Menos burocracia, más foco en la calidad de la ingeniería.
        </p>
      </div>

      {/* Model Visual Diagram */}
      <CommunityModelDiagram />

      {/* 4 Core Value Points */}
      <ValuePoints />

      {/* Specialist Guilds & Breakdown */}
      <TalentSpecialists onJoinClick={() => setIsApplyModalOpen(true)} />

      {/* Specialist Application Modal */}
      <Modal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        title="Join the GussWare Specialist Network"
      >
        {isApplied ? (
          <div className="text-center py-8">
            <div className="w-14 h-14 bg-primary-fixed text-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-3xl">check</span>
            </div>
            <h4 className="font-headline-md text-xl text-ink-dark mb-2">Application Received!</h4>
            <p className="text-sm text-on-surface-variant">
              Our guild review committee will review your credentials and get in touch.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApplySubmit} className="space-y-4">
            <p className="text-sm text-on-surface-variant mb-4">
              We welcome seasoned engineers, systems architects, and constructivist designers who
              value craft, autonomy, and high-impact collaboration.
            </p>

            <div>
              <label className="font-label-bold text-xs text-ink-dark block mb-1">Full Name</label>
              <input
                required
                type="text"
                placeholder="Jane Doe"
                className="w-full bg-surface-primary border border-outline-variant p-3 font-body-md text-sm"
                value={applyForm.name}
                onChange={(e) => setApplyForm({ ...applyForm, name: e.target.value })}
              />
            </div>

            <div>
              <label className="font-label-bold text-xs text-ink-dark block mb-1">Email</label>
              <input
                required
                type="email"
                placeholder="jane@domain.com"
                className="w-full bg-surface-primary border border-outline-variant p-3 font-body-md text-sm"
                value={applyForm.email}
                onChange={(e) => setApplyForm({ ...applyForm, email: e.target.value })}
              />
            </div>

            <div>
              <label className="font-label-bold text-xs text-ink-dark block mb-1">
                Primary Specialty
              </label>
              <select
                className="w-full bg-surface-primary border border-outline-variant p-3 font-body-md text-sm"
                value={applyForm.role}
                onChange={(e) => setApplyForm({ ...applyForm, role: e.target.value })}
              >
                <option value="Frontend Architect">Frontend Architect (React / TypeScript / Tailwind)</option>
                <option value="Backend Engineer">Backend &amp; Distributed Systems (Node / Go / SQL)</option>
                <option value="Mobile Specialist">Mobile Specialist (React Native / Native)</option>
                <option value="UI/UX Designer">Constructivist UI/UX Designer (Design Systems)</option>
                <option value="DevOps Practitioner">Cloud &amp; DevOps Engineer</option>
              </select>
            </div>

            <div>
              <label className="font-label-bold text-xs text-ink-dark block mb-1">
                Portfolio, GitHub, or LinkedIn URL
              </label>
              <input
                required
                type="url"
                placeholder="https://github.com/..."
                className="w-full bg-surface-primary border border-outline-variant p-3 font-body-md text-sm"
                value={applyForm.githubOrPortfolio}
                onChange={(e) => setApplyForm({ ...applyForm, githubOrPortfolio: e.target.value })}
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsApplyModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
