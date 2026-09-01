import React from 'react';
import { specialistRoles } from '../../data/community';

interface TalentSpecialistsProps {
  onJoinClick?: () => void;
}

export const TalentSpecialists: React.FC<TalentSpecialistsProps> = ({ onJoinClick }) => {
  return (
    <div className="mt-16 pt-16 border-t border-outline-variant">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="font-label-bold text-label-bold text-accent-orange uppercase tracking-wider block mb-2">
            SPECIALIZED GUILDS
          </span>
          <h3 className="font-headline-lg text-headline-lg text-ink-dark">
            Domain Specialists Across the Stack
          </h3>
        </div>
        {onJoinClick && (
          <button
            onClick={onJoinClick}
            className="btn-secondary text-sm uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <span>Apply as a Specialist</span>
            <span className="material-symbols-outlined text-sm">person_add</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialistRoles.map((spec, i) => (
          <div
            key={i}
            className="bg-surface-primary border border-outline-variant p-6 hover:border-primary transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="material-symbols-outlined text-primary text-3xl">{spec.icon}</span>
              <span className="bg-surface-secondary text-ink-dark text-xs font-label-bold px-2.5 py-1">
                {spec.count} Specialists
              </span>
            </div>
            <h4 className="font-headline-md text-xl text-ink-dark mb-2">{spec.role}</h4>
            <p className="text-xs text-on-surface-variant uppercase font-semibold mb-4 tracking-wider">
              {spec.category}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-outline-variant/30">
              {spec.skills.map((skill, si) => (
                <span
                  key={si}
                  className="bg-surface-secondary text-ink-dark text-[11px] font-semibold px-2 py-0.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
