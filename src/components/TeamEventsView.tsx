import React, { useState } from 'react';
import { 
  Users, 
  Trophy, 
  Calendar, 
  MapPin, 
  ArrowUpRight, 
  Search,
  Layers
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

  // Filter only team events
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
    <div className="w-full max-w-6xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Top Banner & Mode Switcher Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-[#93C5FD] text-xs font-['Outfit'] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
              <span className="tracking-wider uppercase text-[11px]">TEAM EVENTS</span>
            </span>
            <span className="text-white/40 text-xs font-['Outfit']">
              {teamEvents.length} Competitions
            </span>
          </div>

          <h1 className="headline-display text-3xl sm:text-4xl text-white">
            Team & Squad<br />
            <span className="text-[#38BDF8]">Competitions.</span>
          </h1>
          <p className="text-xs sm:text-sm text-white/50 mt-1.5 font-normal max-w-xl">
            Assemble your team with all members' details to generate your official squad pass.
          </p>
        </div>

        {/* Mode Switcher Pill (Timeframe Pill Style from Reference) */}
        <div className="flex items-center gap-3 self-start md:self-end">
          <div className="timeframe-pill-container flex items-center gap-1">
            <button
              onClick={onSwitchToSolo}
              className="px-4 py-1.5 rounded-full text-xs font-['Outfit'] font-bold text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              Solo Events
            </button>
            <button
              className="px-4 py-1.5 rounded-full bg-[#2563EB] text-white text-xs font-['Outfit'] font-bold shadow-md cursor-default"
            >
              Team Events
            </button>
          </div>

          <button
            onClick={onOpenModeModal}
            title="Change event type"
            className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search team events..."
            className="w-full bg-[#080D18] border border-white/12 rounded-full pl-11 pr-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[#38BDF8] font-['Outfit'] transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[11px] font-['Outfit'] font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/[0.05] text-white/60 hover:text-white border border-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Team Events Grid with Fintech Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((ev, index) => {
          // Alternate gradient layers matching the middle screen from the reference image!
          const cardClass = index % 3 === 0 ? 'card-layer-1' : index % 3 === 1 ? 'card-layer-2' : 'card-layer-3';

          return (
            <div
              key={ev.id}
              className={`${cardClass} group relative flex flex-col justify-between rounded-[28px] overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:border-[#60A5FA]/60`}
            >
              {/* Media Banner with Gradient Overlay */}
              <div className="relative h-44 w-full overflow-hidden bg-black/50">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-transparent to-black/40" />

                {/* Badges on Banner */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-['Outfit'] font-bold text-[#60A5FA] uppercase tracking-wider">
                    {ev.stageLabel}
                  </span>

                  <span className="pill-growth-badge px-3 py-1 text-[10px] flex items-center gap-1 shadow-sm">
                    <Users className="w-3 h-3" />
                    <span>{ev.teamSize || 'Team Event'}</span>
                  </span>
                </div>

                {/* Prize Pool Pill */}
                <div className="absolute bottom-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-bold font-['Outfit']">
                  <Trophy className="w-3.5 h-3.5 text-amber-300" />
                  <span>{ev.prize}</span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-['Outfit'] font-black text-xl text-white group-hover:text-[#60A5FA] transition-colors line-clamp-1">
                    {ev.title}
                  </h3>

                  <p className="text-xs text-white/60 mt-2 line-clamp-2 font-normal leading-relaxed">
                    {ev.description}
                  </p>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] font-['Outfit'] font-medium text-white/50">
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
                        className="px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[10px] font-['Outfit'] text-white/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Row with Price Pill and Electric Button */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-['Outfit'] text-white/40 uppercase tracking-widest block font-semibold">
                      SQUAD FEE
                    </span>
                    <span className="font-['Outfit'] font-black text-lg text-white">
                      {ev.fee === 0 ? 'FREE' : `₹${ev.fee}`}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectEvent(ev)}
                    className="btn-electric-blue px-4 py-2 rounded-full font-['Outfit'] font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Register Team</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-16 card-layer-1 rounded-3xl p-8">
          <p className="text-white/50 text-sm font-['Outfit']">
            No team events found matching your search.
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
