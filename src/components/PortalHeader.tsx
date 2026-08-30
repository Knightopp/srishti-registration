import React from 'react';
import { ArrowUpRight, Compass, ShieldCheck, Search, Sparkles } from 'lucide-react';
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
    <header className="sticky top-3 z-50 w-full px-4 sm:px-6 flex justify-center pointer-events-none mb-6">
      {/* 70% Black / 20% White / 10% Blue Header Bar */}
      <div className="game-top-bar pointer-events-auto px-4 py-2.5 flex items-center justify-between gap-4 max-w-5xl w-full">
        
        {/* Left: Brand + Navigation Links */}
        <div className="flex items-center gap-6">
          <div 
            className="flex items-center gap-2.5 cursor-pointer select-none group" 
            onClick={() => onSelectTab('register')}
            title="Srishti 2.7 Portal"
          >
            <div className="w-8 h-8 rounded-xl p-1 bg-[#10121A] border border-white/15 flex items-center justify-center shrink-0 group-hover:border-blue-500 transition-colors">
              <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
            </div>
            <span className="font-['Outfit'] font-black text-lg tracking-tight text-white block leading-none">
              srishti <span className="text-[#38BDF8] font-bold">2.7</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1 font-['Outfit'] text-xs font-bold">
            <button
              onClick={() => onSelectTab('register')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                currentTab === 'register' ? 'text-white bg-[#1A1D27]' : 'text-white/50 hover:text-white'
              }`}
            >
              Arenas & Passes
            </button>
            <button
              onClick={() => onSelectTab('verify')}
              className={`px-3 py-1.5 rounded-full transition-colors cursor-pointer ${
                currentTab === 'verify' ? 'text-white bg-[#1A1D27]' : 'text-white/50 hover:text-white'
              }`}
            >
              Verify Desk
            </button>
          </nav>
        </div>

        {/* Right: Srishti Blue Pill (matching the `>_ Agent` pill in the screenshot) */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReturnToMainSite}
            className="btn-blue-agent-pill px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 leading-none"
          >
            <span className="font-mono text-white/80">&gt;_</span>
            <span>Fest Site</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </header>
  );
};
