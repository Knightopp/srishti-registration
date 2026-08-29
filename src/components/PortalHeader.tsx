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
    <header className="sticky top-0 z-50 w-full bg-[#0D0F14]/95 backdrop-blur-md border-b border-[#262B36]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Fest Date Badge */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none" 
          onClick={() => onSelectTab('register')}
        >
          <div className="w-8 h-8 rounded-lg p-1 bg-[#161922] border border-[#262B36] flex items-center justify-center">
            <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-lg tracking-tight text-[#F3EFE6]">
                SRISHTI <span className="text-[#F59E0B]">2.7</span>
              </span>
              <span className="text-[11px] font-ledger text-[#8B92A0] hidden sm:inline">
                // DEC 4–5
              </span>
            </div>
            <p className="text-[10px] text-[#8B92A0] font-ledger hidden md:block">
              St. Thomas College CS Department
            </p>
          </div>
        </div>

        {/* Center Tabs: Minimal, Functional */}
        <div className="flex items-center gap-1 bg-[#161922] p-1 rounded-lg border border-[#262B36]">
          <button
            onClick={() => onSelectTab('register')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
              currentTab === 'register'
                ? 'bg-[#F59E0B] text-[#0D0F14] font-bold'
                : 'text-[#8B92A0] hover:text-[#F3EFE6]'
            }`}
          >
            Pass Ledger
          </button>

          <button
            onClick={() => onSelectTab('verify')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold tracking-wide transition-colors cursor-pointer ${
              currentTab === 'verify'
                ? 'bg-[#F59E0B] text-[#0D0F14] font-bold'
                : 'text-[#8B92A0] hover:text-[#F3EFE6]'
            }`}
          >
            Verify Pass
          </button>
        </div>

        {/* Right: Fest Website Direct Link */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleReturnToMainSite}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#8B92A0] hover:text-[#F3EFE6] bg-[#161922] hover:bg-[#1D212D] border border-[#262B36] rounded-lg transition-colors cursor-pointer"
          >
            <span>Fest Website</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#8B92A0]" />
          </button>
        </div>

      </div>
    </header>
  );
};
