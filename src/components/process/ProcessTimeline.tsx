import React, { useState } from 'react';
import { processSteps } from '../../data/process';

interface ProcessTimelineProps {
  onStartProject?: () => void;
}

export const ProcessTimeline: React.FC<ProcessTimelineProps> = ({ onStartProject }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = processSteps[currentStepIndex];

  const handleNext = () => {
    if (currentStepIndex < processSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else if (onStartProject) {
      onStartProject();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const progressPercent = ((currentStepIndex + 1) / processSteps.length) * 100;
  const progressLineWidths = ['0%', '33.33%', '66.66%', '100%'];
  const labels = ['Idea', 'Estrategia', 'Desarrollo', 'Solución'];

  return (
    <section className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-16 md:py-24 border-t border-outline-variant">
      <div className="mb-16 lg:mb-20">
        <p className="text-accent-orange font-label-bold tracking-widest text-label-bold uppercase mb-4">
          NUESTRO PROCESO
        </p>
        <h2 className="text-ink-dark text-display-lg-mobile md:text-display-lg font-display-lg max-w-3xl mb-6 leading-tight">
          De la idea a la solución
        </h2>
        <p className="text-on-surface-variant text-body-lg font-body-lg max-w-2xl leading-relaxed">
          Nuestra metodología probada garantiza resultados de alta calidad a través de un proceso
          estructurado y transparente, diseñado para maximizar el valor en cada etapa del desarrollo
          tecnológico.
        </p>
      </div>

      {/* Progress Nodes Navigation (Desktop) */}
      <div className="hidden lg:block w-full mb-24 relative px-8">
        <div className="relative flex items-center justify-between w-full h-16">
          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-surface-variant -translate-y-1/2 z-0">
            <div
              className="h-full bg-accent-orange transition-all duration-500"
              style={{ width: progressLineWidths[currentStepIndex] }}
            />
          </div>

          {processSteps.map((step, index) => {
            const isPast = index < currentStepIndex;
            const isCurrent = index === currentStepIndex;

            return (
              <button
                key={step.number}
                onClick={() => setCurrentStepIndex(index)}
                className="relative flex flex-col items-center group cursor-pointer focus:outline-none z-10"
              >
                {isCurrent ? (
                  <div className="w-14 h-14 rounded-full bg-accent-orange text-white flex items-center justify-center font-bold text-xl shadow-lg transform scale-110 transition-transform">
                    {step.number}
                  </div>
                ) : isPast ? (
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-accent-orange text-accent-orange flex items-center justify-center font-bold text-sm transition-colors">
                    {step.number}
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-outline-variant text-outline flex items-center justify-center font-bold text-sm transition-colors group-hover:border-primary group-hover:text-primary">
                    {step.number}
                  </div>
                )}
                <span
                  className={`font-label-bold text-xs uppercase tracking-wider absolute -bottom-8 whitespace-nowrap transition-colors ${
                    isCurrent || isPast ? 'text-primary font-bold' : 'text-outline'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Content Slide */}
      <div className="relative overflow-hidden bg-surface-secondary rounded-xl p-8 lg:p-14 min-h-[440px] flex flex-col justify-center border border-outline-variant/40">
        <div className="flex flex-col lg:flex-row items-center gap-12 transition-all duration-300">
          <div className="w-full lg:w-1/2">
            <span className="inline-block px-3 py-1 bg-primary text-white text-label-bold font-label-bold rounded-none mb-6 uppercase tracking-wider text-xs">
              Step {currentStep.number}
            </span>
            <h3 className="text-primary text-headline-md lg:text-headline-lg font-headline-lg mb-6">
              {currentStep.title}
            </h3>
            <p className="text-on-surface-variant text-body-lg lg:text-xl max-w-xl leading-relaxed">
              {currentStep.description}
            </p>
          </div>
          <div className="w-full lg:w-1/2">
            <div className="aspect-video bg-white rounded-xl shadow-md border border-outline-variant overflow-hidden">
              <img
                src={currentStep.imageUrl}
                alt={currentStep.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Step Navigation Controls */}
        <div className="flex items-center gap-4 mt-12 lg:mt-14 relative z-20">
          <button
            onClick={handlePrev}
            disabled={currentStepIndex === 0}
            className="group flex items-center justify-center gap-2 px-6 py-3.5 rounded-none border-2 border-outline-variant text-on-surface-variant font-label-bold text-label-bold hover:bg-surface-container-low hover:text-primary hover:border-primary transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer uppercase text-xs tracking-wider"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            <span>Previous</span>
          </button>
          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-3 px-8 py-3.5 rounded-none bg-primary text-white font-label-bold text-label-bold hover:bg-opacity-90 transition-all shadow-md cursor-pointer uppercase text-xs tracking-wider"
          >
            {currentStepIndex === processSteps.length - 1 ? (
              <>
                <span>Start Project</span>
                <span className="material-symbols-outlined text-lg">rocket_launch</span>
              </>
            ) : (
              <>
                <span>Next Step</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Footer Bar */}
      <div className="mt-8 flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-4">
          <div className="w-36 h-1.5 bg-outline-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-accent-orange transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-label-bold font-label-bold text-primary uppercase text-xs tracking-wider">
            {labels[currentStepIndex]} → {Math.round(progressPercent)}% Complete
          </span>
        </div>
        <p className="text-on-surface-variant text-body-md italic text-sm">
          "Construyendo el futuro paso a paso con rigor constructivista."
        </p>
      </div>
    </section>
  );
};
