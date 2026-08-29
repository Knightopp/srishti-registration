import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Check, 
  Eye 
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
        <span className="font-['IBM_Plex_Mono'] text-xs text-[#38BDF8] tracking-widest uppercase font-semibold block mb-2">
          CAMPUS VERIFICATION DESK // SRISHTI 2.7
        </span>
        <h1 className="font-['Montserrat'] font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
          Verify Entry Passes
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-md mx-auto font-light">
          Enter the attendee Pass ID (e.g. <span className="font-['IBM_Plex_Mono'] text-[#38BDF8]">SR27-992233</span>) to validate authenticity and mark gate entry.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-white/40 absolute left-4" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
            placeholder="SR27-XXXXXX"
            className="w-full bg-[#080A0E] border border-white/[0.12] rounded-full pl-11 pr-24 py-3 text-white font-['IBM_Plex_Mono'] text-sm tracking-wider focus:outline-none focus:border-[#38BDF8]"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-1.5 bg-gradient-27-glow text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider rounded-full transition-all cursor-pointer"
          >
            Verify
          </button>
        </div>
      </form>

      {/* Verification Card */}
      {searched && (
        <div className="max-w-2xl mx-auto">
          {activeRecord ? (
            <div className="bg-[#080A0E] rounded-3xl p-6 sm:p-8 border border-[#38BDF8]/40 relative overflow-hidden shadow-2xl glow-cyan-card">
              
              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-[#38BDF8] border border-cyan-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#38BDF8] uppercase font-bold tracking-wider block">
                      VERIFIED AUTHENTIC ENTRY PASS
                    </span>
                    <h2 className="font-['Montserrat'] font-bold text-xl text-white">{activeRecord.fullName}</h2>
                    <span className="font-['IBM_Plex_Mono'] text-xs text-white/50">{activeRecord.passId}</span>
                  </div>
                </div>

                <button
                  onClick={handleToggleCheckIn}
                  className={`px-4 py-2 rounded-full font-['IBM_Plex_Mono'] text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeRecord.checkInStatus === 'Checked In'
                      ? 'bg-gradient-27-glow text-white'
                      : 'bg-white/5 text-white/60 border border-white/10 hover:text-white'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{activeRecord.checkInStatus === 'Checked In' ? 'Checked In ✓' : 'Mark Entry'}</span>
                </button>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 text-xs">
                <div className="p-3.5 rounded-2xl bg-[#0D1015] border border-white/[0.06] space-y-1">
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block">INSTITUTION</span>
                  <p className="font-semibold text-white truncate">{activeRecord.college}</p>
                  <p className="text-white/50">{activeRecord.department} • {activeRecord.year}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#0D1015] border border-white/[0.06] space-y-1">
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block">REGISTRATION TIMESTAMP</span>
                  <p className="font-['IBM_Plex_Mono'] text-xs text-white">{new Date(activeRecord.registeredAt).toLocaleString()}</p>
                  <p className="font-['IBM_Plex_Mono'] text-[11px] text-[#38BDF8]">Hash: {activeRecord.securityHash}</p>
                </div>
              </div>

              {/* Events Registered */}
              <div className="mb-6">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block mb-2">
                  CLAIMED EVENTS ({activeRecord.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.selectedEventNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-200 text-xs font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Full Pass Modal Trigger */}
              <div className="pt-4 border-t border-white/[0.08] flex justify-end">
                <button
                  onClick={() => setShowFullPassModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-white/70 hover:text-white font-['Montserrat'] text-xs font-bold uppercase tracking-wider border border-white/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Badge</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#080A0E] rounded-3xl p-8 border border-red-500/30 text-center">
              <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <h2 className="font-['Montserrat'] font-bold text-lg text-white">Pass Not Found</h2>
              <p className="text-xs text-white/50 mt-1 max-w-xs mx-auto">
                No active registration matches the Pass ID. Please check the code or contact the desk.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal for full pass badge */}
      {showFullPassModal && activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowFullPassModal(false)}
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
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
