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
        <span className="font-ledger text-xs text-[#F59E0B] tracking-wider uppercase font-semibold block mb-1">
          CAMPUS ENTRY DESK // SRISHTI 2.7
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F3EFE6] tracking-tight">
          Verify Entry Passes
        </h1>
        <p className="font-body text-xs sm:text-sm text-[#8B92A0] mt-2 max-w-md mx-auto">
          Enter the attendee Pass ID (e.g. <span className="font-ledger text-[#F59E0B]">SR27-992233</span>) to confirm registration authenticity and mark gate entry.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto mb-10">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#8B92A0] absolute left-4" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
            placeholder="SR27-XXXXXX"
            className="w-full bg-[#161922] border border-[#262B36] rounded-xl pl-11 pr-24 py-3 text-[#F3EFE6] font-ledger text-sm tracking-wider focus:outline-none focus:border-[#F59E0B]"
          />
          <button
            type="submit"
            className="absolute right-1.5 px-4 py-1.5 bg-[#F59E0B] hover:bg-[#d97706] text-[#0D0F14] font-body font-black text-xs rounded-lg transition-all cursor-pointer"
          >
            Verify
          </button>
        </div>
      </form>

      {/* Verification Card */}
      {searched && (
        <div className="max-w-2xl mx-auto">
          {activeRecord ? (
            <div className="bg-[#161922] rounded-2xl p-6 sm:p-8 border border-[#262B36] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#10B981]" />

              {/* Status Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#262B36]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-ledger text-[10px] text-[#10B981] uppercase font-bold tracking-wider block">
                      AUTHENTIC ENROLLED ENTRY PASS
                    </span>
                    <h2 className="font-display font-black text-xl text-[#F3EFE6]">{activeRecord.fullName}</h2>
                    <span className="font-ledger text-xs text-[#8B92A0]">{activeRecord.passId}</span>
                  </div>
                </div>

                <button
                  onClick={handleToggleCheckIn}
                  className={`px-4 py-2 rounded-xl font-ledger text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    activeRecord.checkInStatus === 'Checked In'
                      ? 'bg-[#10B981] text-[#0D0F14]'
                      : 'bg-[#0D0F14] text-[#8B92A0] border border-[#262B36] hover:text-[#F3EFE6]'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  <span>{activeRecord.checkInStatus === 'Checked In' ? 'Checked In ✓' : 'Mark Entry'}</span>
                </button>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6 font-body text-xs">
                <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-[#262B36] space-y-1">
                  <span className="font-ledger text-[10px] text-[#565C69] uppercase tracking-wider block">INSTITUTION</span>
                  <p className="font-bold text-[#F3EFE6] truncate">{activeRecord.college}</p>
                  <p className="text-[#8B92A0]">{activeRecord.department} • {activeRecord.year}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-[#262B36] space-y-1">
                  <span className="font-ledger text-[10px] text-[#565C69] uppercase tracking-wider block">REGISTERED TIMESTAMP</span>
                  <p className="font-ledger text-xs text-[#F3EFE6]">{new Date(activeRecord.registeredAt).toLocaleString()}</p>
                  <p className="font-ledger text-[11px] text-[#10B981]">Hash: {activeRecord.securityHash}</p>
                </div>
              </div>

              {/* Events Registered */}
              <div className="mb-6">
                <span className="font-ledger text-[10px] text-[#565C69] uppercase tracking-wider block mb-2">
                  CLAIMED EVENTS ({activeRecord.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeRecord.selectedEventNames.map((name, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded bg-[#0D0F14] border border-[#262B36] font-body text-xs font-semibold text-[#F3EFE6]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>

              {/* View Full Pass Modal Trigger */}
              <div className="pt-4 border-t border-[#262B36] flex justify-end">
                <button
                  onClick={() => setShowFullPassModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0D0F14] hover:bg-[#1D212D] text-[#8B92A0] hover:text-[#F3EFE6] font-body text-xs font-semibold border border-[#262B36] transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Printable Badge</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#161922] rounded-2xl p-8 border border-red-900/40 text-center">
              <XCircle className="w-10 h-10 text-red-400 mx-auto mb-2" />
              <h2 className="font-display font-bold text-lg text-[#F3EFE6]">Pass Not Found</h2>
              <p className="font-body text-xs text-[#8B92A0] mt-1 max-w-xs mx-auto">
                No active registration matches the Pass ID. Please check the code or contact the help desk.
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
              className="absolute top-4 right-4 z-50 p-2 rounded-full bg-[#161922] text-[#F3EFE6] hover:bg-[#262B36] transition-colors cursor-pointer"
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
