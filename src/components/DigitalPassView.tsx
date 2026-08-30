import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Check, 
  ShieldCheck, 
  ArrowLeft,
  ArrowUpRight
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
        colors: ['#38BDF8', '#2563EB', '#7DD3FC', '#FFFFFF'],
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
        backgroundColor: '#050608',
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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[#38BDF8] font-['IBM_Plex_Mono'] text-xs font-bold mb-3">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>PASS ISSUED & VERIFIED</span>
        </div>
        <h1 className="font-['Montserrat'] font-black text-3xl sm:text-4xl text-white tracking-tight uppercase">
          Official Entry Pass
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-2 max-w-md mx-auto font-light">
          Save this pass on your phone or present the QR code at the registration desk for instant campus access.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 no-print">
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg hover:opacity-90"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Exporting...' : 'Download Pass (PNG)'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white font-['Montserrat'] font-semibold text-xs border border-white/10 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-white/60" />
          <span>Print</span>
        </button>

        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-white font-['Montserrat'] font-semibold text-xs border border-white/10 transition-all cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-[#38BDF8]">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-white/60" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Printable / Capturable Pass Card */}
      <div className="flex justify-center">
        <div
          ref={passCardRef}
          id="srishti-pass-card"
          className="w-full max-w-xl bg-gradient-to-b from-[#0d131f] via-[#080c14] to-[#050608] rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-white printable-pass-card"
        >
          {/* Subtle Atmospheric Light Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header Row */}
          <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 p-1.5 border border-white/15 flex items-center justify-center">
                <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[10px] uppercase tracking-widest text-[#38BDF8] block font-bold">
                  OFFICIAL ACCESS BADGE
                </span>
                <h2 className="font-['Montserrat'] font-black text-2xl text-white tracking-tight">
                  SRISHTI <span className="text-[#38BDF8]">2.7</span>
                </h2>
                <span className="font-['IBM_Plex_Mono'] text-[11px] text-white/50">Dec 4–5, 2026 • St. Thomas College</span>
              </div>
            </div>

            <div className="text-right font-['IBM_Plex_Mono']">
              <span className="text-[10px] text-white/40 uppercase tracking-wider block">PASS ID</span>
              <span className="text-base sm:text-lg font-black text-[#38BDF8] bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/30 inline-block mt-0.5">
                {record.passId}
              </span>
            </div>
          </div>

          {/* Attendee Info Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
            
            {/* Left 2 Cols: Details */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block">
                  {record.isTeamRegistration || record.teamName ? 'TEAM & LEADER' : 'PARTICIPANT NAME'}
                </span>
                <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                  <p className="font-['Montserrat'] font-extrabold text-xl text-white">
                    {record.fullName}
                  </p>
                  {record.teamName && (
                    <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-['IBM_Plex_Mono'] text-xs font-bold border border-blue-400/30">
                      Team {record.teamName}
                    </span>
                  )}
                </div>
                <p className="font-['IBM_Plex_Mono'] text-xs text-white/50">{record.email} • {record.phone}</p>
              </div>

              {/* Team Roster section if team registration */}
              {record.teammates && record.teammates.length > 0 && (
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#38BDF8] uppercase tracking-wider block mb-1.5 font-bold">
                    TEAM MEMBERS ROSTER ({record.teammates.length + 1} MEMBERS)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-white/90 font-medium">
                      <span className="text-[#38BDF8] font-bold font-['IBM_Plex_Mono'] text-[11px]">1.</span>
                      <span className="truncate">{record.fullName} <span className="text-[10px] text-white/40">(Lead)</span></span>
                    </div>
                    {record.teammates.map((tm, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-white/80 font-medium truncate">
                        <span className="text-white/40 font-bold font-['IBM_Plex_Mono'] text-[11px]">{idx + 2}.</span>
                        <span className="truncate">{tm.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block">
                    INSTITUTION
                  </span>
                  <p className="font-semibold text-white mt-0.5 truncate">{record.college}</p>
                  <p className="text-white/50">{record.department} ({record.year})</p>
                </div>

                <div>
                  <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block">
                    PASS TYPE
                  </span>
                  <p className="font-['IBM_Plex_Mono'] font-bold text-[#38BDF8] mt-0.5">
                    {record.totalFee === 0 ? 'FREE PASS' : `PAID PASS (₹${record.totalFee})`}
                  </p>
                  <p className="text-white/50">
                    {record.teamName ? `Squad Pass` : 'Individual Pass'}
                  </p>
                </div>
              </div>

              {/* Claimed Events List */}
              <div className="pt-2">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-wider block mb-1.5">
                  REGISTERED EVENTS ({record.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {record.selectedEventNames.map((name, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-sky-200"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Verified Center-Logo QR */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#080c14] border border-white/10">
              <CustomSrishtiQR value={verificationUrl} size={135} />
              <div className="mt-2 text-center font-['IBM_Plex_Mono']">
                <span className="text-[9px] text-[#38BDF8] uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED BADGE
                </span>
                <span className="text-[8px] text-white/40 block truncate max-w-[125px] mt-0.5">
                  {record.securityHash}
                </span>
              </div>
            </div>

          </div>

          {/* Tear Strip Bottom Bar */}
          <div className="relative z-10 pt-4 border-t border-dashed border-white/20 flex items-center justify-between font-['IBM_Plex_Mono'] text-[11px] text-white/50">
            <div>
              <span>Dec 4–5, 2026 • Main Campus</span>
            </div>
            <div className="text-[10px] text-white/40">
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
            className="inline-flex items-center gap-2 font-['Montserrat'] text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Register another participant</span>
          </button>
        </div>
      )}

    </div>
  );
};
