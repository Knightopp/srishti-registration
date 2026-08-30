import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Check, 
  ShieldCheck, 
  ArrowLeft,
  Users
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
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FFFFFF', '#94A3B8', '#10B981', '#38BDF8'],
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
        backgroundColor: '#090B0F',
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
      
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171C26] border border-white/10 text-emerald-400 font-['Outfit'] text-xs font-bold mb-3 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>OFFICIAL ACCESS PASS ISSUED</span>
        </div>
        <h1 className="headline-display text-4xl sm:text-5xl text-white">
          Access Granted.
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1 max-w-md mx-auto font-normal">
          Present this verified badge at the registration gate for rapid campus entry.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 no-print">
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="btn-mono-accent px-6 py-2.5 rounded-full font-['Outfit'] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Exporting...' : 'Download Pass (PNG)'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="btn-mono-primary px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>

        <button
          onClick={handleCopyShareLink}
          className="mono-card-surface px-5 py-2.5 rounded-full text-xs font-['Outfit'] font-bold flex items-center gap-2 text-white/80 hover:text-white"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-white/60" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Monochromatic Pass Card */}
      <div className="flex justify-center">
        <div
          ref={passCardRef}
          id="srishti-pass-card"
          className="w-full max-w-xl mono-card-elevated p-6 sm:p-8 relative overflow-hidden text-white printable-pass-card shadow-2xl border border-white/15"
        >
          {/* Header Row */}
          <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-[#090B0F] p-2 border border-white/15 flex items-center justify-center">
                <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-['Outfit'] text-[10px] uppercase tracking-widest text-emerald-400 block font-bold">
                  SRISHTI 2.7 ACCESS BADGE
                </span>
                <h2 className="font-['Outfit'] font-black text-2xl text-white tracking-tight">
                  SRISHTI <span className="text-white/50">2.7</span>
                </h2>
                <span className="font-['Outfit'] text-xs text-white/50">Dec 4–5, 2026 • St. Thomas College</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-white/40 uppercase tracking-widest block font-['Outfit'] font-bold">PASS ID</span>
              <span className="text-base sm:text-lg font-black text-white bg-[#090B0F] px-3.5 py-1 rounded-full border border-white/15 inline-block mt-0.5 font-['IBM_Plex_Mono']">
                {record.passId}
              </span>
            </div>
          </div>

          {/* Attendee Info Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
            
            {/* Left 2 Cols */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <span className="font-['Outfit'] text-[10px] text-white/40 uppercase tracking-widest block font-bold">
                  {record.isTeamRegistration || record.teamName ? 'TEAM & LEADER' : 'PARTICIPANT NAME'}
                </span>
                <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                  <p className="font-['Outfit'] font-black text-2xl text-white">
                    {record.fullName}
                  </p>
                  {record.teamName && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-['Outfit'] text-xs font-bold border border-emerald-500/30">
                      Team {record.teamName}
                    </span>
                  )}
                </div>
                <p className="font-['Outfit'] text-xs text-white/50 mt-0.5">{record.email} • {record.phone}</p>
              </div>

              {/* Team Roster if team pass */}
              {record.teammates && record.teammates.length > 0 && (
                <div className="p-4 rounded-2xl bg-[#090B0F] border border-white/10">
                  <span className="font-['Outfit'] text-[11px] text-white/70 uppercase tracking-wider block mb-2 font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>TEAM ROSTER ({record.teammates.length + 1} MEMBERS)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-['Outfit']">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      <span className="truncate">{record.fullName} <span className="text-white/40 text-[10px] font-normal">(Lead)</span></span>
                    </div>
                    {record.teammates.map((tm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/70 font-medium truncate">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-white/50 flex items-center justify-center text-[10px] font-bold">{idx + 2}</span>
                        <span className="truncate">{tm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs font-['Outfit']">
                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">
                    INSTITUTION
                  </span>
                  <p className="font-bold text-white mt-0.5 truncate">{record.college}</p>
                  <p className="text-white/50">{record.department} ({record.year})</p>
                </div>

                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">
                    PASS TYPE
                  </span>
                  <p className="font-bold text-white mt-0.5">
                    {record.totalFee === 0 ? 'FREE PASS' : `PAID PASS (₹${record.totalFee})`}
                  </p>
                  <p className="text-white/50">
                    {record.teamName ? `Squad Pass` : 'Individual Pass'}
                  </p>
                </div>
              </div>

              {/* Registered Arenas */}
              <div className="pt-1">
                <span className="font-['Outfit'] text-[10px] text-white/40 uppercase tracking-widest block mb-2 font-bold">
                  REGISTERED ARENAS ({record.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {record.selectedEventNames.map((name, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-full bg-[#090B0F] border border-white/10 text-xs font-semibold text-white/80 font-['Outfit']"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-[#090B0F] border border-white/10">
              <CustomSrishtiQR value={verificationUrl} size={135} />
              <div className="mt-3 text-center font-['Outfit']">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED BADGE
                </span>
                <span className="text-[9px] text-white/40 block truncate max-w-[125px] mt-0.5 font-['IBM_Plex_Mono']">
                  {record.securityHash}
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 pt-4 border-t border-dashed border-white/15 flex items-center justify-between font-['Outfit'] text-xs text-white/50">
            <div>
              <span>Dec 4–5, 2026 • Main Campus</span>
            </div>
            <div className="text-[11px] text-white/40 font-['IBM_Plex_Mono']">
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
            className="inline-flex items-center gap-2 font-['Outfit'] text-xs font-bold uppercase tracking-wider text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Register another attendee / squad</span>
          </button>
        </div>
      )}

    </div>
  );
};
