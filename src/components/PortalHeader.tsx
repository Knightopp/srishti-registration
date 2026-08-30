import React from 'react';
import { ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';
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
      {/* Monochromatic Matte Capsule Navigation Bar */}
      <div className="mono-capsule-bar pointer-events-auto px-3.5 sm:px-4 py-2 flex items-center justify-between gap-3 sm:gap-6 max-w-xl w-full shadow-xl">
        
        {/* Brand: Logo + Srishti 2.7 */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none group" 
          onClick={() => onSelectTab('register')}
          title="Srishti 2.7 Portal"
        >
          <div className="w-7 h-7 rounded-xl p-1 bg-[#1C212E] border border-white/10 flex items-center justify-center shrink-0 group-hover:border-white/25 transition-colors">
            <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
          </div>
          <div>
            <span className="font-['Outfit'] font-extrabold text-sm sm:text-base tracking-tight text-white block leading-none">
              Srishti <span className="text-white/50 font-normal">2.7</span>
            </span>
          </div>
        </div>

        {/* Center Mode Switcher Tabs */}
        <nav className="flex items-center gap-1 p-1 rounded-full bg-[#0B0E14] border border-white/10 text-xs font-['Outfit'] font-semibold">
          <button
            onClick={() => onSelectTab('register')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'register' 
                ? 'mono-active-tab' 
                : 'text-white/50 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Passes</span>
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
              currentTab === 'verify' 
                ? 'mono-active-tab' 
                : 'text-white/50 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify</span>
          </button>
        </nav>

        {/* Fest Website Button */}
        <button
          onClick={handleReturnToMainSite}
          className="btn-mono-primary px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 leading-none shrink-0"
        >
          <span>Fest Site</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </header>
  );
};
