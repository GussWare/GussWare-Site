import React from 'react';
import { ProjectItem } from '../../types';

interface ProjectCardProps {
  project: ProjectItem;
  onSelect: (project: ProjectItem) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-surface-primary border border-outline-variant group hover:shadow-lg transition-all duration-300 flex flex-col h-full cursor-pointer"
    >
      <div className="aspect-[16/10] overflow-hidden relative bg-surface-container">
        <img
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          src={project.imageUrl}
        />
        <div className="absolute top-4 left-4">
          <span className="badge">{project.category}</span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-headline-md text-xl mb-3 text-on-surface group-hover:text-primary transition-colors line-clamp-1">
          {project.title}
        </h3>
        <p className="font-body-md text-body-md text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.capabilities.slice(0, 3).map((cap, i) => (
            <span
              key={i}
              className="bg-surface-secondary text-ink-dark text-[11px] font-label-bold px-2 py-0.5"
            >
              {cap}
            </span>
          ))}
          {project.capabilities.length > 3 && (
            <span className="text-[11px] text-outline self-center font-semibold">
              +{project.capabilities.length - 3}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between text-sm pt-4 border-t border-outline-variant/30 text-on-surface-variant">
          <span className="font-semibold text-ink-dark">{project.client || 'Enterprise Client'}</span>
          <span className="text-primary font-label-bold flex items-center group-hover:text-accent-orange transition-colors">
            Case Study
            <span className="material-symbols-outlined text-sm ml-1 transform group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};
