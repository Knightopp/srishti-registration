import React, { useRef, useState, useEffect } from 'react';
import { 
  Download, 
  Printer, 
  Share2, 
  Check, 
  ShieldCheck, 
  Ticket, 
  Calendar, 
  MapPin, 
  User, 
  Building, 
  CheckCircle2, 
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

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38BDF8', '#2563EB', '#60A5FA', '#FFFFFF'],
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
      {/* Success Top Banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>Registration Confirmed & Pass Issued</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-['Montserrat'] tracking-tight">
          Your Official Entry Pass
        </h1>
        <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">
          Please download this digital e-pass or save the Pass ID. Present the QR code at the registration desk for instant entry badge printing.
        </p>
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6 no-print">
        <button
          onClick={handleDownloadImage}
          disabled={isDownloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#38BDF8] to-[#2563EB] text-white font-semibold text-sm shadow-lg hover:shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Exporting HD Pass...' : 'Download Pass (PNG)'}</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 transition-all cursor-pointer"
        >
          <Printer className="w-4 h-4 text-gray-300" />
          <span>Print Pass</span>
        </button>

        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm border border-white/10 transition-all cursor-pointer"
        >
          {copiedLink ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400">Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-gray-300" />
              <span>Copy Verification Link</span>
            </>
          )}
        </button>
      </div>

      {/* Printable / Capturable Pass Card */}
      <div className="flex justify-center">
        <div
          ref={passCardRef}
          id="srishti-pass-card"
          className="w-full max-w-xl bg-gradient-to-b from-[#0e131d] via-[#090d14] to-[#06080d] rounded-3xl border border-white/15 shadow-2xl p-6 sm:p-8 relative overflow-hidden text-white printable-pass-card"
        >
          {/* Decorative Background Accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          {/* Header row */}
          <div className="relative z-10 flex items-start justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/10 p-1.5 border border-white/15 flex items-center justify-center">
                <img src={srishtiLogo} alt="Srishti Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8] block">
                  OFFICIAL ACCESS BADGE
                </span>
                <h2 className="text-2xl font-black tracking-tight text-white font-['Montserrat']">
                  SRISHTI <span className="text-[#38BDF8]">2.7</span>
                </h2>
                <span className="text-[11px] text-gray-400">Dec 4–5, 2026 • St. Thomas College</span>
              </div>
            </div>

            {/* Pass ID Pill */}
            <div className="text-right">
              <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block">Pass ID</span>
              <span className="text-base sm:text-lg font-black font-mono text-[#38BDF8] bg-sky-500/10 px-3 py-1 rounded-xl border border-sky-500/30 inline-block">
                {record.passId}
              </span>
            </div>
          </div>

          {/* Body Info Grid */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-6 my-6">
            {/* Left 2 cols: Attendee Data */}
            <div className="sm:col-span-2 space-y-4">
              <div>
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3 text-sky-400" /> Delegate Name
                </span>
                <p className="text-xl font-bold text-white tracking-wide mt-0.5">{record.fullName}</p>
                <p className="text-xs text-gray-400 font-mono">{record.email} • {record.phone}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Building className="w-3 h-3 text-sky-400" /> Institution
                  </span>
                  <p className="text-xs font-semibold text-gray-200 mt-0.5 truncate">{record.college}</p>
                  <p className="text-[11px] text-gray-400">{record.department} ({record.year})</p>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Ticket className="w-3 h-3 text-sky-400" /> Pass Type
                  </span>
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    {record.totalFee === 0 ? 'Free Access Pass' : `All-Access Pass (₹${record.totalFee})`}
                  </p>
                  <p className="text-[11px] text-gray-400">
                    {record.teamName ? `Team: ${record.teamName}` : 'Individual Participant'}
                  </p>
                </div>
              </div>

              {/* Registered Events list */}
              <div className="pt-2">
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider block mb-1.5">
                  Registered Events ({record.selectedEventNames.length})
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {record.selectedEventNames.map((name, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[11px] font-medium text-sky-200"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right col: High Density QR Code */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#080c14] border border-white/10">
              <CustomSrishtiQR value={verificationUrl} size={140} />
              <div className="mt-2 text-center">
                <span className="text-[9px] font-mono text-emerald-400 uppercase font-bold tracking-wider flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> VERIFIED BADGE
                </span>
                <span className="text-[8px] font-mono text-gray-500 block truncate max-w-[130px]">
                  {record.securityHash}
                </span>
              </div>
            </div>
          </div>

          {/* Ticket Footer / Tear Strip */}
          <div className="relative z-10 pt-4 border-t border-dashed border-white/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-gray-400 font-mono">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-sky-400" /> Dec 4–5, 2026
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400" /> Main Campus, Thrissur
              </span>
            </div>
            <div className="text-[10px] text-gray-500">
              Issued: {new Date(record.registeredAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* New Registration Button */}
      {onNewRegistration && (
        <div className="text-center mt-8 no-print">
          <button
            onClick={onNewRegistration}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Register another participant or event</span>
          </button>
        </div>
      )}
    </div>
  );
};
