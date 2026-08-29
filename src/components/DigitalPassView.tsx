import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Check, 
  ShieldCheck, 
  ArrowLeft 
} from 'lucide-react';
import html2canvas from 'html2canvas';
import confetti from 'canvas-confetti';
import { RegistrationRecord } from '../types/registration';
import { CustomSrishtiQR } from './CustomSrishtiQR';
import srishtiLogo from '../assets/images/srishti-logo.png';

interface DigitalPassViewProps {
  record: RegistrationRecord;
  onNewRegistration?: () => void;
}

export const DigitalPassView: React.FC<DigitalPassViewProps> = ({
  record,
  onNewRegistration,
}) => {
  const passCardRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F3EFE6', '#10B981', '#161922'],
      });
    } catch {}
  }, []);

  const verificationUrl = `${window.location.origin}?pass=${record.passId}`;

  const handleDownloadImage = async () => {
    if (!passCardRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      const canvas = await html2canvas(passCardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#0D0F14',
        logging: false,
      });
      const link = document.createElement('a');
      link.download = `SRISHTI_2.7_PASS_${record.passId}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export pass image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8">
      
      {/* Confirmed Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-ledger text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PASS ISSUED & CONFIRMED</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-[#F3EFE6] tracking-tight">
          Your Srishti 2.7 Entry Badge
        </h1>
        <p className="font-body text-xs sm:text-sm text-[#8B92A0] mt-2 max-w-md mx-auto">
          Save this pass on your phone or keep your Pass ID handy. Present the QR code at the desk on Dec 4 for badge printing.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 no-print">
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] text-[#0D0F14] font-body font-black text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{isDownloading ? 'Exporting...' : 'Save Pass Image (PNG)'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1D212D] text-[#F3EFE6] font-body font-semibold text-xs border border-[#262B36] transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-[#8B92A0]" />
          <span>Print</span>
        </button>

        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1D212D] text-[#F3EFE6] font-body font-semibold text-xs border border-[#262B36] transition-all cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#10B981]">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-[#8B92A0]" />
              <span>Copy Verification Link</span>
            </>
          )}
        </button>
      </div>

      {/* Physical Ticket / Pass Slip Layout */}
      <div className="flex justify-center">
        <div
          ref={passCardRef}
          id="srishti-pass-card"
          className="w-full max-w-xl bg-[#161922] rounded-2xl border-2 border-[#262B36] shadow-2xl p-6 sm:p-8 relative overflow-hidden text-[#F3EFE6] printable-pass-card"
        >
          {/* Card Top Border Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F59E0B]" />

          {/* Header Row */}
          <div className="flex items-start justify-between border-b border-[#262B36] pb-5 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-lg bg-[#0D0F14] p-1.5 border border-[#262B36] flex items-center justify-center">
                <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-ledger text-[10px] uppercase tracking-widest text-[#F59E0B] block font-bold">
                  OFFICIAL DELEGATE BADGE
                </span>
                <h2 className="font-display font-black text-2xl text-[#F3EFE6] leading-tight">
                  SRISHTI <span className="text-[#F59E0B]">2.7</span>
                </h2>
                <span className="font-ledger text-[11px] text-[#8B92A0]">Dec 4–5, 2026 • St. Thomas College</span>
              </div>
            </div>

            <div className="text-right font-ledger">
              <span className="text-[10px] text-[#565C69] uppercase tracking-wider block">PASS ID</span>
              <span className="text-base sm:text-lg font-black text-[#F59E0B] bg-[#0D0F14] px-3 py-1 rounded border border-[#262B36] inline-block mt-0.5">
                {record.passId}
              </span>
            </div>
          </div>

          {/* Attendee Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
            
            {/* Left 2 Cols: Details */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <span className="font-ledger text-[10px] text-[#565C69] uppercase tracking-wider block">
                  PARTICIPANT NAME
                </span>
                <p className="font-display font-black text-xl text-[#F3EFE6] mt-0.5">{record.fullName}</p>
                <p className="font-ledger text-xs text-[#8B92A0]">{record.email} • {record.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 font-body text-xs">
                <div>
                  <span className="font-ledger text-[10px] text-[#565C69] uppercase tracking-wider block">
                    INSTITUTION
                  </span>
                  <p className="font-bold text-[#F3EFE6] mt-0.5 truncate">{record.college}</p>
                  <p className="text-[#8B92A0]">{record.department} ({record.year})</p>
                </div>

                <div>
                  <span className="font-ledger text-[10px] text-[#565C69] uppercase tracking-wider block">
                    ENTRY STATUS
                  </span>
                  <p className="font-ledger font-bold text-[#10B981] mt-0.5">
                    {record.totalFee === 0 ? 'FREE ACCESS' : `PAID (₹${record.totalFee})`}
                  </p>
                  <p className="text-[#8B92A0]">
                    {record.teamName ? `Team: ${record.teamName}` : 'Individual'}
                  </p>
                </div>
              </div>

              {/* Claimed Events List */}
              <div className="pt-2">
                <span className="font-ledger text-[10px] text-[#565C69] uppercase tracking-wider block mb-1.5">
                  CLAIMED EVENTS ({record.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {record.selectedEventNames.map((name, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded bg-[#0D0F14] border border-[#262B36] font-body text-[11px] font-semibold text-[#F3EFE6]"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Verified Center-Logo QR */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0D0F14] border border-[#262B36]">
              <CustomSrishtiQR value={verificationUrl} size={135} />
              <div className="mt-2 text-center font-ledger">
                <span className="text-[9px] text-[#10B981] uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED ENTRY
                </span>
                <span className="text-[8px] text-[#565C69] block truncate max-w-[125px] mt-0.5">
                  {record.securityHash}
                </span>
              </div>
            </div>

          </div>

          {/* Ticket Perforation Bottom Bar */}
          <div className="pt-4 border-t border-dashed border-[#343B4A] flex items-center justify-between font-ledger text-[11px] text-[#8B92A0]">
            <div>
              <span>Thrissur, Kerala • CS Dept</span>
            </div>
            <div className="text-[10px] text-[#565C69]">
              Issued: {new Date(record.registeredAt).toLocaleDateString()}
            </div>
          </div>

        </div>
      </div>

      {/* Return Action */}
      {onNewRegistration && (
        <div className="text-center mt-8 no-print">
          <button
            onClick={onNewRegistration}
            className="inline-flex items-center gap-2 font-body text-xs font-semibold text-[#8B92A0] hover:text-[#F3EFE6] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Register another participant</span>
          </button>
        </div>
      )}

    </div>
  );
};
