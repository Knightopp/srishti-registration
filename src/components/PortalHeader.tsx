import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import srishtiLogo from '../assets/images/srishti-logo.png';
import { useRegistration } from '../context/RegistrationContext';

interface PortalHeaderProps {
  currentTab: 'register' | 'verify';
  onSelectTab: (tab: 'register' | 'verify') => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ currentTab, onSelectTab }) => {
  const { settings } = useRegistration();

  const handleReturnToMainSite = () => {
    window.location.href = settings.mainSiteUrl || 'https://srishti-2-7.vercel.app';
  };

  return (
    <header className="sticky top-4 z-50 w-full px-4 flex justify-center pointer-events-none mb-6">
      <div className="glass-nav-pill pointer-events-auto rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4 sm:gap-8 max-w-4xl w-full">
        
        {/* Brand Identity: Logo + srishti 2.7 */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer select-none" 
          onClick={() => onSelectTab('register')}
        >
          <div className="w-7 h-7 rounded-lg p-1 bg-white/5 border border-white/10 flex items-center justify-center">
            <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
          </div>
          <span className="font-['Montserrat'] font-black text-sm sm:text-base tracking-tight text-white">
            srishti<span className="text-[#38BDF8] ml-1 font-['IBM_Plex_Mono']">2.7</span>
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-4 sm:gap-6 text-xs font-['Montserrat'] font-bold tracking-wider uppercase">
          <button
            onClick={() => onSelectTab('register')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'register' ? 'text-[#38BDF8]' : 'text-white/60 hover:text-white'
            }`}
          >
            Passes
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`transition-colors cursor-pointer ${
              currentTab === 'verify' ? 'text-[#38BDF8]' : 'text-white/60 hover:text-white'
            }`}
          >
            Verify Pass
          </button>
        </nav>

        {/* Fest Website Button */}
        <button
          onClick={handleReturnToMainSite}
          className="px-4 py-1.5 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] text-[11px] sm:text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5 cursor-pointer leading-none whitespace-nowrap"
        >
          <span>Fest Site</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

      </div>
    </header>
  );
};
