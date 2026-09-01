import React from 'react';
import { ContactForm } from '../components/contact/ContactForm';
import { SocialConnect } from '../components/contact/SocialConnect';
import { FaqAccordion } from '../components/faq/FaqAccordion';

interface ContactPageProps {
  onNavigate: (path: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="pt-12 md:pt-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Social Connect */}
          <div className="md:col-span-5">
            <span className="font-label-bold text-label-bold text-secondary uppercase tracking-widest block mb-4">
              GET IN TOUCH
            </span>
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark mb-6 leading-tight">
              Let's Build Something Together
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
              We prefer real conversations over sterile contact forms. Tell us about your project
              and we'll connect you with the right minds.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary">mail</span>
                <span className="font-semibold">hello@gussware.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary">schedule</span>
                <span>Response within 24 business hours</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-on-surface">
                <span className="material-symbols-outlined text-primary">verified_user</span>
                <span>NDA &amp; IP Protection standard on all engagements</span>
              </div>
            </div>

            {/* Social Connect Icons */}
            <SocialConnect />
          </div>

          {/* Right Column: Contact Form */}
          <div className="md:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FaqAccordion />
    </div>
  );
};
