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
    <header className="sticky top-4 z-50 w-full px-4 flex justify-center pointer-events-none mb-6">
      {/* Sleek, luxury floating capsule */}
      <div className="glass-nav-pill pointer-events-auto rounded-full px-3.5 sm:px-5 py-2 flex items-center justify-between gap-3 sm:gap-6 max-w-lg w-auto shadow-2xl">
        
        {/* Brand Identity: Logo + srishti 2.7 */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group" 
          onClick={() => onSelectTab('register')}
          title="Srishti 2.7 Portal"
        >
          <div className="w-7 h-7 rounded-xl p-1 bg-white/10 border border-white/15 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
          </div>
          <span className="font-['Outfit'] font-black text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
            srishti<span className="text-[#38BDF8] ml-1 font-['Outfit'] font-semibold">2.7</span>
          </span>
        </div>

        {/* Navigation Tabs (Fintech Timeframe Pill Style) */}
        <nav className="flex items-center gap-1 bg-white/[0.06] p-1 rounded-full border border-white/10 text-xs font-['Outfit'] font-bold">
          <button
            onClick={() => onSelectTab('register')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'register' 
                ? 'bg-[#2563EB] text-white shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Passes
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`px-3 py-1 rounded-full transition-all cursor-pointer whitespace-nowrap ${
              currentTab === 'verify' 
                ? 'bg-[#2563EB] text-white shadow-md' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Verify
          </button>
        </nav>

        {/* Fest Website Button (Clean White Action Pill) */}
        <button
          onClick={handleReturnToMainSite}
          className="btn-white-action px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer leading-none whitespace-nowrap"
        >
          <span>Fest Site</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </header>
  );
};
