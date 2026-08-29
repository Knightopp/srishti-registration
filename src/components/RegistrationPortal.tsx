import React, { useState, useEffect } from 'react';
import { 
  Check, 
  Ticket, 
  Sparkles, 
  User, 
  Mail, 
  Phone, 
  Building, 
  ShieldCheck
} from 'lucide-react';
import QRCode from 'qrcode';
import { useRegistration } from '../context/RegistrationContext';
import { RegistrationRecord } from '../types/registration';
import { DigitalPassView } from './DigitalPassView';

interface RegistrationPortalProps {
  initialEventId?: string;
}

export const RegistrationPortal: React.FC<RegistrationPortalProps> = ({ initialEventId }) => {
  const { events, settings, addRegistration } = useRegistration();

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2nd Year');
  const [teamName, setTeamName] = useState('');
  const [paymentUtr, setPaymentUtr] = useState('');

  // Selected Events
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');

  // Payment UI state
  const [upiQrUrl, setUpiQrUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<RegistrationRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Pre-select initial event if provided from query param
  useEffect(() => {
    if (initialEventId) {
      const match = events.find((e) => e.id.toLowerCase() === initialEventId.toLowerCase());
      if (match && !selectedEventIds.includes(match.id)) {
        setSelectedEventIds([match.id]);
      }
    }
  }, [initialEventId, events]);

  // Toggle event selection
  const handleToggleEvent = (eventId: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  // Calculate total fee
  const selectedEvents = events.filter((e) => selectedEventIds.includes(e.id));
  const totalFee = selectedEvents.reduce((sum, e) => sum + (e.fee || 0), 0);

  // Generate UPI QR Code
  useEffect(() => {
    if (totalFee > 0 && settings.upiId) {
      const upiString = `upi://pay?pa=${settings.upiId}&pn=SRISHTI%202.7%20ST%20THOMAS&am=${totalFee}&cu=INR&tn=SRISHTI_REGISTRATION`;
      QRCode.toDataURL(upiString, {
        width: 220,
        margin: 1,
        color: { dark: '#0F172A', light: '#FFFFFF' },
      }).then(setUpiQrUrl).catch(() => {});
    } else {
      setUpiQrUrl('');
    }
  }, [totalFee, settings.upiId]);

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !email.trim() || !phone.trim() || !college.trim()) {
      setErrorMessage('Please fill in all required delegate details.');
      return;
    }

    if (selectedEventIds.length === 0) {
      setErrorMessage('Please select at least one event or workshop.');
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
        teamName: teamName.trim() || undefined,
        selectedEventIds,
        selectedEventNames: selectedEvents.map((e) => e.title),
        totalFee,
        paymentUtr: paymentUtr.trim() || `UTR-AUTO-${Date.now().toString().slice(-6)}`,
      });

      setGeneratedPass(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage('An error occurred during pass issuance. Please retry.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If pass is already generated, render the digital pass badge
  if (generatedPass) {
    return (
      <DigitalPassView
        record={generatedPass}
        onNewRegistration={() => {
          setGeneratedPass(null);
          setSelectedEventIds([]);
          setFullName('');
          setEmail('');
          setPhone('');
          setCollege('');
          setDepartment('');
          setPaymentUtr('');
        }}
      />
    );
  }

  const filteredEvents = events.filter((ev) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'free') return ev.fee === 0;
    if (activeFilter === 'technical') return ['code-clash', 'hackathon', 'ctf', 'ev-4'].includes(ev.id);
    if (activeFilter === 'cultural') return ['ev-1', 'ev-5', 'ev-6', 'ev-9', 'ev-10'].includes(ev.id);
    return true;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Title / Intro */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SRISHTI 2.7 • Official Pass Registration</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white font-['Montserrat'] tracking-tight">
          Select Your Passes & Register
        </h1>
        <p className="text-gray-400 text-sm sm:text-base mt-2 max-w-2xl mx-auto">
          Reserve your spot for hackathons, competitive programming, AI masterclasses, and cultural events. Digital QR Entry Pass issued instantly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 7 Cols: Step 1 - Event Selection */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-sky-400" />
                  <span>Step 1: Choose Events / Workshops</span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Select one or multiple events to build your custom fest pass
                </p>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 bg-[#080a0e] p-1 rounded-lg border border-white/5 overflow-x-auto">
                {['all', 'technical', 'cultural', 'free'].map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setActiveFilter(f)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                      activeFilter === f
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Events Grid */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {filteredEvents.map((ev) => {
                const isSelected = selectedEventIds.includes(ev.id);
                return (
                  <div
                    key={ev.id}
                    onClick={() => handleToggleEvent(ev.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500/50 shadow-md ring-1 ring-blue-500/30'
                        : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-md mt-0.5 flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'border-white/20 bg-black/30'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-sky-400">{ev.number}</span>
                          <h3 className="text-sm font-bold text-white">{ev.title}</h3>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{ev.highlightText}</p>
                        <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 font-mono">
                          <span>{ev.time}</span>
                          <span>•</span>
                          <span>{ev.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                          ev.fee === 0
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {ev.fee === 0 ? 'FREE' : `₹${ev.fee}`}
                      </span>
                      {ev.prize && (
                        <span className="block text-[10px] text-amber-400 mt-1 font-semibold">
                          {ev.prize}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Step 2 - Delegate Details & Payment */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4 mb-5">
              <User className="w-5 h-5 text-sky-400" />
              <span>Step 2: Participant Details</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Full Name <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#080c14] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Email Address <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@domain.com"
                      className="w-full bg-[#080c14] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">
                    Phone / WhatsApp <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9876543210"
                      className="w-full bg-[#080c14] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  College / Institution <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    placeholder="e.g. St. Thomas College, Thrissur"
                    className="w-full bg-[#080c14] border border-white/15 rounded-xl pl-9 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Department</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-[#080c14] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1">Year of Study</label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#080c14] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Team Name <span className="text-gray-500 font-normal">(Optional for team events)</span>
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. ByteBusters"
                  className="w-full bg-[#080c14] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Fee & Payment Section */}
            <div className="mt-6 pt-5 border-t border-white/10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-300">Total Registration Fee:</span>
                <span className="text-2xl font-black font-mono text-white">
                  {totalFee === 0 ? <span className="text-emerald-400">FREE</span> : `₹${totalFee}`}
                </span>
              </div>

              {totalFee > 0 && upiQrUrl && (
                <div className="p-4 rounded-xl bg-[#080c14] border border-white/10 mb-4 flex items-center gap-4">
                  <img src={upiQrUrl} alt="UPI QR" className="w-24 h-24 rounded-lg bg-white p-1" />
                  <div className="text-xs space-y-1">
                    <span className="font-bold text-sky-300 block">Scan to Pay with Any UPI App</span>
                    <span className="text-gray-400 font-mono block">UPI: {settings.upiId}</span>
                    <span className="text-[10px] text-gray-500 block">Google Pay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs mb-4">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#38BDF8] via-[#2563EB] to-[#1D4ED8] text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Issuing Pass...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete Registration & Issue E-Pass</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>

      </form>
    </div>
  );
};
