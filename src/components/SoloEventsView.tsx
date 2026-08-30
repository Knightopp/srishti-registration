import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Layers,
  ArrowUpRight
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
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="headline-display text-3xl sm:text-4xl text-white tracking-tight">
            Solo Challenges
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 font-['Outfit']">
            Browse and register for individual arena quests.
          </p>
        </div>

        {/* Search Bar + Mode Toggle */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search solo challenges..."
              className="w-full game-input-inset rounded-full pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-white/40 font-['Outfit']"
            />
          </div>

          <div className="p-1 flex items-center gap-1 bg-[#0F1117] border border-white/10 rounded-full shrink-0">
            <button
              className="px-3.5 py-1.5 rounded-full btn-blue-agent-pill text-xs font-['Outfit'] font-bold cursor-default"
            >
              Solo
            </button>
            <button
              onClick={onSwitchToTeam}
              className="px-3.5 py-1.5 rounded-full text-xs font-['Outfit'] font-bold text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Team
            </button>
          </div>

          <button
            onClick={onOpenModeModal}
            title="Change event track"
            className="w-9 h-9 rounded-full bg-[#151821] border border-white/15 text-white flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer shrink-0"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-['Outfit'] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'bg-white text-black font-extrabold shadow-md'
                : 'bg-[#10121A] text-white/50 hover:text-white border border-white/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 3. SECTION 1: FEATURED SOLO CHALLENGES (POSTER CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
            Featured Solo Arenas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {soloEvents.slice(0, 4).map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="game-poster-card flex flex-col justify-between h-[360px] cursor-pointer group"
            >
              {/* Poster Cover Image */}
              <div className="absolute inset-0 z-0">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover opacity-75 group-hover:scale-105 group-hover:opacity-90 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/60 to-black/20" />
              </div>

              {/* Top Tag Badges */}
              <div className="relative z-10 p-4 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[10px] font-['Outfit'] font-bold text-white uppercase tracking-wider">
                  {ev.stageLabel}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-600/80 backdrop-blur-md text-white text-[10px] font-['Outfit'] font-bold flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Solo</span>
                </span>
              </div>

              {/* Bottom Card Content with White Progress Bar */}
              <div className="relative z-10 p-4 space-y-2.5">
                <div>
                  <h3 className="font-['Outfit'] font-black text-lg text-white leading-tight drop-shadow-md group-hover:text-[#38BDF8] transition-colors">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-white/70 line-clamp-1 mt-0.5 font-normal">
                    {ev.highlightText || ev.description}
                  </p>
                </div>

                {/* Signature White Progress Bar */}
                <div className="w-full white-progress-bar" />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-['Outfit'] font-bold text-white/80">
                    {ev.fee === 0 ? 'FREE ENTRY' : `₹${ev.fee} ENTRY`}
                  </span>
                  <span className="text-xs font-['Outfit'] font-black text-[#38BDF8]">
                    {ev.prize}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. SECTION 2: ALL SOLO CHALLENGES */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
            All Solo Challenges ({filteredEvents.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredEvents.map((ev) => (
            <div
              key={ev.id}
              onClick={() => onSelectEvent(ev)}
              className="game-poster-card flex flex-col justify-between h-[340px] cursor-pointer group"
            >
              {/* Poster Artwork */}
              <div className="absolute inset-0 z-0">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 group-hover:opacity-85 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/70 to-black/30" />
              </div>

              {/* Top Badges */}
              <div className="relative z-10 p-3.5 flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-['Outfit'] font-bold text-white uppercase">
                  {ev.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-['Outfit'] font-bold">
                  1 Seat
                </span>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-10 p-4 space-y-2">
                <div>
                  <h3 className="font-['Outfit'] font-black text-base text-white leading-snug group-hover:text-[#38BDF8] transition-colors">
                    {ev.title}
                  </h3>
                  <span className="text-[11px] font-['Outfit'] text-white/50 block mt-0.5">
                    Prize: {ev.prize}
                  </span>
                </div>

                {/* White Progress Bar */}
                <div className="w-16 white-progress-bar" />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-['Outfit'] font-extrabold text-white">
                    {ev.fee === 0 ? 'FREE' : `₹${ev.fee}`}
                  </span>

                  <button
                    type="button"
                    className="btn-white-action px-3 py-1 rounded-full text-[11px] font-extrabold flex items-center gap-1"
                  >
                    <span>Register</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-16 game-canvas-black rounded-3xl p-8">
            <p className="text-white/50 text-sm font-['Outfit']">
              No solo challenges match your filter.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
