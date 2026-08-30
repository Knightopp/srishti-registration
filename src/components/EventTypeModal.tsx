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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      
      {/* 70% Black Base Container */}
      <div className="relative w-full max-w-xl game-canvas-black rounded-[32px] p-6 sm:p-8 flex flex-col gap-6 my-auto shadow-2xl border border-white/15">
        
        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-white/10">
          <div>
            <h2 className="headline-display text-3xl sm:text-4xl text-white tracking-tight">
              Choose Event Track
            </h2>
            <p className="text-xs sm:text-sm text-white/50 mt-1 font-normal font-['Outfit']">
              Select your competitive arena to proceed with registration.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#141824] border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
            title="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BOX 1: TOP BOX - SOLO ARENAS */}
        <div
          onClick={() => onSelectType('solo')}
          className="animate-slide-down-in game-poster-card p-6 relative overflow-hidden cursor-pointer group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141824] border border-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-['Outfit'] font-bold border border-white/10">
                    1 Participant
                  </span>
                </div>

                <h3 className="font-['Outfit'] font-black text-xl text-white group-hover:text-[#38BDF8] transition-colors">
                  Solo Challenges
                </h3>

                <p className="text-xs text-white/60 mt-1 font-normal leading-relaxed max-w-md">
                  Prove your individual coding mastery in Codex, Speed Debugging, Generative WebSprint & Blind Coding.
                </p>

                {/* Progress bar signature */}
                <div className="w-24 white-progress-bar mt-3" />
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="btn-white-action px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
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
          className="animate-slide-up-in game-poster-card p-6 relative overflow-hidden cursor-pointer group"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#141824] border border-white/15 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600/30 text-[#93C5FD] text-[11px] font-['Outfit'] font-bold border border-blue-400/40">
                    2 to 4+ Members
                  </span>
                </div>

                <h3 className="font-['Outfit'] font-black text-xl text-white group-hover:text-[#38BDF8] transition-colors">
                  Team Competitions
                </h3>

                <p className="text-xs text-white/60 mt-1 font-normal leading-relaxed max-w-md">
                  Assemble your squad. Input all teammates' details for Treasure Hunt, Ideathon, TraceBot, Waltz & Escape Rooms.
                </p>

                {/* Progress bar signature */}
                <div className="w-24 white-progress-bar mt-3" />
              </div>
            </div>

            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="btn-blue-agent-pill px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5"
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
