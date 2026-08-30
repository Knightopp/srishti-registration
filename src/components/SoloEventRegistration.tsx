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
        color: { dark: '#090B0F', light: '#FFFFFF' },
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
      
      {/* Monochromatic Canvas Container */}
      <div className="mono-canvas rounded-[36px] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <button
            onClick={onBack}
            className="mono-icon-btn w-auto px-4 py-2 flex items-center gap-2 text-xs font-['Outfit'] font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Solo Challenges</span>
          </button>

          <span className="text-xs font-['Outfit'] text-white/50 font-semibold">
            Registration Desk
          </span>
        </div>

        {/* Hero Card Banner */}
        <div className="mono-card-elevated overflow-hidden">
          <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-[#10141D] p-6 flex flex-col justify-between">
            <img
              src={event.image}
              alt={event.title}
              className="absolute inset-0 w-full h-full object-cover opacity-35"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#151A25] via-transparent to-black/40" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-[#0A0D13]/80 border border-white/15 text-[10px] font-['Outfit'] font-bold text-white uppercase tracking-wider">
                {event.stageLabel}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#0A0D13]/80 border border-white/15 text-[10px] font-['Outfit'] font-bold text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>1 Participant</span>
              </span>
            </div>

            <div className="relative z-10">
              <h1 className="font-['Outfit'] font-black text-2xl sm:text-3xl text-white tracking-tight">
                {event.title}
              </h1>
              <p className="text-xs text-white/70 mt-1 max-w-lg line-clamp-1">
                {event.highlightText || event.description}
              </p>
            </div>
          </div>

          <div className="mono-card-shelf px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs font-['Outfit'] text-white/70">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-white/50" />
                {event.time}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-white/50" />
                {event.venue}
              </span>
            </div>

            <div className="text-right">
              <span className="font-['Outfit'] font-black text-lg text-white">
                {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
              </span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Attendee Details */}
          <div className="mono-card-surface p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <div className="mono-icon-btn w-8 h-8 bg-[#232938]">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-['Outfit'] font-extrabold text-base text-white">
                  Participant Information
                </h2>
                <p className="text-xs text-white/50 font-normal">
                  Your pass badge will be created with these details.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Full Name <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Abhiram C S"
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Email Address <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="participant@example.com"
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Phone / WhatsApp <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  College / Institution <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="St. Thomas College, Thrissur"
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Year of Study
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white font-['Outfit']"
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

          {/* Payment Section */}
          <div className="mono-card-surface p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <div className="mono-icon-btn w-8 h-8 bg-[#232938]">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-['Outfit'] font-extrabold text-base text-white">
                  Payment & Verification
                </h2>
                <p className="text-xs text-white/50 font-normal">
                  UPI QR verification for instant pass generation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-[#0A0D13] border border-white/[0.08] text-center">
                {upiQrUrl ? (
                  <div className="p-2.5 bg-white rounded-2xl shadow-xl inline-block mb-3">
                    <img src={upiQrUrl} alt="UPI QR" className="w-32 h-32" />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-3 text-white/40 text-xs">
                    Free Event
                  </div>
                )}

                <span className="text-[10px] font-['Outfit'] text-white/50 uppercase tracking-widest block font-bold">
                  OFFICIAL UPI ID
                </span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-['Outfit'] text-xs text-white font-bold bg-[#171C26] px-3 py-1 rounded-full border border-white/10">
                    {settings.upiId || 'abhiramcs2007@oksbi'}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-1.5 rounded-full bg-white/10 text-white cursor-pointer"
                  >
                    {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#0A0D13] border border-white/[0.08]">
                  <div className="flex justify-between items-center text-xs font-['Outfit']">
                    <span className="text-white/60">Selected Arena:</span>
                    <span className="text-white font-bold">{event.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-['Outfit'] mt-1.5 pt-1.5 border-t border-white/10">
                    <span className="text-white/60">Total Fee:</span>
                    <span className="text-xl font-black text-white">
                      {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-1.5">
                    UPI Transaction ID / UTR {event.fee > 0 && <span className="text-[#38BDF8]">*</span>}
                  </label>
                  <input
                    type="text"
                    required={event.fee > 0}
                    value={paymentUtr}
                    onChange={(e) => setPaymentUtr(e.target.value.toUpperCase())}
                    placeholder="e.g. 423871928371 or UTR-XXXXXX"
                    className="w-full mono-input-inset rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 font-['Outfit'] uppercase"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-200 text-xs font-['Outfit']">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-mono-primary px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Issuing Pass...' : 'Issue Solo Pass'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
