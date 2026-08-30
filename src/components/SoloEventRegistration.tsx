import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  User, 
  ShieldCheck, 
  QrCode, 
  Check, 
  Copy, 
  AlertCircle,
  Trophy,
  Calendar,
  MapPin
} from 'lucide-react';
import QRCode from 'qrcode';
import { EventItem, RegistrationRecord } from '../types/registration';
import { useRegistration } from '../context/RegistrationContext';

interface SoloEventRegistrationProps {
  event: EventItem;
  onBack: () => void;
  onPassGenerated: (pass: RegistrationRecord) => void;
}

export const SoloEventRegistration: React.FC<SoloEventRegistrationProps> = ({
  event,
  onBack,
  onPassGenerated,
}) => {
  const { settings, addRegistration } = useRegistration();

  // Participant Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('2nd Year');

  // Payment State
  const [paymentUtr, setPaymentUtr] = useState('');
  const [upiQrUrl, setUpiQrUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Generate UPI QR Code dynamically
  useEffect(() => {
    if (event.fee > 0 && settings.upiId) {
      const upiString = `upi://pay?pa=${settings.upiId}&pn=SRISHTI%202.7%20ST%20THOMAS&am=${event.fee}&cu=INR&tn=SRISHTI_SOLO_${event.id.toUpperCase()}`;
      QRCode.toDataURL(upiString, {
        width: 180,
        margin: 1,
        color: { dark: '#080A0E', light: '#FFFFFF' },
      }).then(setUpiQrUrl).catch(() => {});
    } else {
      setUpiQrUrl('');
    }
  }, [event.fee, event.id, settings.upiId]);

  const handleCopyUpi = () => {
    if (!settings.upiId) return;
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !college.trim()) {
      setErrorMessage('Please fill in your name, contact email, phone number, and college.');
      return;
    }

    if (event.fee > 0 && !paymentUtr.trim()) {
      setErrorMessage('Please provide your Payment Transaction ID / UTR number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const record = addRegistration({
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        college: college.trim(),
        department: department.trim() || 'Computer Science',
        year,
        isTeamRegistration: false,
        selectedEventIds: [event.id],
        selectedEventNames: [event.title],
        totalFee: event.fee,
        paymentUtr: paymentUtr.trim() || `UTR-${Date.now().toString().slice(-6)}`,
      });

      onPassGenerated(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to issue pass. Please check your details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/70 hover:text-white text-xs font-['Montserrat'] font-bold uppercase tracking-wider mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Solo Events</span>
      </button>

      {/* Event Overview Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#091424] via-[#0d1e38] to-[#080d16] border border-white/15 p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-['IBM_Plex_Mono'] font-bold uppercase tracking-wider">
                {event.stageLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 text-[10px] font-['IBM_Plex_Mono'] font-bold uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3 text-cyan-300" />
                <span>1 Participant</span>
              </span>
            </div>

            <h1 className="font-['Montserrat'] font-black text-2xl sm:text-3xl text-white tracking-tight">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 font-light max-w-xl">
              {event.highlightText || event.description}
            </p>

            {/* Key info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/10 text-xs font-['IBM_Plex_Mono'] text-white/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-bold col-span-2 sm:col-span-1">
                <Trophy className="w-3.5 h-3.5" />
                <span>{event.prize}</span>
              </div>
            </div>
          </div>

          {/* Fee Card */}
          <div className="bg-[#05080E]/80 backdrop-blur-md rounded-2xl border border-white/10 p-4 sm:p-5 text-center shrink-0 min-w-[160px]">
            <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-widest block">
              INDIVIDUAL FEE
            </span>
            <span className="font-['Montserrat'] font-black text-2xl sm:text-3xl text-[#38BDF8] block mt-0.5">
              {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
            </span>
            <span className="text-[10px] text-white/50 font-['IBM_Plex_Mono'] mt-1 block">
              Single entry pass
            </span>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Attendee Details */}
        <div className="bg-[#080C14] rounded-3xl border border-white/10 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#38BDF8]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Montserrat'] font-extrabold text-base text-white">
                Participant Information
              </h2>
              <p className="text-xs text-white/40 font-light">
                Your entry badge will be issued with these details.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Full Name <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Abhiram C S"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Email Address <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="participant@example.com"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono']"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Phone / WhatsApp <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono']"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                College / Institution <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="text"
                required
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="St. Thomas College, Thrissur"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Computer Science"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#38BDF8]"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>
          </div>
        </div>

        {/* Payment & QR Section */}
        <div className="bg-[#080C14] rounded-3xl border border-white/10 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#38BDF8]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Montserrat'] font-extrabold text-base text-white">
                Payment & Pass Verification
              </h2>
              <p className="text-xs text-white/40 font-light">
                Scan the UPI QR code and provide your transaction reference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* QR Card */}
            <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#05070B] border border-white/10 text-center">
              {upiQrUrl ? (
                <div className="p-2.5 bg-white rounded-xl shadow-lg inline-block mb-3">
                  <img src={upiQrUrl} alt="UPI QR" className="w-36 h-36" />
                </div>
              ) : (
                <div className="w-36 h-36 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center mb-3 text-white/30 text-xs">
                  Free Event
                </div>
              )}

              <div className="w-full">
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-white/40 uppercase tracking-widest block">
                  OFFICIAL UPI ID
                </span>
                
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-['IBM_Plex_Mono'] text-xs text-white font-bold bg-white/5 px-3 py-1 rounded-lg border border-white/10">
                    {settings.upiId || 'abhiramcs2007@oksbi'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-[#38BDF8]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* UTR Input */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20">
                <div className="flex justify-between items-center text-xs font-['IBM_Plex_Mono']">
                  <span className="text-white/60">Selected Event:</span>
                  <span className="text-white font-bold">{event.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-['IBM_Plex_Mono'] mt-1.5">
                  <span className="text-white/60">Total Fee:</span>
                  <span className="text-[#38BDF8] font-black text-sm">
                    {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                  UPI Transaction ID / UTR {event.fee > 0 && <span className="text-[#38BDF8]">*</span>}
                </label>
                <input
                  type="text"
                  required={event.fee > 0}
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value.toUpperCase())}
                  placeholder="e.g. 423871928371 or UTR-XXXXXX"
                  className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono'] uppercase tracking-wider"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-300 text-xs font-['IBM_Plex_Mono']">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Submission */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-white/40 font-['IBM_Plex_Mono'] text-center sm:text-left">
            Instant digital access pass with QR will be generated upon submission.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Issuing Pass...' : 'Issue Solo Pass'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
