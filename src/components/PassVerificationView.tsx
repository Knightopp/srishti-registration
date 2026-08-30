import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Eye,
  Users
} from 'lucide-react';
import { useRegistration } from '../context/RegistrationContext';
import { RegistrationRecord } from '../types/registration';
import { DigitalPassView } from './DigitalPassView';

interface PassVerificationViewProps {
  initialPassId?: string;
}

export const PassVerificationView: React.FC<PassVerificationViewProps> = ({ initialPassId }) => {
  const { getRegistrationByPassId, updateRegistrationStatus, syncWithCloud } = useRegistration();
  const [searchInput, setSearchInput] = useState(initialPassId || '');
  const [activeRecord, setActiveRecord] = useState<RegistrationRecord | null>(null);
  const [searched, setSearched] = useState(false);
  const [showFullPassModal, setShowFullPassModal] = useState(false);

  useEffect(() => {
    if (initialPassId) {
      setSearchInput(initialPassId);
      const found = getRegistrationByPassId(initialPassId);
      if (found) {
        setActiveRecord(found);
        setSearched(true);
      } else {
        syncWithCloud().then(() => {
          const cloudFound = getRegistrationByPassId(initialPassId);
          setActiveRecord(cloudFound || null);
          setSearched(true);
        });
      }
    }
  }, [initialPassId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    const found = getRegistrationByPassId(searchInput.trim());
    setActiveRecord(found || null);
    setSearched(true);
  };

  const handleToggleCheckIn = () => {
    if (!activeRecord) return;
    const newStatus = activeRecord.checkInStatus === 'Checked In' ? 'Not Checked In' : 'Checked In';
    updateRegistrationStatus(activeRecord.id, activeRecord.paymentStatus, newStatus);
    setActiveRecord({
      ...activeRecord,
      checkInStatus: newStatus,
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      
      {/* Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#0B1530] border border-blue-500/30 text-[#93C5FD] text-xs font-['Outfit'] font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
          <span className="tracking-wider uppercase text-[11px]">CAMPUS VERIFICATION DESK // SRISHTI 2.7</span>
        </span>
        <h1 className="headline-display text-3xl sm:text-4xl text-white">
          Verify Entry Passes.
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-2 max-w-md mx-auto font-normal">
          Enter the attendee Pass ID (e.g. <span className="font-['IBM_Plex_Mono'] text-[#38BDF8] font-bold">SR27-992233</span>) to validate authenticity and mark gate entry.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-white/40 absolute left-4" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
            placeholder="SR27-XXXXXX"
            className="w-full bg-[#081126]/90 border border-white/15 rounded-full pl-12 pr-28 py-3.5 text-white font-['IBM_Plex_Mono'] text-sm tracking-wider focus:outline-none focus:border-[#38BDF8] transition-colors"
          />
          <button
            type="submit"
            className="btn-fluid-blue absolute right-1.5 px-5 py-2 font-['Outfit'] font-bold text-xs uppercase tracking-wider rounded-full cursor-pointer"
          >
            Verify
          </button>
        </div>
      </form>

      {/* Verification Card */}
      {searched && (
        <div className="max-w-2xl mx-auto">
          {activeRecord ? (
            <div className="dark-blue-glass-glow rounded-[32px] p-6 sm:p-8 border border-white/20 relative overflow-hidden shadow-2xl">
              
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/12">
                <div className="flex items-center gap-3.5">
                  <div className="icon-glass-circle shrink-0 bg-blue-500/20 border-blue-400/30">
                    <CheckCircle2 className="w-6 h-6 text-[#38BDF8]" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#93C5FD] uppercase font-bold tracking-wider block font-['Outfit']">
                      VERIFIED AUTHENTIC ENTRY PASS
                    </span>
                    <h2 className="font-['Outfit'] font-black text-2xl text-white">{activeRecord.fullName}</h2>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-white/60">{activeRecord.passId}</span>
                  </div>
                </div>

                <button
                  onClick={handleToggleCheckIn}
                  className={`px-5 py-2.5 rounded-full font-['Outfit'] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeRecord.checkInStatus === 'Checked In'
                      ? 'btn-glass-white'
                      : 'bg-[#0B1530] text-white/80 border border-white/15 hover:text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{activeRecord.checkInStatus === 'Checked In' ? 'Checked In ✓' : 'Mark Entry'}</span>
                </button>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs font-['Outfit']">
                <div className="p-4 rounded-2xl bg-[#050C1F]/80 border border-white/10 space-y-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block font-bold">
                    {activeRecord.isTeamRegistration || activeRecord.teamName ? 'TEAM & INSTITUTION' : 'INSTITUTION'}
                  </span>
                  <p className="font-bold text-white text-sm truncate">{activeRecord.college}</p>
                  <p className="text-white/60">
                    {activeRecord.teamName ? `Team: ${activeRecord.teamName} • ` : ''}
                    {activeRecord.department} • {activeRecord.year}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#050C1F]/80 border border-white/10 space-y-1">
                  <span className="text-[10px] text-white/40 uppercase tracking-wider block font-bold">REGISTRATION TIMESTAMP</span>
                  <p className="font-['IBM_Plex_Mono'] text-xs text-white">{new Date(activeRecord.registeredAt).toLocaleString()}</p>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#93C5FD]">Hash: {activeRecord.securityHash}</p>
                </div>
              </div>

              {/* Team Members Roster */}
              {activeRecord.teammates && activeRecord.teammates.length > 0 && (
                <div className="mb-6 p-4 rounded-2xl bg-[#050C1F]/80 border border-white/10">
                  <span className="font-['Outfit'] text-[11px] text-[#93C5FD] uppercase tracking-wider block mb-2.5 font-bold flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#38BDF8]" />
                    <span>TEAM ROSTER ({activeRecord.teammates.length + 1} MEMBERS)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-['Outfit']">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      <span>{activeRecord.fullName} <span className="text-white/40 text-[10px]">(Leader)</span></span>
                    </div>
                    {activeRecord.teammates.map((tm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/80 font-medium">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-[10px] font-bold">{idx + 2}</span>
                        <span>{tm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Events Registered */}
              <div className="mb-6">
                <span className="text-[10px] text-white/40 uppercase tracking-wider block mb-2 font-bold font-['Outfit']">
                  REGISTERED CHALLENGES ({activeRecord.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.selectedEventNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#93C5FD] text-xs font-semibold font-['Outfit']"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Full Pass Modal Trigger */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowFullPassModal(true)}
                  className="btn-glass-white flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Full Badge</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="dark-blue-glass rounded-[32px] p-8 border border-red-500/30 text-center">
              <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <h2 className="font-['Outfit'] font-black text-lg text-white">Pass Not Found</h2>
              <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto font-['Outfit']">
                No active registration matches the Pass ID. Please check the code or contact the desk.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal for full pass badge */}
      {showFullPassModal && activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFullPassModal(false)}
              className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              ✕
            </button>
            <DigitalPassView record={activeRecord} />
          </div>
        </div>
      )}

    </div>
  );
};
