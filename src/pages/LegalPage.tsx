import React from 'react';

interface LegalPageProps {
  type: 'privacy' | 'terms';
  onNavigate: (path: string) => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ type, onNavigate }) => {
  const isPrivacy = type === 'privacy';

  return (
    <div className="py-12 md:py-20 max-w-[900px] mx-auto px-4 sm:px-6 md:px-8">
      <div className="mb-12 border-b border-outline-variant pb-6">
        <span className="font-label-bold text-xs text-accent-orange uppercase tracking-widest block mb-2">
          LEGAL &amp; COMPLIANCE
        </span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark">
          {isPrivacy ? 'Privacy Policy' : 'Terms of Service'}
        </h1>
        <p className="font-body-md text-sm text-on-surface-variant mt-2">
          Last updated: October 2024
        </p>
      </div>

      <div className="prose-editorial">
        {isPrivacy ? (
          <>
            <h2>1. Information We Collect</h2>
            <p>
              GussWare ("we", "our", or "us") respects your privacy. We collect information you
              provide directly to us when inquiring about services, applying to join our freelance
              guild, or subscribing to community updates.
            </p>

            <h2>2. How We Use Information</h2>
            <p>
              We use information to provide, maintain, and improve our services, facilitate client
              engagements with freelance specialists, and communicate project roadmaps. We never
              sell your personal information to third parties.
            </p>

            <h2>3. Intellectual Property &amp; Confidentiality</h2>
            <p>
              All client IP, code repositories, and proprietary architectural documentation remain
              strictly confidential under mutual non-disclosure agreements.
            </p>

            <h2>4. Contact</h2>
            <p>
              For privacy inquiries or data requests, contact us at{' '}
              <strong>privacy@gussware.com</strong>.
            </p>
          </>
        ) : (
          <>
            <h2>1. Engagement Agreement</h2>
            <p>
              By accessing GussWare’s platforms and services, you agree to comply with our standard
              master service terms and collaborative delivery guidelines.
            </p>

            <h2>2. Deliverables &amp; Warranty</h2>
            <p>
              All code and digital architecture developed through the GussWare specialist network
              undergoes rigorous quality verification and peer review prior to milestone sign-off.
            </p>

            <h2>3. Specialist Code of Conduct</h2>
            <p>
              Members of the GussWare collective adhere to high standards of professional integrity,
              security, and transparent communication.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
