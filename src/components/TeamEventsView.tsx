import React, { useState } from 'react';
import { 
  Users, 
  Search,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';
import { EventItem } from '../types/registration';

interface TeamEventsViewProps {
  onSelectEvent: (event: EventItem) => void;
  onSwitchToSolo: () => void;
  onOpenModeModal: () => void;
}

export const TeamEventsView: React.FC<TeamEventsViewProps> = ({
  onSelectEvent,
  onSwitchToSolo,
  onOpenModeModal,
}) => {
  const { events } = useRegistration();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const teamEvents = events.filter((e) => e.eventType === 'team');
  const categories = ['ALL', 'ADVENTURE', 'INNOVATION', 'ROBOTICS', 'DANCE & ARTS', 'PUZZLES & QUIZ'];

  const filteredEvents = teamEvents.filter((ev) => {
    const matchesSearch = 
      ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ev.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'ADVENTURE') return ev.id === 'treasure-hunt';
    if (selectedCategory === 'INNOVATION') return ev.id === 'ideathon';
    if (selectedCategory === 'ROBOTICS') return ev.id === 'tracebot';
    if (selectedCategory === 'DANCE & ARTS') return ['waltz', 'face-painting'].includes(ev.id);
    if (selectedCategory === 'PUZZLES & QUIZ') return ['mind-game', 'tech-quiz'].includes(ev.id);
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-8">
      
      {/* 1. Header Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="headline-display text-3xl sm:text-4xl text-white tracking-tight">
            Team Competitions
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1 font-['Outfit']">
            Browse and register for squad-based arena challenges.
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
              placeholder="Search competitions..."
              className="w-full game-input-inset rounded-full pl-9 pr-3.5 py-2 text-xs text-white placeholder:text-white/40 font-['Outfit']"
            />
          </div>

          <div className="p-1 flex items-center gap-1 bg-[#0F1117] border border-white/10 rounded-full shrink-0">
            <button
              onClick={onSwitchToSolo}
              className="px-3.5 py-1.5 rounded-full text-xs font-['Outfit'] font-bold text-white/50 hover:text-white transition-colors cursor-pointer"
            >
              Solo
            </button>
            <button
              className="px-3.5 py-1.5 rounded-full btn-blue-agent-pill text-xs font-['Outfit'] font-bold cursor-default"
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

      {/* 3. SECTION 1: FEATURED SQUAD ARENAS (POSTER CARDS) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
            Featured Arenas
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {teamEvents.slice(0, 4).map((ev) => (
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
                  <Users className="w-3.5 h-3.5" />
                  <span>{ev.teamSize}</span>
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

                {/* White Progress Bar */}
                <div className="w-full white-progress-bar" />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-['Outfit'] font-bold text-white/80">
                    {ev.fee === 0 ? 'FREE ENTRY' : `₹${ev.fee} SQUAD FEE`}
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

      {/* 4. SECTION 2: ALL SQUAD ARENAS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-['Outfit'] font-extrabold text-xl text-white tracking-tight">
            All Squad Competitions ({filteredEvents.length})
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
                  {ev.teamSize}
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

                {/* White Progress Bar Signature */}
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
              No squad competitions match your filter.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
