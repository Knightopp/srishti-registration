import React, { useState } from 'react';
import { 
  User, 
  Trophy, 
  Calendar, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Search, 
  Layers,
  Code
} from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';
import { EventItem } from '../types/registration';

interface SoloEventsViewProps {
  onSelectEvent: (event: EventItem) => void;
  onSwitchToTeam: () => void;
  onOpenModeModal: () => void;
}

export const SoloEventsView: React.FC<SoloEventsViewProps> = ({
  onSelectEvent,
  onSwitchToTeam,
  onOpenModeModal,
}) => {
  const { events } = useRegistration();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Filter only solo events
  const soloEvents = events.filter((e) => e.eventType === 'solo');

  const categories = ['ALL', 'CODING', 'DEBUGGING', 'WEB DEV', 'SCREENLESS'];

  const filteredEvents = soloEvents.filter((ev) => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'CODING') return ev.id === 'codex';
    if (selectedCategory === 'DEBUGGING') return ev.id === 'debugging';
    if (selectedCategory === 'WEB DEV') return ev.id === 'ai-webdev';
    if (selectedCategory === 'SCREENLESS') return ev.id === 'blind-coding';
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Top Banner & Mode Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-['IBM_Plex_Mono'] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>SOLO EVENTS ARENA</span>
            </span>
            <span className="text-white/40 text-xs font-['IBM_Plex_Mono']">
              {soloEvents.length} Individual Challenges
            </span>
          </div>

          <h1 className="font-['Montserrat'] font-black text-2xl sm:text-3xl text-white tracking-tight">
            Solo & Individual Challenges
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 font-light max-w-xl">
            Register individually to test your algorithms, prompt skills, and debugging speed.
          </p>
        </div>

        {/* Mode Switcher Pill */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="p-1 rounded-full bg-white/[0.04] border border-white/10 flex items-center">
            <button
              className="px-3.5 py-1.5 rounded-full bg-gradient-27 text-white text-xs font-['Montserrat'] font-bold shadow-md cursor-default"
            >
              ⚡ Solo Events
            </button>
            <button
              onClick={onSwitchToTeam}
              className="px-3.5 py-1.5 rounded-full text-xs font-['Montserrat'] font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              👥 Team Events
            </button>
          </div>

          <button
            onClick={onOpenModeModal}
            title="Change event type"
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/60 hover:text-white text-xs transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search solo events..."
            className="w-full bg-[#080A0E] border border-white/10 rounded-full pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono']"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-['Montserrat'] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'bg-white/[0.04] text-white/50 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Solo Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev) => (
          <div
            key={ev.id}
            className="group relative flex flex-col justify-between rounded-3xl bg-[#080C14] border border-white/10 hover:border-[#38BDF8]/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/20"
          >
            {/* Top Media Banner */}
            <div className="relative h-44 w-full overflow-hidden bg-black/40">
              <img
                src={ev.image}
                alt={ev.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/40 to-transparent" />

              {/* Badges on Banner */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-['IBM_Plex_Mono'] font-bold text-[#38BDF8] uppercase tracking-wider">
                  {ev.stageLabel}
                </span>

                <span className="px-2.5 py-1 rounded-full bg-cyan-500/30 backdrop-blur-md border border-cyan-400/40 text-[10px] font-['IBM_Plex_Mono'] font-bold text-white flex items-center gap-1 shadow-sm">
                  <User className="w-3 h-3 text-cyan-300" />
                  <span>1 Participant</span>
                </span>
              </div>

              {/* Prize Tag on Banner Bottom */}
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-amber-300 text-[11px] font-bold font-['IBM_Plex_Mono']">
                <Trophy className="w-3.5 h-3.5" />
                <span>{ev.prize}</span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-['Montserrat'] font-extrabold text-lg text-white group-hover:text-[#38BDF8] transition-colors line-clamp-1">
                  {ev.title}
                </h3>

                <p className="text-xs text-white/60 mt-1.5 line-clamp-2 font-light leading-relaxed">
                  {ev.description}
                </p>

                {/* Event Highlights / Metadata */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-['IBM_Plex_Mono'] text-white/50">
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span className="truncate">{ev.time.split('•')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {ev.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[10px] font-['IBM_Plex_Mono'] text-white/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3">
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block">
                    INDIVIDUAL ENTRY FEE
                  </span>
                  <span className="font-['Montserrat'] font-black text-base text-[#38BDF8]">
                    {ev.fee === 0 ? 'FREE' : `₹${ev.fee}`}
                  </span>
                </div>

                <button
                  onClick={() => onSelectEvent(ev)}
                  className="px-4 py-2 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider hover:opacity-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-md group-hover:scale-[1.02]"
                >
                  <span>Register Solo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16 bg-[#080C14] rounded-3xl border border-white/10 p-8">
          <p className="text-white/50 text-sm font-['IBM_Plex_Mono']">
            No solo events found matching your search.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
            }}
            className="mt-3 text-xs text-[#38BDF8] font-bold underline cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

    </div>
  );
};
