import React, { useState } from 'react';
import { faqData } from '../../data/faq';

export const FaqAccordion: React.FC = () => {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto border-t border-outline-variant bg-white">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Left Column: Intro */}
        <div className="md:col-span-4">
          <span className="font-label-bold text-label-bold text-primary uppercase tracking-widest block mb-4">
            FAQ
          </span>
          <h2 className="font-headline-lg text-headline-lg text-ink-dark mb-6 leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            Find answers to common questions about working with the GussWare community and our
            delivery processes.
          </p>
        </div>

        {/* Right Column: Accordion */}
        <div className="md:col-span-8 space-y-2">
          {faqData.map((item) => {
            const isOpen = Boolean(openItems[item.id]);

            return (
              <div key={item.id} className="border-b border-outline-variant">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => toggleItem(item.id)}
                  className="w-full py-6 flex items-center justify-between text-left group focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-headline-md text-xl md:text-2xl text-outline opacity-60 font-mono">
                      {item.number}
                    </span>
                    <span className="font-headline-md text-xl md:text-2xl text-ink-dark group-hover:text-primary transition-colors">
                      {item.question}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-primary text-2xl transition-transform">
                    {isOpen ? 'remove' : 'add'}
                  </span>
                </button>

                {isOpen && (
                  <div className="pb-8 pl-12 md:pl-16 pr-4 animate-in fade-in duration-200">
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
