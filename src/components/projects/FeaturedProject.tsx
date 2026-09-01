import React, { useState } from 'react';
import { projectsData } from '../../data/projects';
import { ProjectItem } from '../../types';

interface FeaturedProjectProps {
  onNavigate: (path: string) => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({
  onNavigate,
  onSelectProject,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentProject = projectsData[currentIndex] || projectsData[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projectsData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projectsData.length) % projectsData.length);
  };

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 md:px-8 max-w-[1280px] mx-auto border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Content Block */}
        <div className="col-span-12 md:col-span-5 flex flex-col justify-center h-full pr-0 md:pr-4">
          <div className="mb-6">
            <span className="font-label-bold text-label-bold text-accent-orange bg-surface-secondary px-3 py-1 uppercase tracking-widest inline-block mb-4">
              Featured Project
            </span>
            <h2 className="font-headline-lg text-headline-lg md:font-display-lg md:text-display-lg text-ink-dark mb-4 tracking-tight leading-tight">
              {currentProject.title}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-6 leading-relaxed">
              {currentProject.description}
            </p>
          </div>

          {/* Capabilities Badges */}
          <div className="mb-8">
            <h3 className="font-label-bold text-label-bold text-ink-dark mb-3">Core Capabilities</h3>
            <div className="flex flex-wrap gap-2">
              {currentProject.capabilities.map((cap, i) => (
                <span
                  key={i}
                  className="bg-surface-secondary text-ink-dark font-label-bold text-[12px] px-3 py-1 uppercase"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>

          {/* Navigation & CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mt-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={handlePrev}
                aria-label="Previous project"
                className="w-12 h-12 flex items-center justify-center rounded-full border border-outline hover:border-primary hover:text-primary transition-colors text-ink-dark group cursor-pointer"
              >
                <span className="material-symbols-outlined transition-transform group-hover:-translate-x-1">
                  arrow_back
                </span>
              </button>
              <span className="font-label-bold text-label-bold text-outline">
                {String(currentIndex + 1).padStart(2, '0')} / {String(projectsData.length).padStart(2, '0')}
              </span>
              <button
                onClick={handleNext}
                aria-label="Next project"
                className="w-12 h-12 flex items-center justify-center rounded-full border border-outline hover:border-primary hover:text-primary transition-colors text-ink-dark group cursor-pointer"
              >
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </button>
            </div>
            
            <button
              onClick={() => onSelectProject?.(currentProject)}
              className="font-label-bold text-label-bold text-primary hover:text-accent-orange transition-colors flex items-center gap-2 group cursor-pointer"
            >
              <span>View Case Study</span>
              <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </button>
          </div>
        </div>

        {/* Visual Showcase with geometric constructive frame */}
        <div
          onClick={() => onSelectProject?.(currentProject)}
          className="col-span-12 md:col-span-7 h-[360px] md:h-[520px] relative mt-8 md:mt-0 cursor-pointer group"
        >
          <div className="absolute inset-0 bg-surface-container-high translate-x-3 translate-y-3 -z-10 transition-transform group-hover:translate-x-4 group-hover:translate-y-4" />
          <img
            alt={currentProject.title}
            className="w-full h-full object-cover border border-outline-variant shadow-xs group-hover:shadow-md transition-all"
            src={currentProject.imageUrl}
          />
          <div className="absolute bottom-4 right-4 bg-ink-dark/85 text-white text-xs font-label-bold px-3 py-1.5 backdrop-blur-xs flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span>Click to Expand</span>
          </div>
        </div>
      </div>
    </section>
  );
};
