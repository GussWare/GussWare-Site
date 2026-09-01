import React, { useState } from 'react';
import { projectsData } from '../data/projects';
import { ProjectCard } from '../components/projects/ProjectCard';
import { ProjectDetailModal } from '../components/projects/ProjectDetailModal';
import { ProjectItem } from '../types';
import { cn } from '../lib/utils';

interface ProjectsPageProps {
  onNavigate: (path: string) => void;
  onSelectProject?: (project: ProjectItem) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onNavigate, onSelectProject }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'Enterprise', 'Design Systems', 'Custom Software', 'Mobile Apps'];

  const filteredProjects =
    selectedCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  const handleCardClick = (project: ProjectItem) => {
    setActiveModalProject(project);
    onSelectProject?.(project);
  };

  return (
    <div className="py-12 md:py-20 max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
      {/* Header */}
      <div className="max-w-3xl mb-12">
        <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-widest block mb-4">
          PORTFOLIO &amp; CASE STUDIES
        </span>
        <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-ink-dark mb-6 leading-tight">
          Engineered for Impact
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
          Explore our recent client engagements, enterprise systems, and modular digital tools built
          by the GussWare specialist network.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 md:gap-3 mb-12">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-5 py-2 rounded-full font-label-bold text-label-bold text-sm transition-all duration-200 cursor-pointer select-none',
                isActive
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface-secondary text-on-surface-variant border border-outline-variant hover:bg-highlight-pink hover:border-highlight-pink hover:text-ink-dark'
              )}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={handleCardClick} />
        ))}
      </div>

      {/* Project Detail Modal */}
      <ProjectDetailModal
        project={activeModalProject}
        isOpen={Boolean(activeModalProject)}
        onClose={() => setActiveModalProject(null)}
        onContactProject={() => onNavigate('/contact')}
      />
    </div>
  );
};
