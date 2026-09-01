import React from 'react';

export const CommunityModelDiagram: React.FC = () => {
  return (
    <div className="w-full mb-24">
      {/* Desktop Visual Diagram (Layered Progression) */}
      <div className="w-full hidden md:block">
        <div className="grid grid-cols-5 gap-6 items-stretch min-h-[380px]">
          {/* Stage 1: Client */}
          <div className="bg-[#F2F2F2] rounded-none flex items-center justify-center relative p-6 border border-neutral/30">
            <div className="bg-surface-primary border border-neutral p-6 w-32 h-32 flex flex-col items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-primary mb-2 text-3xl" data-icon="business">
                business
              </span>
              <span className="font-label-bold text-xs text-ink-dark uppercase text-center tracking-wider">
                Client
              </span>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
          </div>

          {/* Stage 2: GussWare Core */}
          <div className="bg-[#F2F2F2] rounded-none flex items-center justify-center relative p-6 border border-neutral/30">
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
            <div className="bg-primary-container p-6 w-36 h-36 flex flex-col items-center justify-center shadow-lg border-2 border-primary-fixed transform -translate-y-1 text-center">
              <span className="material-symbols-outlined text-white mb-2 text-4xl" data-icon="hub">
                hub
              </span>
              <span className="font-label-bold text-xs text-white uppercase tracking-wider leading-tight">
                GussWare<br />Core
              </span>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
          </div>

          {/* Stage 3: Specialist Community Nodes */}
          <div className="bg-[#F2F2F2] rounded-none flex flex-col items-center justify-between py-8 px-4 relative border border-neutral/30">
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
            <div className="absolute left-[-12px] top-1/2 transform -translate-y-1/2 h-[65%] w-[2px] bg-neutral" />
            <div className="absolute left-[-12px] top-[18%] w-6 h-[2px] bg-neutral" />
            <div className="absolute left-[-12px] top-[82%] w-6 h-[2px] bg-neutral" />

            <div className="bg-surface-primary border border-outline-variant p-3 w-32 flex flex-col items-center justify-center z-10 shadow-xs">
              <span className="material-symbols-outlined text-secondary mb-1 text-xl" data-icon="code">
                code
              </span>
              <span className="font-label-bold text-[11px] text-ink-dark uppercase text-center">
                Developer
              </span>
            </div>

            <div className="bg-surface-primary border border-outline-variant p-3 w-32 flex flex-col items-center justify-center z-10 shadow-xs my-3">
              <span className="material-symbols-outlined text-secondary mb-1 text-xl" data-icon="design_services">
                design_services
              </span>
              <span className="font-label-bold text-[11px] text-ink-dark uppercase text-center">
                Designer
              </span>
            </div>

            <div className="bg-surface-primary border border-outline-variant p-3 w-32 flex flex-col items-center justify-center z-10 shadow-xs">
              <span className="material-symbols-outlined text-secondary mb-1 text-xl" data-icon="database">
                database
              </span>
              <span className="font-label-bold text-[11px] text-ink-dark uppercase text-center">
                Backend
              </span>
            </div>

            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
          </div>

          {/* Stage 4: Project Team */}
          <div className="bg-[#F2F2F2] rounded-none flex items-center justify-center relative p-6 border border-neutral/30">
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
            <div className="bg-surface-primary border-l-4 border-l-primary-container border-y border-r border-outline-variant p-5 w-full flex flex-col items-start justify-center shadow-xs">
              <span className="font-label-bold text-[11px] text-outline uppercase tracking-wider mb-1.5">
                Project Team
              </span>
              <span className="font-body-md text-sm text-ink-dark font-semibold leading-snug">
                Equipo A:<br />Backend + Mobile
              </span>
            </div>
            <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
          </div>

          {/* Stage 5: Solution */}
          <div className="bg-[#F2F2F2] rounded-none flex items-center justify-center relative p-6 border border-neutral/30">
            <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-[2px] bg-neutral z-0" />
            <div className="bg-ink-dark p-6 w-32 h-32 flex flex-col items-center justify-center shadow-md text-center">
              <span className="material-symbols-outlined text-white mb-2 text-3xl" data-icon="rocket_launch">
                rocket_launch
              </span>
              <span className="font-label-bold text-xs text-white uppercase tracking-wider">
                Solution
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Fallback for Diagram */}
      <div className="flex flex-col gap-6 md:hidden bg-[#F2F2F2] p-6 border border-neutral">
        <div className="bg-surface-primary border border-neutral p-5 text-center shadow-xs">
          <span className="material-symbols-outlined text-primary mb-1 text-3xl">business</span>
          <span className="font-label-bold text-xs text-ink-dark uppercase block">Client</span>
        </div>
        <div className="flex justify-center">
          <span className="material-symbols-outlined text-outline">arrow_downward</span>
        </div>
        <div className="bg-primary-container p-6 text-center shadow-lg border-2 border-primary-fixed text-white">
          <span className="material-symbols-outlined text-white mb-1 text-3xl">hub</span>
          <span className="font-label-bold text-xs text-white uppercase block">GussWare Core</span>
        </div>
        <div className="flex justify-center">
          <span className="material-symbols-outlined text-outline">arrow_downward</span>
        </div>
        <div className="bg-surface-primary border border-outline-variant p-4 text-center shadow-xs">
          <span className="font-label-bold text-xs text-ink-dark uppercase block">Specialist Community</span>
          <p className="font-body-md text-xs text-on-surface-variant mt-1.5">
            Full-Stack Developers, UI Designers, Cloud Architects, QA Leads
          </p>
        </div>
        <div className="flex justify-center">
          <span className="material-symbols-outlined text-outline">arrow_downward</span>
        </div>
        <div className="bg-ink-dark p-5 text-center shadow-md text-white">
          <span className="material-symbols-outlined text-white mb-1 text-3xl">rocket_launch</span>
          <span className="font-label-bold text-xs text-white uppercase block">Solution Delivery</span>
        </div>
      </div>
    </div>
  );
};
