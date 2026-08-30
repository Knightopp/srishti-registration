import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Users, 
  User, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  QrCode, 
  Check, 
  Copy, 
  AlertCircle,
  Trophy,
  Calendar,
  MapPin,
  Clock,
  Sparkles
} from 'lucide-react';
import QRCode from 'qrcode';
import { EventItem, RegistrationRecord, TeammateInfo } from '../types/registration';
import { useRegistration } from '../context/RegistrationContext';

interface TeamEventRegistrationProps {
  event: EventItem;
  onBack: () => void;
  onPassGenerated: (pass: RegistrationRecord) => void;
}

export const TeamEventRegistration: React.FC<TeamEventRegistrationProps> = ({
  event,
  onBack,
  onPassGenerated,
}) => {
  const { settings, addRegistration } = useRegistration();

  // Team Details
  const [teamName, setTeamName] = useState('');
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('Computer Science');
  const [year, setYear] = useState('2nd Year');

  // Team Leader Details (Member 1)
  const [leaderName, setLeaderName] = useState('');
  const [leaderEmail, setLeaderEmail] = useState('');
  const [leaderPhone, setLeaderPhone] = useState('');

  // Teammates List (Members 2, 3, 4...)
  // Initial size based on minTeamSize (e.g. minTeamSize = 4 means 3 teammates + 1 leader)
  const defaultTeammatesCount = Math.max(1, (event.minTeamSize || 2) - 1);
  const [teammates, setTeammates] = useState<TeammateInfo[]>(() => {
    return Array.from({ length: defaultTeammatesCount }, () => ({
      name: '',
      email: '',
      phone: '',
      college: '',
      department: '',
      year: '2nd Year',
    }));
  });

  // Payment State
  const [paymentUtr, setPaymentUtr] = useState('');
  const [upiQrUrl, setUpiQrUrl] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Limits
  const maxTeammates = (event.maxTeamSize || 4) - 1;
  const minTeammates = Math.max(1, (event.minTeamSize || 2) - 1);

  // Generate UPI QR Code dynamically for the team fee
  useEffect(() => {
    if (event.fee > 0 && settings.upiId) {
      const upiString = `upi://pay?pa=${settings.upiId}&pn=SRISHTI%202.7%20ST%20THOMAS&am=${event.fee}&cu=INR&tn=SRISHTI_TEAM_${event.id.toUpperCase()}`;
      QRCode.toDataURL(upiString, {
        width: 180,
        margin: 1,
        color: { dark: '#080A0E', light: '#FFFFFF' },
      }).then(setUpiQrUrl).catch(() => {});
    } else {
      setUpiQrUrl('');
    }
  }, [event.fee, event.id, settings.upiId]);

  // Teammate field change handler
  const handleTeammateChange = (index: number, field: keyof TeammateInfo, value: string) => {
    setTeammates((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Add teammate slot
  const handleAddTeammate = () => {
    if (teammates.length < maxTeammates) {
      setTeammates((prev) => [
        ...prev,
        { name: '', email: '', phone: '', college: college || '', department: department || '', year },
      ]);
    }
  };

  // Remove teammate slot
  const handleRemoveTeammate = (index: number) => {
    if (teammates.length > minTeammates) {
      setTeammates((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCopyUpi = () => {
    if (!settings.upiId) return;
    navigator.clipboard.writeText(settings.upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validations
    if (!teamName.trim()) {
      setErrorMessage('Please provide a team name.');
      return;
    }
    if (!college.trim()) {
      setErrorMessage('Please enter your college/institution.');
      return;
    }
    if (!leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim()) {
      setErrorMessage('Please complete all team leader details (Name, Email, Phone).');
      return;
    }

    // Verify all teammate names are filled
    const invalidTeammate = teammates.find((t) => !t.name.trim());
    if (invalidTeammate) {
      setErrorMessage('Please fill in the full names for all required teammates.');
      return;
    }

    if (event.fee > 0 && !paymentUtr.trim()) {
      setErrorMessage('Please enter your Payment Transaction ID / UTR number.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Auto-fill college/department on teammates if empty
      const sanitizedTeammates: TeammateInfo[] = teammates.map((t) => ({
        name: t.name.trim(),
        email: t.email?.trim() || undefined,
        phone: t.phone?.trim() || undefined,
        college: t.college?.trim() || college.trim(),
        department: t.department?.trim() || department.trim(),
        year: t.year || year,
      }));

      const record = addRegistration({
        fullName: leaderName.trim(),
        email: leaderEmail.trim().toLowerCase(),
        phone: leaderPhone.trim(),
        college: college.trim(),
        department: department.trim() || 'Computer Science',
        year,
        teamName: teamName.trim(),
        isTeamRegistration: true,
        teammates: sanitizedTeammates,
        selectedEventIds: [event.id],
        selectedEventNames: [event.title],
        totalFee: event.fee,
        paymentUtr: paymentUtr.trim() || `UTR-${Date.now().toString().slice(-6)}`,
      });

      onPassGenerated(record);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to issue team pass. Please verify details and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6">
      
      {/* Back Button & Top Navigation */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white/70 hover:text-white text-xs font-['Montserrat'] font-bold uppercase tracking-wider mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Team Events</span>
      </button>

      {/* Event Hero Showcase Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#091424] via-[#0d1e38] to-[#080d16] border border-white/15 p-6 sm:p-8 mb-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#38BDF8]/20 border border-[#38BDF8]/40 text-[#38BDF8] text-[10px] font-['IBM_Plex_Mono'] font-bold uppercase tracking-wider">
                {event.stageLabel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[10px] font-['IBM_Plex_Mono'] font-bold uppercase tracking-wider flex items-center gap-1">
                <Users className="w-3 h-3 text-sky-300" />
                <span>{event.teamSize}</span>
              </span>
            </div>

            <h1 className="font-['Montserrat'] font-black text-2xl sm:text-3xl text-white tracking-tight">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/60 mt-1 font-light max-w-xl">
              {event.highlightText || event.description}
            </p>

            {/* Event Key Details */}
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
              TOTAL TEAM FEE
            </span>
            <span className="font-['Montserrat'] font-black text-2xl sm:text-3xl text-[#38BDF8] block mt-0.5">
              {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
            </span>
            <span className="text-[10px] text-white/50 font-['IBM_Plex_Mono'] mt-1 block">
              Covers entire squad pass
            </span>
          </div>
        </div>
      </div>

      {/* Team Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* SECTION 1: TEAM PROFILE */}
        <div className="bg-[#080C14] rounded-3xl border border-white/10 p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-[#38BDF8]">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Montserrat'] font-extrabold text-base text-white">
                1. Team Profile & Institution
              </h2>
              <p className="text-xs text-white/40 font-light">
                Give your squad a memorable name and identify your institution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Team / Squad Name <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Cyber Titans"
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
                placeholder="e.g. St. Thomas College, Thrissur"
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
                placeholder="e.g. Computer Science"
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

        {/* SECTION 2: TEAM LEADER (MEMBER 1) */}
        <div className="bg-[#080C14] rounded-3xl border border-white/10 p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Montserrat'] font-extrabold text-base text-white">
                  2. Team Leader (Member 1 - Primary Contact)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-['IBM_Plex_Mono'] font-bold uppercase">
                  Lead
                </span>
              </div>
              <p className="text-xs text-white/40 font-light">
                The access pass and coordination notices will be delivered to this contact.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Leader Full Name <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="text"
                required
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Leader Email <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="email"
                required
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono']"
              />
            </div>

            <div>
              <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                Leader Phone / WhatsApp <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="tel"
                required
                value={leaderPhone}
                onChange={(e) => setLeaderPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono']"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TEAMMATES DETAILS (MEMBERS 2, 3, 4...) */}
        <div className="bg-[#080C14] rounded-3xl border border-white/10 p-6 sm:p-7 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-white/[0.08]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-['Montserrat'] font-extrabold text-base text-white">
                  3. Teammates Details ({teammates.length} Added + 1 Leader = {teammates.length + 1} Total)
                </h2>
                <p className="text-xs text-white/40 font-light">
                  Input details for each teammate so they are registered on the official team pass.
                </p>
              </div>
            </div>

            {/* Add Teammate Button (if allowed by event rules) */}
            {teammates.length < maxTeammates && (
              <button
                type="button"
                onClick={handleAddTeammate}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 text-xs font-['Montserrat'] font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Teammate</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {teammates.map((teammate, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#05070B] border border-white/[0.08] relative group"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/[0.04]">
                  <span className="font-['IBM_Plex_Mono'] text-xs font-bold text-[#38BDF8] flex items-center gap-1.5">
                    <span>Member #{idx + 2}</span>
                    <span className="text-white/30 text-[10px] font-normal">• Teammate</span>
                  </span>

                  {teammates.length > minTeammates && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTeammate(idx)}
                      className="text-red-400/60 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Remove teammate slot"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-['IBM_Plex_Mono'] text-white/50 uppercase tracking-wider mb-1">
                      Full Name <span className="text-[#38BDF8]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teammate.name}
                      onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                      placeholder={`Teammate ${idx + 2} Name`}
                      className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['IBM_Plex_Mono'] text-white/50 uppercase tracking-wider mb-1">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={teammate.email}
                      onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                      placeholder="teammate@example.com"
                      className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono']"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-['IBM_Plex_Mono'] text-white/50 uppercase tracking-wider mb-1">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      value={teammate.phone}
                      onChange={(e) => handleTeammateChange(idx, 'phone', e.target.value)}
                      placeholder="+91 Phone"
                      className="w-full bg-[#080C14] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono']"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: PAYMENT & QR CODE */}
        <div className="bg-[#080C14] rounded-3xl border border-white/10 p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-white/[0.08]">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-[#38BDF8]">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-['Montserrat'] font-extrabold text-base text-white">
                4. Payment & Verification
              </h2>
              <p className="text-xs text-white/40 font-light">
                Scan the official UPI QR code or pay to the UPI ID, then enter your transaction UTR.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Left: UPI QR Card */}
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

            {/* Right: Payment Amount & UTR Input */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20">
                <div className="flex justify-between items-center text-xs font-['IBM_Plex_Mono']">
                  <span className="text-white/60">Squad Event:</span>
                  <span className="text-white font-bold">{event.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-['IBM_Plex_Mono'] mt-1.5">
                  <span className="text-white/60">Total Squad Fee:</span>
                  <span className="text-[#38BDF8] font-black text-sm">
                    {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-['IBM_Plex_Mono'] text-white/60 uppercase tracking-wider mb-1.5">
                  UPI Transaction ID / UTR Number {event.fee > 0 && <span className="text-[#38BDF8]">*</span>}
                </label>
                <input
                  type="text"
                  required={event.fee > 0}
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value.toUpperCase())}
                  placeholder="e.g. 423871928371 or UTR-XXXXXX"
                  className="w-full bg-[#05070B] border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['IBM_Plex_Mono'] uppercase tracking-wider"
                />
                <p className="text-[10px] text-white/40 font-['IBM_Plex_Mono'] mt-1">
                  Found in your GPay / PhonePe / Paytm payment receipt.
                </p>
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

        {/* Form Submission Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-white/40 font-['IBM_Plex_Mono'] text-center sm:text-left">
            By registering, your team will receive an official verifiable QR access badge.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-27-glow text-white font-['Montserrat'] font-extrabold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Issuing Team Pass...' : 'Register Team & Issue Pass'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
