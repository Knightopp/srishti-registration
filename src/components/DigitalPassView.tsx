import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Check, 
  ShieldCheck, 
  ArrowLeft,
  ArrowUpRight,
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
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#38BDF8', '#60A5FA', '#FFFFFF', '#4F46E5'],
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
        backgroundColor: '#000000',
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
      
      {/* Confirmed Header with Fintech Typography */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[#93C5FD] font-['Outfit'] text-xs font-bold mb-3">
          <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
          <span>OFFICIAL DIGITAL ACCESS BADGE</span>
        </div>
        <h1 className="headline-display text-4xl sm:text-5xl text-white">
          Access Granted.<br />
          <span className="text-[#38BDF8]">Pass Issued.</span>
        </h1>
        <p className="text-xs sm:text-sm text-white/60 mt-2 max-w-md mx-auto font-normal">
          Present this verifiable badge at the registration gate for fast-track campus access.
        </p>
      </div>

      {/* Action Toolbar with White & Electric Pill Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8 no-print">
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="btn-electric-blue flex items-center gap-2 px-6 py-3 rounded-full font-['Outfit'] font-bold text-xs uppercase tracking-wider cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Exporting...' : 'Download Pass (PNG)'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="btn-white-action flex items-center gap-2 px-5 py-3 rounded-full text-xs uppercase tracking-wider cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print</span>
        </button>

        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] text-white font-['Outfit'] font-bold text-xs border border-white/15 transition-all cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-[#38BDF8]">Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-white/70" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>

      {/* Printable / Capturable Pass Card (Styled like Luxury Crypto Asset Card in Screenshot) */}
      <div className="flex justify-center">
        <div
          ref={passCardRef}
          id="srishti-pass-card"
          className="w-full max-w-xl card-layer-3 rounded-[32px] p-6 sm:p-8 relative overflow-hidden text-white printable-pass-card shadow-2xl border border-white/20"
        >
          {/* Luminous Atmospheric Diffused Aurora Glow (Inspired by Reference Screenshot) */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#2563EB]/35 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-60 h-60 bg-[#4F46E5]/20 rounded-full blur-[70px] pointer-events-none" />

          {/* Header Row */}
          <div className="relative z-10 flex items-start justify-between border-b border-white/12 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white/10 p-2 border border-white/20 flex items-center justify-center">
                <img src={srishtiLogo} alt="Srishti" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-['Outfit'] text-[10px] uppercase tracking-widest text-[#93C5FD] block font-bold">
                  OFFICIAL ACCESS BADGE
                </span>
                <h2 className="font-['Outfit'] font-black text-2xl text-white tracking-tight">
                  SRISHTI <span className="text-[#38BDF8]">2.7</span>
                </h2>
                <span className="font-['Outfit'] text-xs text-white/60">Dec 4–5, 2026 • St. Thomas College</span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-white/40 uppercase tracking-widest block font-['Outfit'] font-bold">PASS ID</span>
              <span className="text-base sm:text-lg font-black text-white bg-white/10 px-3.5 py-1 rounded-full border border-white/20 inline-block mt-0.5 font-['IBM_Plex_Mono']">
                {record.passId}
              </span>
            </div>
          </div>

          {/* Attendee Info Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
            
            {/* Left 2 Cols */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <span className="font-['Outfit'] text-[10px] text-white/50 uppercase tracking-widest block font-bold">
                  {record.isTeamRegistration || record.teamName ? 'TEAM & LEADER' : 'PARTICIPANT NAME'}
                </span>
                <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                  <p className="font-['Outfit'] font-black text-2xl text-white">
                    {record.fullName}
                  </p>
                  {record.teamName && (
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/25 text-[#93C5FD] font-['Outfit'] text-xs font-bold border border-blue-400/40">
                      Team {record.teamName}
                    </span>
                  )}
                </div>
                <p className="font-['Outfit'] text-xs text-white/60 mt-0.5">{record.email} • {record.phone}</p>
              </div>

              {/* Team Roster section if team registration */}
              {record.teammates && record.teammates.length > 0 && (
                <div className="p-4 rounded-2xl bg-black/40 border border-white/15">
                  <span className="font-['Outfit'] text-[11px] text-[#93C5FD] uppercase tracking-wider block mb-2 font-bold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>TEAM ROSTER ({record.teammates.length + 1} SQUAD MEMBERS)</span>
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-['Outfit']">
                    <div className="flex items-center gap-2 text-white font-semibold">
                      <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                      <span className="truncate">{record.fullName} <span className="text-white/40 text-[10px] font-normal">(Lead)</span></span>
                    </div>
                    {record.teammates.map((tm, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-white/80 font-medium truncate">
                        <span className="w-5 h-5 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-[10px] font-bold">{idx + 2}</span>
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
                  <p className="text-white/60">{record.department} ({record.year})</p>
                </div>

                <div>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest block font-bold">
                    PASS TYPE
                  </span>
                  <p className="font-bold text-[#60A5FA] mt-0.5">
                    {record.totalFee === 0 ? 'FREE PASS' : `PAID PASS (₹${record.totalFee})`}
                  </p>
                  <p className="text-white/60">
                    {record.teamName ? `Squad Pass` : 'Individual Pass'}
                  </p>
                </div>
              </div>

              {/* Claimed Events */}
              <div className="pt-1">
                <span className="font-['Outfit'] text-[10px] text-white/40 uppercase tracking-widest block mb-2 font-bold">
                  REGISTERED CHALLENGES ({record.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {record.selectedEventNames.map((name, idx) => (
                    <span 
                      key={idx} 
                      className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-[#93C5FD] font-['Outfit']"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: QR Code */}
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/50 border border-white/15">
              <CustomSrishtiQR value={verificationUrl} size={135} />
              <div className="mt-3 text-center font-['Outfit']">
                <span className="text-[10px] text-[#38BDF8] uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED BADGE
                </span>
                <span className="text-[9px] text-white/40 block truncate max-w-[125px] mt-0.5 font-['IBM_Plex_Mono']">
                  {record.securityHash}
                </span>
              </div>
            </div>

          </div>

          {/* Bottom Bar */}
          <div className="relative z-10 pt-4 border-t border-dashed border-white/20 flex items-center justify-between font-['Outfit'] text-xs text-white/60">
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
            className="inline-flex items-center gap-2 font-['Outfit'] text-xs font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Register another participant / squad</span>
          </button>
        </div>
      )}

    </div>
  );
};
