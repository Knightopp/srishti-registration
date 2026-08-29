import React from 'react';
import { ShieldCheck, ExternalLink, Ticket, CheckCircle2 } from 'lucide-react';
import srishtiLogo from '../assets/images/srishti-logo.png';
import { useRegistration } from '../context/RegistrationContext';

interface PortalHeaderProps {
  currentTab: 'register' | 'verify';
  onSelectTab: (tab: 'register' | 'verify') => void;
}

export const PortalHeader: React.FC<PortalHeaderProps> = ({ currentTab, onSelectTab }) => {
  const { settings } = useRegistration();

  const handleReturnToMainSite = () => {
    window.location.href = settings.mainSiteUrl || 'http://localhost:5173';
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('register')}>
          <div className="relative w-9 h-9 rounded-xl overflow-hidden p-1 bg-white/5 border border-white/10 flex items-center justify-center">
            <img src={srishtiLogo} alt="Srishti Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base font-['Montserrat']">
                SRISHTI <span className="text-[#38BDF8]">2.7</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full">
                Passes & Registration
              </span>
            </div>
            <p className="text-[11px] text-gray-400 font-mono hidden md:block">
              Dedicated Load-Isolated Ticketing Host
            </p>
          </div>
        </div>

        {/* Center: Tabs */}
        <div className="flex items-center gap-1 bg-[#0d1015] p-1 rounded-xl border border-white/10">
          <button
            onClick={() => onSelectTab('register')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'register'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Get Passes</span>
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentTab === 'verify'
                ? 'bg-[#2563EB] text-white shadow-md'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Pass</span>
          </button>
        </div>

        {/* Right: Return to Main Site Button */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Gateway Online</span>
          </div>

          <button
            onClick={handleReturnToMainSite}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <span>Fest Website</span>
            <ExternalLink className="w-3 h-3 text-gray-400" />
          </button>
        </div>

      </div>
    </header>
  );
};
