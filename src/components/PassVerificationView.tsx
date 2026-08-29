import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Building, 
  Check, 
  Eye, 
  Clock 
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

  // Sync and lookup when initialPassId changes
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
      {/* Search Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Official Pass Verification Desk</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white font-['Montserrat'] tracking-tight">
          Verify Srishti 2.7 Entry Passes
        </h1>
        <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
          Scan a QR code or enter the 6-digit Pass ID (e.g. <span className="font-mono text-sky-400">SR27-992233</span>) to validate authenticity and manage attendee check-in.
        </p>
      </div>

      {/* Pass Search Bar */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto mb-10">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-gray-400 absolute left-4" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
            placeholder="Enter Pass ID (e.g. SR27-482910)"
            className="w-full bg-[#0d1015] border border-white/15 rounded-2xl pl-12 pr-28 py-3.5 text-white font-mono text-sm tracking-wider focus:outline-none focus:border-blue-500 shadow-xl"
          />
          <button
            type="submit"
            className="absolute right-2 px-4 py-2 bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white font-semibold text-xs rounded-xl shadow-md hover:scale-105 transition-all cursor-pointer"
          >
            Verify
          </button>
        </div>
      </form>

      {/* Verification Result */}
      {searched && (
        <div className="max-w-2xl mx-auto">
          {activeRecord ? (
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/30 relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold tracking-widest block">
                      VERIFIED AUTHENTIC ENTRY PASS
                    </span>
                    <h2 className="text-xl font-bold text-white">{activeRecord.fullName}</h2>
                    <span className="text-xs text-gray-400 font-mono">{activeRecord.passId}</span>
                  </div>
                </div>

                {/* Check In Status Badge & Toggle */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleCheckIn}
                    className={`px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all flex items-center gap-2 cursor-pointer ${
                      activeRecord.checkInStatus === 'Checked In'
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                        : 'bg-white/10 hover:bg-white/15 text-gray-300 border border-white/10'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{activeRecord.checkInStatus === 'Checked In' ? 'Checked In ✓' : 'Mark Checked In'}</span>
                  </button>
                </div>
              </div>

              {/* Detail fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Building className="w-3 h-3 text-sky-400" /> Institution
                  </span>
                  <p className="text-sm font-semibold text-white truncate">{activeRecord.college}</p>
                  <p className="text-xs text-gray-400">{activeRecord.department} • {activeRecord.year}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <Clock className="w-3 h-3 text-sky-400" /> Issued Timestamp
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {new Date(activeRecord.registeredAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-emerald-400 font-mono">Checksum: {activeRecord.securityHash}</p>
                </div>
              </div>

              {/* Events Registered */}
              <div className="mb-6">
                <span className="text-xs font-semibold text-gray-300 block mb-2">
                  Eligible Events ({activeRecord.selectedEventNames.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeRecord.selectedEventNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-300 text-xs font-medium"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Full E-Pass Action */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setShowFullPassModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Full Digital Badge</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-3xl p-8 border border-red-500/30 text-center">
              <XCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
              <h2 className="text-xl font-bold text-white">Pass Not Found or Invalid</h2>
              <p className="text-sm text-gray-400 mt-1 max-w-sm mx-auto">
                No active registration record matches the provided Pass ID. Please check the code or contact the help desk.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Modal for full pass badge */}
      {showFullPassModal && activeRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
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
