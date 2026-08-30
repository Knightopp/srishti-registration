import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  Calendar, 
  MapPin, 
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

  const featuredEvent = teamEvents[0];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Monochromatic Canvas Container */}
      <div className="mono-canvas rounded-[36px] p-6 sm:p-8 shadow-2xl space-y-7">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[11px] font-['Outfit'] font-bold text-white/50 uppercase tracking-widest">
                SRISHTI 2.7 • SQUAD ARENAS
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-white/40 text-xs font-['Outfit']">
                {teamEvents.length} Competitions
              </span>
            </div>

            <h1 className="headline-display text-3xl sm:text-4xl text-white tracking-tight">
              Team Events
            </h1>
          </div>

          {/* Mode Switcher Capsule */}
          <div className="flex items-center gap-2">
            <div className="p-1 flex items-center gap-1 bg-[#0A0D13] border border-white/10 rounded-full">
              <button
                onClick={onSwitchToSolo}
                className="px-3.5 py-1.5 rounded-full text-xs font-['Outfit'] font-bold text-white/50 hover:text-white transition-colors cursor-pointer"
              >
                Solo
              </button>
              <button
                className="px-3.5 py-1.5 rounded-full mono-active-tab text-xs font-['Outfit'] font-bold cursor-default"
              >
                Team
              </button>
            </div>

            <button
              onClick={onOpenModeModal}
              title="Change event type"
              className="mono-icon-btn w-9 h-9"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* FEATURED ARENA HERO CARD */}
        {featuredEvent && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider">
                Featured Arena
              </span>
              <span className="text-[11px] text-emerald-400 font-['Outfit'] font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Squad Battle
              </span>
            </div>

            <div
              onClick={() => onSelectEvent(featuredEvent)}
              className="mono-card-elevated cursor-pointer group relative overflow-hidden"
            >
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-[#10141D] p-6 flex flex-col justify-between">
                <img
                  src={featuredEvent.image}
                  alt={featuredEvent.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#151A25] via-transparent to-black/40" />

                {/* Badges on Banner */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-[#0A0D13]/80 border border-white/15 text-[10px] font-['Outfit'] font-bold text-white uppercase tracking-wider">
                    {featuredEvent.stageLabel}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#0A0D13]/80 border border-white/15 text-[10px] font-['Outfit'] font-bold text-white flex items-center gap-1.5">
                    <Users className="w-3 h-3 text-[#38BDF8]" />
                    <span>{featuredEvent.teamSize}</span>
                  </span>
                </div>

                {/* Title */}
                <div className="relative z-10">
                  <h3 className="font-['Outfit'] font-black text-2xl sm:text-3xl text-white tracking-tight">
                    {featuredEvent.title}
                  </h3>
                  <p className="text-xs text-white/70 mt-1 max-w-lg line-clamp-1">
                    {featuredEvent.highlightText || featuredEvent.description}
                  </p>
                </div>
              </div>

              {/* Shelf */}
              <div className="mono-card-shelf px-6 py-4 flex items-center justify-between">
                <div>
                  <span className="font-['Outfit'] font-extrabold text-sm text-white block">
                    {featuredEvent.title}
                  </span>
                  <span className="text-[11px] font-['Outfit'] text-white/50 uppercase font-semibold">
                    {featuredEvent.category} • ₹{featuredEvent.fee} SQUAD FEE • PRIZE: {featuredEvent.prize}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-mono-accent px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <span>Register</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ALL SQUAD ARENAS LIST */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <span className="text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider">
              All Squad Arenas ({filteredEvents.length})
            </span>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search arenas..."
                className="w-full mono-input-inset rounded-full pl-9 pr-3.5 py-1.5 text-xs text-white placeholder:text-white/40 font-['Outfit']"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-[11px] font-['Outfit'] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'mono-active-tab'
                    : 'bg-[#151922] text-white/50 hover:text-white border border-white/[0.06]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* List Item Rows (Monochromatic Pro Rows) */}
          <div className="space-y-2.5">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="mono-card-surface p-3.5 sm:p-4 flex items-center justify-between gap-4 cursor-pointer group"
              >
                {/* Thumbnail */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#0A0D13] shrink-0 border border-white/10">
                    <img
                      src={ev.image}
                      alt={ev.title}
                      className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Title & Subtitle */}
                  <div className="min-w-0">
                    <h3 className="font-['Outfit'] font-extrabold text-sm sm:text-base text-white group-hover:text-emerald-400 transition-colors truncate">
                      {ev.title}
                    </h3>
                    <p className="font-['Outfit'] text-xs text-white/45 truncate mt-0.5">
                      {ev.category} • {ev.teamSize} • Prize: {ev.prize}
                    </p>
                  </div>
                </div>

                {/* Right: Fee Pill & Action */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-[#0A0D13] text-white/90 font-['Outfit'] font-bold text-xs border border-white/10">
                    {ev.fee === 0 ? 'FREE' : `₹${ev.fee}`}
                  </span>

                  <div className="mono-icon-btn w-8 h-8 group-hover:bg-[#2A3346]">
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/70" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12 mono-card-surface p-6">
              <p className="text-white/50 text-xs font-['Outfit']">
                No squad events match your search.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
