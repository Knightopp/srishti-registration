import React, { useState, useEffect } from 'react';
import { Check, X, ArrowRight, ShieldCheck, ChevronUp } from 'lucide-react';
import QRCode from 'qrcode';
import { useRegistration } from '../context/RegistrationContext';
import { RegistrationRecord, EventItem } from '../types/registration';
import { DigitalPassView } from './DigitalPassView';

interface RegistrationPortalProps {
  initialEventId?: string;
}

export const RegistrationPortal: React.FC<RegistrationPortalProps> = ({ initialEventId }) => {
  const { events, settings, addRegistration } = useRegistration();

  // Attendee Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('2nd Year');
  const [teamName, setTeamName] = useState('');
  const [paymentUtr, setPaymentUtr] = useState('');

  // Selected Events State
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>([]);
  const [upiQrUrl, setUpiQrUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedPass, setGeneratedPass] = useState<RegistrationRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Mobile Bottom Sheet Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // Pre-select initial event if query param provided
  useEffect(() => {
    if (initialEventId) {
      const match = events.find((e) => e.id.toLowerCase() === initialEventId.toLowerCase());
      if (match && !selectedEventIds.includes(match.id)) {
        setSelectedEventIds([match.id]);
      }
    }
  }, [initialEventId, events]);

  // Toggle Event in Ledger
  const handleToggleEvent = (eventId: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  // Selected Events List and Calculated Fee
  const selectedEvents = events.filter((e) => selectedEventIds.includes(e.id));
  const totalFee = selectedEvents.reduce((sum, e) => sum + (e.fee || 0), 0);

  // Generate UPI QR Code dynamically
  useEffect(() => {
    if (totalFee > 0 && settings.upiId) {
      const upiString = `upi://pay?pa=${settings.upiId}&pn=SRISHTI%202.7%20ST%20THOMAS&am=${totalFee}&cu=INR&tn=SRISHTI_REGISTRATION`;
      QRCode.toDataURL(upiString, {
        width: 180,
        margin: 1,
        color: { dark: '#0D0F14', light: '#FFFFFF' },
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
      setErrorMessage('Please fill in your name, contact email, phone, and college.');
      return;
    }

    if (selectedEventIds.length === 0) {
      setErrorMessage('Please select at least one event to build your pass.');
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
        paymentUtr: paymentUtr.trim() || `UTR-${Date.now().toString().slice(-6)}`,
      });

      setGeneratedPass(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMessage('Failed to issue pass. Please check your details and try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  // Group events by real fest activity tracks (No arbitrary 01/02 numbering)
  const tracks: { name: string; subtitle: string; events: EventItem[] }[] = [
    {
      name: 'TRACK 01 // MORNING ARENA & SPRINTS',
      subtitle: 'DECEMBER 4 • 09:00 AM – 01:00 PM',
      events: events.filter((e) => ['ev-1', 'code-clash', 'ui-design'].includes(e.id)),
    },
    {
      name: 'TRACK 02 // TECHNICAL LABS & HACKATHONS',
      subtitle: 'DECEMBER 4–5 • WORKSHOPS & BUILD ROUNDS',
      events: events.filter((e) => ['ev-4', 'ctf', 'hackathon'].includes(e.id)),
    },
    {
      name: 'TRACK 03 // QUIZ, KEYNOTE & CULTURAL NIGHT',
      subtitle: 'STAGE EVENTS & EVENING SESSIONS',
      events: events.filter((e) => ['ev-5', 'ev-6', 'ev-9', 'ev-10'].includes(e.id)),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-12">
      
      {/* Editorial Header */}
      <div className="border-b border-[#262B36] pb-8 mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-ledger text-xs text-[#F59E0B] tracking-wider uppercase font-semibold block mb-1">
              FESTIVAL PASS REGISTRATION // DEC 4–5, 2026
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-[#F3EFE6] tracking-tight leading-[1.05]">
              Build Your Srishti Pass
            </h1>
          </div>
          <p className="font-body text-sm text-[#8B92A0] max-w-md">
            Select the competitions, hackathons, or workshops you want to enter. Instant QR pass issued for campus check-in.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (60%): The Tournament Event Ledger */}
        <div className="lg:col-span-7 space-y-8">
          
          {tracks.map((track, trackIdx) => (
            <section key={trackIdx} className="space-y-3">
              {/* Track Header */}
              <div className="flex items-baseline justify-between border-b border-[#262B36] pb-2">
                <h2 className="font-ledger font-bold text-xs tracking-wider text-[#F59E0B]">
                  {track.name}
                </h2>
                <span className="font-ledger text-[11px] text-[#565C69]">
                  {track.subtitle}
                </span>
              </div>

              {/* Event Ledger Rows */}
              <div className="space-y-2">
                {track.events.map((ev) => {
                  const isSelected = selectedEventIds.includes(ev.id);
                  const isFree = ev.fee === 0;

                  return (
                    <div
                      key={ev.id}
                      onClick={() => handleToggleEvent(ev.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 select-none ${
                        isSelected
                          ? 'bg-[#1D212D] border-[#F59E0B] shadow-[0_0_20px_rgba(245,158,11,0.08)]'
                          : 'bg-[#161922] border-[#262B36] hover:border-[#343B4A] hover:bg-[#1A1E29]'
                      }`}
                    >
                      {/* Left: Check / Punch indicator & Event Info */}
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center border transition-colors ${
                            isSelected
                              ? 'bg-[#F59E0B] border-[#F59E0B] text-[#0D0F14]'
                              : 'border-[#343B4A] bg-[#0D0F14]'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <h3 className="font-body font-bold text-base text-[#F3EFE6] leading-snug">
                            {ev.title}
                          </h3>
                          <p className="font-body text-xs text-[#8B92A0] mt-1 line-clamp-2 leading-relaxed">
                            {ev.description}
                          </p>
                          
                          {/* Metadata row: No pills, clean typographic layout */}
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5 font-ledger text-[11px] text-[#565C69]">
                            <span>{ev.time}</span>
                            <span>•</span>
                            <span>{ev.venue}</span>
                            {ev.speaker && (
                              <>
                                <span>•</span>
                                <span className="text-[#8B92A0]">{ev.speaker.name}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Rail: Fee & Prize Ledger */}
                      <div className="text-right flex-shrink-0 pt-0.5">
                        <div className="font-ledger font-bold text-base">
                          {isFree ? (
                            <span className="text-[#10B981]">FREE</span>
                          ) : (
                            <span className="text-[#F3EFE6]">₹{ev.fee}</span>
                          )}
                        </div>

                        {ev.prize && ev.prize !== 'Keynote & Ceremony' && ev.prize !== 'Open Stage Event' && ev.prize !== 'Open Keynote' && (
                          <span className="block font-ledger text-xs font-bold text-[#F59E0B] mt-1">
                            {ev.prize}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

        </div>

        {/* Right Column (40%): The Live Pass Slip & Fast Checkout */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="bg-[#161922] border border-[#262B36] rounded-2xl p-6 shadow-xl relative overflow-hidden">
            
            {/* Slip Header */}
            <div className="border-b border-[#262B36] pb-4 mb-5 flex items-center justify-between">
              <div>
                <span className="font-ledger text-[10px] text-[#F59E0B] uppercase tracking-wider font-bold block">
                  PASS SLIP // SRISHTI 2.7
                </span>
                <h2 className="font-display font-black text-xl text-[#F3EFE6]">
                  Your Claimed Entries
                </h2>
              </div>
              <span className="font-ledger text-xs font-bold text-[#8B92A0]">
                {selectedEvents.length} {selectedEvents.length === 1 ? 'EVENT' : 'EVENTS'}
              </span>
            </div>

            {/* Selected Events List */}
            {selectedEvents.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-[#262B36] rounded-xl my-4">
                <p className="font-body text-xs text-[#8B92A0]">
                  No events selected yet.<br />Tap any row on the left to add it to your pass slip.
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                {selectedEvents.map((ev) => (
                  <div 
                    key={ev.id} 
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0F14] border border-[#262B36] text-xs"
                  >
                    <span className="font-body font-medium text-[#F3EFE6] truncate max-w-[200px]">
                      {ev.title}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-ledger font-bold text-[#F59E0B]">
                        {ev.fee === 0 ? 'FREE' : `₹${ev.fee}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleEvent(ev.id)}
                        className="text-[#565C69] hover:text-red-400 p-0.5 cursor-pointer"
                        title="Remove event"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fee Tally Ledger */}
            <div className="border-t border-[#262B36] pt-4 mb-6 space-y-2 font-ledger text-xs">
              <div className="flex justify-between text-[#8B92A0]">
                <span>Events Count:</span>
                <span>{selectedEvents.length} selected</span>
              </div>
              <div className="flex justify-between items-baseline text-base font-bold text-[#F3EFE6] pt-2 border-t border-[#262B36]/60">
                <span>Total Pass Fee:</span>
                <span className="text-xl text-[#F59E0B]">
                  {totalFee === 0 ? <span className="text-[#10B981]">FREE ENTRY</span> : `₹${totalFee}`}
                </span>
              </div>
            </div>

            {/* Attendee Identity Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anand Krishna"
                  className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] placeholder-[#565C69] focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] placeholder-[#565C69] focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="anand@college.edu"
                    className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] placeholder-[#565C69] focus:outline-none focus:border-[#F59E0B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">
                  College / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. St. Thomas College, Thrissur"
                  className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] placeholder-[#565C69] focus:outline-none focus:border-[#F59E0B] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] placeholder-[#565C69] focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Dynamic UPI Payment Box if Fee > 0 */}
              {totalFee > 0 && upiQrUrl && (
                <div className="p-3.5 rounded-xl bg-[#0D0F14] border border-[#262B36] flex items-center gap-4">
                  <img src={upiQrUrl} alt="UPI QR" className="w-20 h-20 rounded bg-white p-1 flex-shrink-0" />
                  <div className="font-ledger text-xs space-y-1">
                    <span className="font-bold text-[#F59E0B] block">Scan to Pay via UPI</span>
                    <span className="text-[#8B92A0] block">VPA: {settings.upiId}</span>
                    <span className="text-[10px] text-[#565C69] block">GPay, PhonePe, Paytm, BHIM</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 font-body text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || selectedEventIds.length === 0}
                className="w-full py-3.5 px-6 rounded-xl bg-[#F59E0B] hover:bg-[#d97706] disabled:opacity-50 text-[#0D0F14] font-body font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                {isSubmitting ? (
                  <span>Generating Entry Pass...</span>
                ) : (
                  <>
                    <span>Confirm & Get Pass</span>
                    <ArrowRight className="w-4 h-4 stroke-[3]" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Pass Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#161922] border-t border-[#262B36] p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <span className="font-ledger text-[11px] text-[#8B92A0] block">
              {selectedEvents.length} {selectedEvents.length === 1 ? 'Event' : 'Events'} Selected
            </span>
            <span className="font-ledger font-bold text-lg text-[#F59E0B]">
              {totalFee === 0 ? <span className="text-[#10B981]">FREE</span> : `₹${totalFee}`}
            </span>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            disabled={selectedEventIds.length === 0}
            className="px-6 py-2.5 rounded-xl bg-[#F59E0B] disabled:opacity-50 text-[#0D0F14] font-body font-bold text-xs tracking-wide flex items-center gap-2 cursor-pointer"
          >
            <span>Complete Pass</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Up Modal Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end">
          <div className="bg-[#161922] border-t border-[#262B36] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between border-b border-[#262B36] pb-3">
              <div>
                <span className="font-ledger text-[10px] text-[#F59E0B] uppercase font-bold">Pass Slip // SRISHTI 2.7</span>
                <h3 className="font-display font-black text-lg text-[#F3EFE6]">Complete Your Registration</h3>
              </div>
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-[#0D0F14] border border-[#262B36] text-[#8B92A0]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anand Krishna"
                  className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="anand@college.edu"
                  className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              <div>
                <label className="block font-body text-xs font-semibold text-[#8B92A0] mb-1">College *</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. St. Thomas College"
                  className="w-full bg-[#0D0F14] border border-[#262B36] rounded-xl px-3.5 py-2.5 text-sm text-[#F3EFE6] focus:outline-none focus:border-[#F59E0B]"
                />
              </div>

              {totalFee > 0 && upiQrUrl && (
                <div className="p-3 rounded-xl bg-[#0D0F14] border border-[#262B36] flex items-center gap-3">
                  <img src={upiQrUrl} alt="UPI QR" className="w-16 h-16 rounded bg-white p-1 flex-shrink-0" />
                  <div className="font-ledger text-xs space-y-0.5">
                    <span className="font-bold text-[#F59E0B] block">UPI: {settings.upiId}</span>
                    <span className="text-[10px] text-[#8B92A0] block">Pay ₹{totalFee} via any UPI App</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 font-body text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl bg-[#F59E0B] text-[#0D0F14] font-body font-black text-sm tracking-wide cursor-pointer"
              >
                {isSubmitting ? 'Generating Entry Pass...' : `Confirm & Pay ₹${totalFee}`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
