import React from 'react';
import { User, Users, ArrowUpRight, X } from 'lucide-react';

interface EventTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: 'solo' | 'team') => void;
}

export const EventTypeModal: React.FC<EventTypeModalProps> = ({
  isOpen,
  onClose,
  onSelectType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      {/* Container: Monochromatic Canvas */}
      <div className="relative w-full max-w-xl mono-canvas rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 my-auto shadow-2xl">
        
        {/* Top Header */}
        <div className="flex items-start justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#171C26] border border-white/10 text-white/70 text-xs font-['Outfit'] font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <span className="tracking-wider uppercase text-[11px]">ARENA SELECTION // SRISHTI 2.7</span>
            </div>

            <h2 className="headline-display text-3xl sm:text-4xl text-white tracking-tight leading-none mt-1">
              Choose Track.
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-1 font-normal font-['Outfit']">
              Select your competitive arena to proceed with pass registration.
            </p>
          </div>

          <button
            onClick={onClose}
            className="mono-icon-btn"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BOX 1: TOP BOX - SOLO ARENAS */}
        <div
          onClick={() => onSelectType('solo')}
          className="animate-slide-down-in mono-card-surface p-6 relative overflow-hidden cursor-pointer group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="mono-icon-btn shrink-0 mt-1 bg-[#232938] border-white/15">
                <User className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-['Outfit'] font-bold border border-white/10">
                    1 Participant
                  </span>
                  <span className="text-white/40 text-xs font-['IBM_Plex_Mono']">Individual Quest</span>
                </div>

                <h3 className="font-['Outfit'] font-black text-xl text-white group-hover:text-[#38BDF8] transition-colors">
                  Solo Challenges
                </h3>

                <p className="text-xs text-white/60 mt-1 font-normal leading-relaxed max-w-md">
                  Prove your individual coding mastery in Codex, Speed Debugging, Generative WebSprint & Blind Coding.
                </p>

                {/* Event Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['Codex', 'Bug Hunt', 'AI WebSprint', 'Blind Coding'].map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#0A0D13] text-[10px] font-['Outfit'] font-medium text-white/60 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="btn-mono-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>Select Solo</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* BOX 2: BOTTOM BOX - TEAM EVENTS */}
        <div
          onClick={() => onSelectType('team')}
          className="animate-slide-up-in mono-card-elevated p-6 relative overflow-hidden cursor-pointer group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="mono-icon-btn shrink-0 mt-1 bg-[#232938] border-white/15">
                <Users className="w-5 h-5 text-white" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-['Outfit'] font-bold border border-emerald-500/30">
                    2 to 4+ Members
                  </span>
                  <span className="text-white/40 text-xs font-['IBM_Plex_Mono']">Squad Battles</span>
                </div>

                <h3 className="font-['Outfit'] font-black text-xl text-white group-hover:text-emerald-400 transition-colors">
                  Team Competitions
                </h3>

                <p className="text-xs text-white/60 mt-1 font-normal leading-relaxed max-w-md">
                  Assemble your squad. Input all teammates' details for Treasure Hunt, Ideathon, TraceBot, Waltz & Escape Rooms.
                </p>

                {/* Event Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['Treasure Hunt (4)', 'Ideathon (4)', 'TraceBot (2-4)', 'Waltz Dance'].map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-[#0A0D13] text-[10px] font-['Outfit'] font-medium text-white/60 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="btn-mono-accent px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <span>Select Team</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
