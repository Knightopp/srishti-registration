import React from 'react';
import { User, Users, Sparkles, ArrowRight, ShieldCheck, Trophy, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl overflow-y-auto">
      {/* Background glow effects */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-[#38BDF8]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-2xl flex flex-col gap-5 my-auto">
        
        {/* Top Header Badge & Close */}
        <div className="flex items-center justify-between px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-xs font-['IBM_Plex_Mono']">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>CHOOSE YOUR ARENA // SRISHTI 2.7</span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BOX 1: TOP BOX (SLIDES IN FROM TOP) - SOLO EVENTS */}
        <div
          onClick={() => onSelectType('solo')}
          className="group animate-slide-down-in cursor-pointer relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#0a121e] via-[#091424] to-[#0d1c33] border border-[#38BDF8]/30 hover:border-[#38BDF8] shadow-2xl hover:shadow-[#38BDF8]/20 transition-all duration-300 hover:scale-[1.01]"
        >
          {/* Subtle card glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#38BDF8]/10 rounded-full blur-2xl group-hover:bg-[#38BDF8]/20 transition-all" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#38BDF8]/25 transition-all text-[#38BDF8]">
                <User className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-[#38BDF8] font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-wider uppercase">
                    ⚡ 1 Participant
                  </span>
                  <span className="text-white/40 text-xs font-['IBM_Plex_Mono']">Individual Quest</span>
                </div>

                <h3 className="font-['Montserrat'] font-black text-xl sm:text-2xl text-white tracking-tight group-hover:text-[#38BDF8] transition-colors">
                  Solo Events
                </h3>

                <p className="text-xs sm:text-sm text-white/60 mt-1 font-light leading-relaxed max-w-md">
                  Prove your individual prowess in Competitive Coding, Bug Diagnostics, AI WebSprint & Blind Coding.
                </p>

                {/* Event Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['Codex', 'Bug Hunt', 'AI WebSprint', 'Blind Coding'].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-['IBM_Plex_Mono'] text-white/50 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full bg-[#38BDF8]/15 hover:bg-[#38BDF8] text-[#38BDF8] hover:text-black border border-[#38BDF8]/40 font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 group-hover:bg-[#38BDF8] group-hover:text-black transition-all shadow-md"
              >
                <span>Select Solo</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* BOX 2: BOTTOM BOX (SLIDES IN FROM BOTTOM) - TEAM EVENTS */}
        <div
          onClick={() => onSelectType('team')}
          className="group animate-slide-up-in cursor-pointer relative overflow-hidden rounded-3xl p-6 sm:p-7 bg-gradient-to-r from-[#0d1428] via-[#091a38] to-[#0e274a] border border-[#2563EB]/40 hover:border-[#60A5FA] shadow-2xl hover:shadow-[#2563EB]/30 transition-all duration-300 hover:scale-[1.01]"
        >
          {/* Subtle card glow */}
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#2563EB]/15 rounded-full blur-2xl group-hover:bg-[#2563EB]/30 transition-all" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-[#2563EB]/30 transition-all text-[#60A5FA]">
                <Users className="w-7 h-7" />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-['IBM_Plex_Mono'] text-[10px] font-bold tracking-wider uppercase">
                    👥 2 to 4+ Members
                  </span>
                  <span className="text-white/40 text-xs font-['IBM_Plex_Mono']">Squad & Crew Battles</span>
                </div>

                <h3 className="font-['Montserrat'] font-black text-xl sm:text-2xl text-white tracking-tight group-hover:text-blue-300 transition-colors">
                  Team Events
                </h3>

                <p className="text-xs sm:text-sm text-white/60 mt-1 font-light leading-relaxed max-w-md">
                  Assemble your squad with all teammate details. Compete in Treasure Hunt, Ideathon, TraceBot Robotics, Waltz Dance & Escape Puzzles.
                </p>

                {/* Event Tags */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {['Treasure Hunt', 'Ideathon', 'TraceBot', 'Waltz Dance', 'Mind Game', 'ByteQuiz'].map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] font-['IBM_Plex_Mono'] text-white/50 border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action CTA */}
            <div className="self-end sm:self-center shrink-0">
              <button
                type="button"
                className="px-5 py-2.5 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 group-hover:scale-105 transition-all shadow-lg"
              >
                <span>Select Team</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center pt-2">
          <p className="text-xs text-white/40 font-['IBM_Plex_Mono']">
            Need to register multiple members? Choose <span className="text-[#38BDF8] font-bold">Team Events</span> to input everyone's details.
          </p>
        </div>

      </div>
    </div>
  );
};
