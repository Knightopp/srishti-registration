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
  Sparkles,
  ArrowUpRight
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

  // Teammates List
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
        color: { dark: '#04060A', light: '#FFFFFF' },
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

  const handleAddTeammate = () => {
    if (teammates.length < maxTeammates) {
      setTeammates((prev) => [
        ...prev,
        { name: '', email: '', phone: '', college: college || '', department: department || '', year },
      ]);
    }
  };

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!teamName.trim()) {
      setErrorMessage('Please provide a team name.');
      return;
    }
    if (!college.trim()) {
      setErrorMessage('Please enter your college / institution.');
      return;
    }
    if (!leaderName.trim() || !leaderEmail.trim() || !leaderPhone.trim()) {
      setErrorMessage('Please complete all team leader details (Name, Email, Phone).');
      return;
    }

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
      
      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/12 text-white/80 hover:text-white text-xs font-['Outfit'] font-bold uppercase tracking-wider mb-6 transition-all cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Team Events</span>
      </button>

      {/* Event Hero Showcase Banner with Luxury Aurora Gradient */}
      <div className="card-layer-3 rounded-[32px] p-6 sm:p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full bg-black/50 border border-white/20 text-[#60A5FA] text-xs font-['Outfit'] font-bold uppercase tracking-wider">
                {event.stageLabel}
              </span>
              <span className="pill-growth-badge px-3 py-1 text-xs flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{event.teamSize}</span>
              </span>
            </div>

            <h1 className="headline-display text-3xl sm:text-4xl text-white">
              {event.title}
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-2 font-normal max-w-xl leading-relaxed">
              {event.highlightText || event.description}
            </p>

            {/* Event Key Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5 pt-4 border-t border-white/12 text-xs font-['Outfit'] text-white/70">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#38BDF8]" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#38BDF8]" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 font-bold col-span-2 sm:col-span-1">
                <Trophy className="w-4 h-4 text-amber-300" />
                <span>{event.prize}</span>
              </div>
            </div>
          </div>

          {/* Fee Card */}
          <div className="pill-price-tag p-5 text-center shrink-0 min-w-[170px] bg-black/40 border-white/20">
            <span className="text-[10px] font-['Outfit'] text-white/50 uppercase tracking-widest block font-bold">
              TOTAL SQUAD FEE
            </span>
            <span className="font-['Outfit'] font-black text-3xl text-white block mt-0.5">
              {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
            </span>
            <span className="text-[10px] text-[#93C5FD] font-['Outfit'] mt-1 block font-medium">
              Covers entire squad
            </span>
          </div>
        </div>
      </div>

      {/* Team Registration Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SECTION 1: TEAM PROFILE */}
        <div className="card-layer-1 rounded-[28px] p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/[0.08]">
            <div className="icon-circle-btn shrink-0">
              <Users className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-['Outfit'] font-extrabold text-lg text-white">
                1. Team Profile & Institution
              </h2>
              <p className="text-xs text-white/50 font-normal">
                Give your squad a memorable name and identify your institution.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                Team / Squad Name <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="text"
                required
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="e.g. Cyber Titans"
                className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit'] transition-colors"
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
                placeholder="e.g. St. Thomas College, Thrissur"
                className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit'] transition-colors"
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
                placeholder="e.g. Computer Science"
                className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit'] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                Year of Study
              </label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#38BDF8] font-['Outfit'] transition-colors"
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

        {/* SECTION 2: TEAM LEADER */}
        <div className="card-layer-2 rounded-[28px] p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/[0.08]">
            <div className="icon-circle-btn shrink-0">
              <User className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Outfit'] font-extrabold text-lg text-white">
                  2. Team Leader (Member 1 - Primary Contact)
                </h2>
                <span className="pill-growth-badge px-2 py-0.5 text-[10px]">
                  Lead
                </span>
              </div>
              <p className="text-xs text-white/50 font-normal">
                Access pass and coordination notices will be linked to this contact.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                Leader Full Name <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="text"
                required
                value={leaderName}
                onChange={(e) => setLeaderName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit']"
              />
            </div>

            <div>
              <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                Leader Email <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="email"
                required
                value={leaderEmail}
                onChange={(e) => setLeaderEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit']"
              />
            </div>

            <div>
              <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                Leader Phone / WhatsApp <span className="text-[#38BDF8]">*</span>
              </label>
              <input
                type="tel"
                required
                value={leaderPhone}
                onChange={(e) => setLeaderPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit']"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: TEAMMATES DETAILS */}
        <div className="card-layer-3 rounded-[28px] p-6 sm:p-7 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/[0.08]">
            <div className="flex items-center gap-3.5">
              <div className="icon-circle-btn shrink-0">
                <Users className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="font-['Outfit'] font-extrabold text-lg text-white">
                  3. Teammates Roster ({teammates.length} Added + 1 Leader = {teammates.length + 1} Total)
                </h2>
                <p className="text-xs text-white/60 font-normal">
                  All teammates will be officially printed and registered on the squad pass.
                </p>
              </div>
            </div>

            {teammates.length < maxTeammates && (
              <button
                type="button"
                onClick={handleAddTeammate}
                className="btn-white-action inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs uppercase tracking-wider cursor-pointer self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                <span>Add Teammate</span>
              </button>
            )}
          </div>

          <div className="space-y-4">
            {teammates.map((teammate, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-black/40 border border-white/15 relative"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <span className="font-['Outfit'] text-xs font-bold text-[#93C5FD] flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#2563EB]/40 flex items-center justify-center text-white text-[11px]">
                      #{idx + 2}
                    </span>
                    <span>Teammate {idx + 2}</span>
                  </span>

                  {teammates.length > minTeammates && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTeammate(idx)}
                      className="text-red-400/70 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                      title="Remove teammate"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-['Outfit'] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[#38BDF8]">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={teammate.name}
                      onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                      placeholder={`Teammate ${idx + 2} Name`}
                      className="w-full bg-[#050810] border border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit']"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-['Outfit'] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      value={teammate.email}
                      onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                      placeholder="teammate@example.com"
                      className="w-full bg-[#050810] border border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit']"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-['Outfit'] font-bold text-white/60 uppercase tracking-wider mb-1.5">
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      value={teammate.phone}
                      onChange={(e) => handleTeammateChange(idx, 'phone', e.target.value)}
                      placeholder="+91 Phone"
                      className="w-full bg-[#050810] border border-white/12 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit']"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: PAYMENT & QR CODE */}
        <div className="card-layer-2 rounded-[28px] p-6 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-white/[0.08]">
            <div className="icon-circle-btn shrink-0">
              <QrCode className="w-5 h-5 text-black" />
            </div>
            <div>
              <h2 className="font-['Outfit'] font-extrabold text-lg text-white">
                4. Payment & Verification
              </h2>
              <p className="text-xs text-white/50 font-normal">
                Scan the official UPI QR code or pay to the UPI ID, then enter your transaction reference.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            
            {/* Left: UPI QR Card */}
            <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/50 border border-white/15 text-center">
              {upiQrUrl ? (
                <div className="p-3 bg-white rounded-2xl shadow-xl inline-block mb-4">
                  <img src={upiQrUrl} alt="UPI QR" className="w-36 h-36" />
                </div>
              ) : (
                <div className="w-36 h-36 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mb-4 text-white/40 text-xs">
                  Free Event
                </div>
              )}

              <div className="w-full">
                <span className="text-[10px] font-['Outfit'] text-white/50 uppercase tracking-widest block font-bold">
                  OFFICIAL UPI ID
                </span>
                
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <span className="font-['Outfit'] text-xs text-white font-bold bg-white/10 px-4 py-1.5 rounded-full border border-white/15">
                    {settings.upiId || 'abhiramcs2007@oksbi'}
                  </span>
                  
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Copy UPI ID"
                  >
                    {copiedUpi ? <Check className="w-4 h-4 text-[#38BDF8]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Payment Amount & UTR Input */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#091024] border border-blue-500/30">
                <div className="flex justify-between items-center text-xs font-['Outfit']">
                  <span className="text-white/60">Squad Challenge:</span>
                  <span className="text-white font-bold">{event.title}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-['Outfit'] mt-2 pt-2 border-t border-white/10">
                  <span className="text-white/60">Total Squad Fee:</span>
                  <span className="text-2xl font-black text-[#60A5FA]">
                    {event.fee === 0 ? 'FREE' : `₹${event.fee}`}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  UPI Transaction ID / UTR Number {event.fee > 0 && <span className="text-[#38BDF8]">*</span>}
                </label>
                <input
                  type="text"
                  required={event.fee > 0}
                  value={paymentUtr}
                  onChange={(e) => setPaymentUtr(e.target.value.toUpperCase())}
                  placeholder="e.g. 423871928371 or UTR-XXXXXX"
                  className="w-full bg-[#050810] border border-white/15 rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#38BDF8] font-['Outfit'] tracking-wider uppercase"
                />
                <p className="text-[11px] text-white/40 font-['Outfit'] mt-1.5">
                  Available in your Google Pay, PhonePe, or Paytm confirmation screen.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-500/15 border border-red-500/30 flex items-center gap-3 text-red-200 text-xs font-['Outfit']">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Submission Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-xs text-white/50 font-['Outfit'] text-center sm:text-left">
            By registering, your squad will receive an official verifiable digital pass.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-electric-blue w-full sm:w-auto px-8 py-3.5 rounded-full font-['Outfit'] font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? 'Issuing Team Pass...' : 'Register Team & Issue Pass'}</span>
          </button>
        </div>

      </form>

    </div>
  );
};
