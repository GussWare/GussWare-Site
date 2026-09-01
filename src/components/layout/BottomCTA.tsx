import React from 'react';
import { Button } from '../ui/Button';

interface BottomCTAProps {
  onNavigate: (path: string) => void;
}

export const BottomCTA: React.FC<BottomCTAProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-primary-container text-white overflow-hidden py-16 md:py-24 border-t border-outline-variant/20">
      {/* Abstract Geometry Elements */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20px 20px, rgba(255, 255, 255, 0.15) 2px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute -right-32 -bottom-32 w-96 h-96 border-[40px] border-secondary-container opacity-20 rotate-45 pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-32 h-1 bg-highlight-pink opacity-50 pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-1 h-32 bg-accent-orange opacity-80 pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-2/3 max-w-3xl">
          <span className="font-label-bold text-label-bold text-accent-orange bg-white/10 px-3 py-1 uppercase tracking-widest inline-block mb-4">
            LET'S COLLABORATE
          </span>
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg mb-6 leading-tight tracking-tight">
            Ready to build the future?
          </h2>
          <p className="font-body-lg text-body-lg text-on-primary-container mb-10 max-w-2xl opacity-90 leading-relaxed">
            Join our community of specialized talent and turn your ideas into high-impact digital
            solutions with industrial precision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="primary"
              size="lg"
              icon="arrow_forward"
              onClick={() => onNavigate('/contact')}
              className="bg-accent-orange hover:bg-white hover:text-accent-orange transition-all duration-300"
            >
              Start a Conversation
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => onNavigate('/how-we-work')}
              className="border-white/40 text-white hover:bg-white hover:text-primary hover:border-white"
            >
              How We Work
            </Button>
          </div>
        </div>

        <div className="md:w-1/3 flex justify-center md:justify-end">
          {/* Thematic structural graphic implying modular constructivist blocks */}
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 bg-secondary-fixed-dim opacity-20 transform translate-x-4 translate-y-4" />
            <div className="absolute inset-0 border-2 border-white/30" />
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-white/10 backdrop-blur-xs flex items-center justify-center">
              <span className="material-symbols-outlined text-white/70 text-3xl">hub</span>
            </div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-accent-orange opacity-90 flex items-center justify-center shadow-lg">
              <span
                className="material-symbols-outlined text-white text-5xl"
                data-icon="precision_manufacturing"
              >
                precision_manufacturing
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
