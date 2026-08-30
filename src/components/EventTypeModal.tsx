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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl overflow-y-auto">
      {/* Signature Fintech Aurora Bloom (Cobalt & Indigo Luminous Glows) */}
      <div className="fixed top-10 left-1/4 w-[450px] h-[450px] bg-[#2563EB]/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-10 right-1/4 w-[450px] h-[450px] bg-[#4F46E5]/25 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-2xl flex flex-col gap-5 my-auto">
        
        {/* Top Header Row with Stacked Typography */}
        <div className="flex items-start justify-between px-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/60 text-xs font-['Outfit'] font-medium mb-3">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]" />
              <span className="tracking-wider uppercase text-[11px] font-semibold text-white/80">EVENT TYPE SELECTION</span>
            </div>

            <h2 className="headline-display text-3xl sm:text-4xl text-white tracking-tight">
              Choose.<br />
              Compete.<br />
              <span className="text-[#38BDF8]">Conquer.</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BOX 1: TOP BOX (SLIDES IN FROM TOP) - SOLO EVENTS */}
        <div
          onClick={() => onSelectType('solo')}
          className="animate-slide-down-in card-layer-2 rounded-[28px] p-6 sm:p-7 relative overflow-hidden cursor-pointer group hover:scale-[1.01] transition-all duration-300 border border-white/15 hover:border-[#60A5FA]"
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              {/* Circular White Action Icon */}
              <div className="icon-circle-btn shrink-0 mt-1">
                <User className="w-5 h-5 text-black" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="pill-growth-badge px-2.5 py-0.5 text-[11px]">
                    +1 Participant
                  </span>
                  <span className="text-white/40 text-xs font-['IBM_Plex_Mono']">Individual Quest</span>
                </div>

                <h3 className="font-['Outfit'] font-extrabold text-2xl text-white group-hover:text-[#60A5FA] transition-colors">
                  Solo Events
                </h3>

                <p className="text-xs sm:text-sm text-white/60 mt-1 font-normal leading-relaxed max-w-md">
                  Prove your individual coding mastery in Codex, Speed Debugging, Generative WebSprint & Blind Coding.
                </p>

                {/* Event Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['Codex', 'Bug Hunt', 'AI WebSprint', 'Blind Coding'].map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[10px] font-['Outfit'] font-semibold text-white/70 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="btn-electric-blue px-6 py-3 rounded-full font-['Outfit'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 group-hover:scale-105 transition-transform"
              >
                <span>Select Solo</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* BOX 2: BOTTOM BOX (SLIDES IN FROM BOTTOM) - TEAM EVENTS */}
        <div
          onClick={() => onSelectType('team')}
          className="animate-slide-up-in card-layer-3 rounded-[28px] p-6 sm:p-7 relative overflow-hidden cursor-pointer group hover:scale-[1.01] transition-all duration-300 border border-white/20 hover:border-[#93C5FD]"
        >
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              {/* Circular White Action Icon */}
              <div className="icon-circle-btn shrink-0 mt-1">
                <Users className="w-5 h-5 text-black" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="pill-growth-badge px-2.5 py-0.5 text-[11px] bg-sky-500/20 text-sky-200 border-sky-400/40">
                    +2 to 4+ Members
                  </span>
                  <span className="text-white/40 text-xs font-['IBM_Plex_Mono']">Squad Battles</span>
                </div>

                <h3 className="font-['Outfit'] font-extrabold text-2xl text-white group-hover:text-[#93C5FD] transition-colors">
                  Team Events
                </h3>

                <p className="text-xs sm:text-sm text-white/70 mt-1 font-normal leading-relaxed max-w-md">
                  Assemble your squad. Input all teammates details for Treasure Hunt, Ideathon, TraceBot, Waltz & Escape Rooms.
                </p>

                {/* Event Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['Treasure Hunt (4)', 'Ideathon (4)', 'TraceBot (2-4)', 'Waltz Dance', 'Mind Game'].map((tag) => (
                    <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/[0.08] text-[10px] font-['Outfit'] font-semibold text-white/80 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="btn-white-action px-6 py-3 rounded-full text-xs uppercase tracking-wider flex items-center gap-2 group-hover:scale-105 transition-transform"
              >
                <span>Select Team</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2">
          <p className="text-xs text-white/40 font-['Outfit']">
            Registering multiple members? Select <span className="text-[#38BDF8] font-bold">Team Events</span> to input everyone's details.
          </p>
        </div>

      </div>
    </div>
  );
};
