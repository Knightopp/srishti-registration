import React, { useState, useEffect } from 'react';
import { Check, X, ArrowUpRight, ChevronUp, Ticket, Users } from 'lucide-react';
import QRCode from 'qrcode';
import { useRegistration } from '../context/RegistrationContext';
import { RegistrationRecord } from '../types/registration';
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

  // Category filter
  const [activeCategory, setActiveCategory] = useState('ALL');

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

  // Toggle Event Selection
  const handleToggleEvent = (eventId: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]
    );
  };

  // Selected Events List & Calculated Fee
  const selectedEvents = events.filter((e) => selectedEventIds.includes(e.id));
  const totalFee = selectedEvents.reduce((sum, e) => sum + (e.fee || 0), 0);

  // Check if any selected event requires a team
  const hasTeamEvent = selectedEvents.some(
    (e) => e.teamSize && !e.teamSize.toLowerCase().includes('solo')
  );

  // Generate UPI QR Code dynamically
  useEffect(() => {
    if (totalFee > 0 && settings.upiId) {
      const upiString = `upi://pay?pa=${settings.upiId}&pn=SRISHTI%202.7%20ST%20THOMAS&am=${totalFee}&cu=INR&tn=SRISHTI_REGISTRATION`;
      QRCode.toDataURL(upiString, {
        width: 180,
        margin: 1,
        color: { dark: '#080A0E', light: '#FFFFFF' },
      }).then(setUpiQrUrl).catch(() => {});
    } else {
      setUpiQrUrl('');
    }
  }, [totalFee, settings.upiId]);

  // Filter categories
  const categories = ['ALL', 'CODING', 'ROBOTICS', 'WEB & AI', 'IDEATHON', 'GAMES', 'DANCE & ARTS'];

  const filteredEvents = events.filter((ev) => {
    if (activeCategory === 'ALL') return true;
    if (activeCategory === 'CODING') return ['codex', 'debugging', 'blind-coding'].includes(ev.id);
    if (activeCategory === 'ROBOTICS') return ev.id === 'tracebot';
    if (activeCategory === 'WEB & AI') return ev.id === 'ai-webdev';
    if (activeCategory === 'IDEATHON') return ev.id === 'ideathon';
    if (activeCategory === 'GAMES') return ['treasure-hunt', 'mind-game', 'tech-quiz'].includes(ev.id);
    if (activeCategory === 'DANCE & ARTS') return ['waltz', 'face-painting'].includes(ev.id);
    return true;
  });

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
          setTeamName('');
          setPaymentUtr('');
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-28 lg:pb-16">
      
      {/* Top Section Tag & Impact Title matching original website */}
      <div className="mb-8 select-none">
        <span className="font-['IBM_Plex_Mono'] text-xs font-semibold text-[#38BDF8] tracking-widest uppercase block mb-3">
          01 // OFFICIAL FEST EVENTS & PASSES
        </span>
        <h1 className="font-['Montserrat'] font-black text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight uppercase leading-[0.95] m-0 p-0">
          EVENT SHOWCASE
        </h1>
        <p className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base text-white/50 mt-3 max-w-2xl font-light">
          11 Official events including Coding, Robotics, Ideathon, Dance, and Strategy. Select your passes below to register.
        </p>
      </div>

      {/* Category Filter Tabs with Cyan Active Indicator */}
      <div className="flex items-center gap-4 sm:gap-8 border-b border-white/[0.08] pb-3 mb-8 overflow-x-auto select-none no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`font-['Montserrat'] text-xs sm:text-sm font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer pb-2 relative ${
              activeCategory === cat
                ? 'text-white'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            <span>{cat}</span>
            {activeCategory === cat && (
              <span className="absolute bottom-[-13px] left-0 right-0 h-[2px] bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]" />
            )}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (7 cols): Event Cards matching the original site layout */}
        <div className="lg:col-span-7 space-y-4">
          {filteredEvents.map((ev) => {
            const isSelected = selectedEventIds.includes(ev.id);
            const isFree = ev.fee === 0;

            return (
              <div
                key={ev.id}
                onClick={() => handleToggleEvent(ev.id)}
                className={`rounded-2xl p-5 sm:p-6 transition-all cursor-pointer border select-none ${
                  isSelected
                    ? 'bg-[#0D1015] border-[#38BDF8] glow-cyan-card'
                    : 'bg-[#080A0E] border-white/[0.08] hover:border-white/20 hover:bg-[#0D1015]'
                }`}
              >
                {/* Event Top Tag: EVENT #01 • CATEGORY • PRICE */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-['IBM_Plex_Mono'] text-[11px] sm:text-xs font-bold text-[#38BDF8] tracking-wider uppercase">
                      EVENT #{ev.number} • {ev.category.toUpperCase()} • {isFree ? 'FREE' : `₹${ev.fee}`}
                    </span>
                    {ev.teamSize && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-[#38BDF8] text-[10px] font-['IBM_Plex_Mono'] font-semibold flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{ev.teamSize}</span>
                      </span>
                    )}
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? 'bg-[#38BDF8] border-[#38BDF8] text-[#050608]'
                        : 'border-white/20 bg-black/40 text-transparent'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Event Main Title */}
                <h3 className="font-['Montserrat'] font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-snug">
                  {ev.title}
                </h3>

                {/* Left Cyan Accent Highlight Bar */}
                {ev.highlightText && (
                  <div className="my-3 pl-3 border-l-2 border-[#38BDF8] text-xs sm:text-sm text-white/80 font-medium">
                    {ev.highlightText}
                  </div>
                )}

                {/* Description */}
                <p className="text-xs sm:text-sm text-white/50 font-light leading-relaxed mb-4">
                  {ev.description}
                </p>

                {/* Metadata Row: SCHEDULE, VENUE, PRIZE */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/[0.06] text-[11px] font-['IBM_Plex_Mono']">
                  <div>
                    <span className="text-white/30 block uppercase tracking-wider text-[9px]">SCHEDULE</span>
                    <span className="text-white/70 font-semibold">{ev.time}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block uppercase tracking-wider text-[9px]">VENUE</span>
                    <span className="text-white/70 font-semibold">{ev.venue}</span>
                  </div>
                  <div>
                    <span className="text-white/30 block uppercase tracking-wider text-[9px]">PRIZE POOL</span>
                    <span className="text-[#38BDF8] font-bold">{ev.prize || 'Certificates'}</span>
                  </div>
                </div>

                {/* Bottom Toggle CTA */}
                <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                  <span className="text-xs text-white/40 font-['IBM_Plex_Mono']">
                    {isSelected ? '✓ Pass Item Added' : '+ Click to include in pass'}
                  </span>

                  <button
                    type="button"
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#38BDF8] text-[#050608]'
                        : 'bg-white/[0.06] hover:bg-[#2563EB] text-white'
                    }`}
                  >
                    <span>{isSelected ? 'Claimed' : 'Select Event'}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* Right Column (5 cols): Pass Slip & Checkout Panel */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="bg-[#080A0E] border border-white/[0.1] rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            
            {/* Slip Header */}
            <div className="border-b border-white/[0.08] pb-4 mb-5 flex items-center justify-between">
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#38BDF8] uppercase tracking-wider font-bold block">
                  02 // REGISTRATION PASS SLIP
                </span>
                <h2 className="font-['Montserrat'] font-black text-xl text-white">
                  Pass Summary
                </h2>
              </div>
              <span className="font-['IBM_Plex_Mono'] text-xs font-bold text-[#38BDF8] bg-sky-500/10 px-2.5 py-1 rounded-full border border-sky-500/20">
                {selectedEvents.length} {selectedEvents.length === 1 ? 'EVENT' : 'EVENTS'}
              </span>
            </div>

            {/* Selected Events List */}
            {selectedEvents.length === 0 ? (
              <div className="py-8 text-center border border-dashed border-white/[0.1] rounded-xl my-4">
                <Ticket className="w-8 h-8 text-[#38BDF8]/40 mx-auto mb-2" />
                <p className="text-xs text-white/50 font-light">
                  No events selected yet.<br />Click any event card to add it to your pass.
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-1">
                {selectedEvents.map((ev) => (
                  <div 
                    key={ev.id} 
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1015] border border-white/[0.08] text-xs"
                  >
                    <div>
                      <span className="font-medium text-white block truncate max-w-[200px]">
                        {ev.title}
                      </span>
                      {ev.teamSize && (
                        <span className="text-[10px] text-white/40 font-['IBM_Plex_Mono']">
                          {ev.teamSize}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-['IBM_Plex_Mono'] font-bold text-[#38BDF8]">
                        {ev.fee === 0 ? 'FREE' : `₹${ev.fee}`}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleToggleEvent(ev.id)}
                        className="text-white/40 hover:text-red-400 p-0.5 cursor-pointer"
                        title="Remove"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Fee Tally */}
            <div className="border-t border-white/[0.08] pt-4 mb-6 space-y-2 font-['IBM_Plex_Mono'] text-xs">
              <div className="flex justify-between text-white/50">
                <span>Selected Events:</span>
                <span>{selectedEvents.length} items</span>
              </div>
              <div className="flex justify-between items-baseline text-base font-bold text-white pt-2 border-t border-white/[0.06]">
                <span>Total Registration Fee:</span>
                <span className="text-2xl font-black text-gradient-cyan">
                  {totalFee === 0 ? 'FREE' : `₹${totalFee}`}
                </span>
              </div>
            </div>

            {/* Attendee Identity Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  Full Name (Primary Contact / Team Leader) *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rahul@college.edu"
                    className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">
                  College / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. St. Thomas College, Thrissur"
                  className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Computer Science"
                    className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/70 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              {/* Team Name if team event selected */}
              {hasTeamEvent && (
                <div>
                  <label className="block text-xs font-semibold text-[#38BDF8] mb-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Team / Squad Name (For Team Events)</span>
                  </label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. CyberKnights / ByteSquad"
                    className="w-full bg-[#050608] border border-[#38BDF8]/40 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              )}

              {/* Dynamic UPI Payment Box if Fee > 0 */}
              {totalFee > 0 && upiQrUrl && (
                <div className="p-3.5 rounded-xl bg-[#050608] border border-white/[0.12] flex items-center gap-4">
                  <img src={upiQrUrl} alt="UPI QR" className="w-20 h-20 rounded-lg bg-white p-1 flex-shrink-0" />
                  <div className="font-['IBM_Plex_Mono'] text-xs space-y-1">
                    <span className="font-bold text-[#38BDF8] block">Scan to Pay with Any UPI App</span>
                    <span className="text-white/60 block text-[11px]">UPI: {settings.upiId}</span>
                    <span className="text-[10px] text-white/40 block">Google Pay, PhonePe, Paytm</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || selectedEventIds.length === 0}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-27-glow disabled:opacity-40 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
              >
                {isSubmitting ? (
                  <span>Issuing Pass...</span>
                ) : (
                  <>
                    <span>Register For Pass</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>

      </div>

      {/* Mobile Sticky Bottom Pass Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080A0E] border-t border-white/[0.1] p-4 shadow-2xl">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <span className="font-['IBM_Plex_Mono'] text-[11px] text-white/50 block">
              {selectedEvents.length} {selectedEvents.length === 1 ? 'Event' : 'Events'} Selected
            </span>
            <span className="font-['IBM_Plex_Mono'] font-bold text-lg text-gradient-cyan">
              {totalFee === 0 ? 'FREE' : `₹${totalFee}`}
            </span>
          </div>

          <button
            onClick={() => setMobileDrawerOpen(true)}
            disabled={selectedEventIds.length === 0}
            className="px-6 py-2.5 rounded-full bg-gradient-27-glow disabled:opacity-40 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <span>Complete Pass</span>
            <ChevronUp className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Up Modal Drawer */}
      {mobileDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end">
          <div className="bg-[#080A0E] border-t border-white/[0.12] rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[#38BDF8] uppercase font-bold">PASS SUMMARY</span>
                <h3 className="font-['Montserrat'] font-black text-lg text-white">Complete Registration</h3>
              </div>
              <button 
                onClick={() => setMobileDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Full Name (Leader / Participant) *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Phone / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@college.edu"
                  className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1">College *</label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. St. Thomas College"
                  className="w-full bg-[#050608] border border-white/[0.12] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              {hasTeamEvent && (
                <div>
                  <label className="block text-xs font-semibold text-[#38BDF8] mb-1">Team / Squad Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. ByteSquad"
                    className="w-full bg-[#050608] border border-[#38BDF8]/40 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
              )}

              {totalFee > 0 && upiQrUrl && (
                <div className="p-3 rounded-xl bg-[#050608] border border-white/[0.12] flex items-center gap-3">
                  <img src={upiQrUrl} alt="UPI QR" className="w-16 h-16 rounded bg-white p-1 flex-shrink-0" />
                  <div className="font-['IBM_Plex_Mono'] text-xs space-y-0.5">
                    <span className="font-bold text-[#38BDF8] block">UPI: {settings.upiId}</span>
                    <span className="text-[10px] text-white/50 block">Pay ₹{totalFee} via any UPI App</span>
                  </div>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  {errorMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
              >
                {isSubmitting ? 'Issuing Pass...' : `Confirm & Pay ₹${totalFee}`}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
