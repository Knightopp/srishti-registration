import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import srishtiLogo from '../assets/images/srishti-logo.png';
import { useRegistration } from '../context/RegistrationContext';

interface PortalHeaderProps {
  currentTab: 'register' | 'verify';
  onSelectTab: (tab: 'register' | 'verify') => void;
  eventMode?: 'solo' | 'team';
  onOpenModeModal?: () => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ 
  currentTab, 
  onSelectTab,
  eventMode,
  onOpenModeModal
}) => {
  const { settings } = useRegistration();

  const handleReturnToMainSite = () => {
    window.location.href = settings.mainSiteUrl || 'https://srishti-2-7.vercel.app';
  };

  return (
    <header className="sticky top-3.5 z-50 w-full px-3 flex justify-center pointer-events-none mb-5">
      {/* Short, compact, perfectly-proportioned floating pill */}
      <div className="glass-nav-pill pointer-events-auto rounded-full px-3 sm:px-4 py-1.5 flex items-center justify-between gap-3 sm:gap-5 max-w-lg w-auto shadow-2xl border border-white/15">
        
        {/* Brand Identity: Logo + srishti 2.7 */}
        <div 
          className="flex items-center gap-2 cursor-pointer select-none" 
          onClick={() => onSelectTab('register')}
          title="Srishti 2.7 Portal"
        >
          <div className="w-6 h-6 rounded-lg p-0.5 bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
          </div>
          <span className="font-['Montserrat'] font-black text-xs sm:text-sm tracking-tight text-white whitespace-nowrap">
            srishti<span className="text-[#38BDF8] ml-0.5 font-['IBM_Plex_Mono']">2.7</span>
          </span>
        </div>

        {/* Navigation Tabs & Active Mode */}
        <nav className="flex items-center gap-3 sm:gap-4 text-[11px] font-['Montserrat'] font-bold tracking-wider uppercase">
          <button
            onClick={() => onSelectTab('register')}
            className={`transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'register' ? 'text-[#38BDF8]' : 'text-white/60 hover:text-white'
            }`}
          >
            Passes
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`transition-colors cursor-pointer whitespace-nowrap ${
              currentTab === 'verify' ? 'text-[#38BDF8]' : 'text-white/60 hover:text-white'
            }`}
          >
            Verify
          </button>
        </nav>

        {/* Fest Website Button */}
        <button
          onClick={handleReturnToMainSite}
          className="px-3 py-1.5 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] text-[10px] sm:text-[11px] font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer leading-none whitespace-nowrap"
        >
          <span>Fest Site</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>

      </div>
    </header>
  );
};
