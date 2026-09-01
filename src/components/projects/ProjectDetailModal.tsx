import React from 'react';
import { ProjectItem } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface ProjectDetailModalProps {
  project: ProjectItem | null;
  isOpen: boolean;
  onClose: () => void;
  onContactProject?: (project: ProjectItem) => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({
  project,
  isOpen,
  onClose,
  onContactProject,
}) => {
  if (!project) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={project.title} className="max-w-3xl">
      <div className="space-y-6">
        <div className="relative aspect-video w-full overflow-hidden border border-outline-variant bg-surface-container">
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4">
            <span className="badge">{project.category}</span>
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="font-label-bold text-sm text-accent-orange uppercase tracking-wider">
              {project.client} • {project.year || '2024'}
            </span>
          </div>
          <h4 className="font-headline-md text-2xl text-ink-dark mb-4">
            {project.subtitle || project.title}
          </h4>
          <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
            {project.fullDescription || project.description}
          </p>
        </div>

        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-3 gap-4 p-4 bg-surface-secondary border border-outline-variant">
            {project.metrics.map((metric, i) => (
              <div key={i} className="text-center">
                <div className="font-display-lg text-2xl md:text-3xl font-bold text-primary">
                  {metric.value}
                </div>
                <div className="text-xs text-on-surface-variant uppercase font-label-bold mt-1">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <h5 className="font-label-bold text-label-bold text-ink-dark mb-3">
            Technology Stack &amp; Capabilities
          </h5>
          <div className="flex flex-wrap gap-2">
            {project.capabilities.map((cap, i) => (
              <span
                key={i}
                className="bg-surface-secondary border border-outline-variant text-ink-dark font-label-bold text-xs px-3 py-1.5"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-outline-variant flex flex-col sm:flex-row justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            variant="primary"
            icon="arrow_forward"
            onClick={() => {
              onClose();
              onContactProject?.(project);
            }}
          >
            Discuss a Similar Project
          </Button>
        </div>
      </div>
    </Modal>
  );
};
