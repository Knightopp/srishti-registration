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
  MapPin
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
        color: { dark: '#090B0F', light: '#FFFFFF' },
      }).then(setUpiQrUrl).catch(() => {});
    } else {
      setUpiQrUrl('');
    }
  }, [event.fee, event.id, settings.upiId]);

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
      
      {/* Monochromatic Canvas Container */}
      <div className="mono-canvas rounded-[36px] p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <button
            onClick={onBack}
            className="mono-icon-btn w-auto px-4 py-2 flex items-center gap-2 text-xs font-['Outfit'] font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Squad Events</span>
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
                <Users className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>{event.teamSize}</span>
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
          
          {/* SECTION 1: TEAM PROFILE */}
          <div className="mono-card-surface p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <div className="mono-icon-btn w-8 h-8 bg-[#232938]">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-['Outfit'] font-extrabold text-base text-white">
                  1. Team Profile & Institution
                </h2>
                <p className="text-xs text-white/50 font-normal">
                  Identify your squad and institution.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Team Name <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="e.g. Cyber Titans"
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
                  placeholder="e.g. St. Thomas College"
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

          {/* SECTION 2: TEAM LEADER */}
          <div className="mono-card-surface p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <div className="mono-icon-btn w-8 h-8 bg-[#232938]">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-['Outfit'] font-extrabold text-base text-white">
                  2. Team Leader (Member 1)
                </h2>
                <p className="text-xs text-white/50 font-normal">
                  Pass & notifications will be delivered to this leader.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Leader Name <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
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
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
                />
              </div>

              <div>
                <label className="block text-xs font-['Outfit'] font-bold text-white/70 uppercase tracking-wider mb-2">
                  Leader Phone <span className="text-[#38BDF8]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={leaderPhone}
                  onChange={(e) => setLeaderPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full mono-input-inset rounded-2xl px-4 py-3 text-sm text-white placeholder:text-white/30 font-['Outfit']"
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: TEAMMATES ROSTER */}
          <div className="mono-card-surface p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-3">
                <div className="mono-icon-btn w-8 h-8 bg-[#232938]">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h2 className="font-['Outfit'] font-extrabold text-base text-white">
                    3. Squad Roster ({teammates.length + 1} Total Members)
                  </h2>
                  <p className="text-xs text-white/50 font-normal">
                    Names printed on the official squad entry badge.
                  </p>
                </div>
              </div>

              {teammates.length < maxTeammates && (
                <button
                  type="button"
                  onClick={handleAddTeammate}
                  className="btn-mono-accent px-3.5 py-1.5 rounded-full text-xs font-['Outfit'] font-bold flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Member</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {teammates.map((teammate, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#0F131B] border border-white/[0.06] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-['Outfit'] text-xs font-bold text-white/80 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#1F2535] flex items-center justify-center text-[10px] text-white">
                        {idx + 2}
                      </span>
                      <span>Teammate {idx + 2}</span>
                    </span>

                    {teammates.length > minTeammates && (
                      <button
                        type="button"
                        onClick={() => handleRemoveTeammate(idx)}
                        className="text-white/40 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <input
                        type="text"
                        required
                        value={teammate.name}
                        onChange={(e) => handleTeammateChange(idx, 'name', e.target.value)}
                        placeholder="Full Name *"
                        className="w-full mono-input-inset rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 font-['Outfit']"
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={teammate.email}
                        onChange={(e) => handleTeammateChange(idx, 'email', e.target.value)}
                        placeholder="Email (Optional)"
                        className="w-full mono-input-inset rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 font-['Outfit']"
                      />
                    </div>
                    <div>
                      <input
                        type="tel"
                        value={teammate.phone}
                        onChange={(e) => handleTeammateChange(idx, 'phone', e.target.value)}
                        placeholder="Phone (Optional)"
                        className="w-full mono-input-inset rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-white/30 font-['Outfit']"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION 4: PAYMENT & QR */}
          <div className="mono-card-surface p-6 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/[0.08]">
              <div className="mono-icon-btn w-8 h-8 bg-[#232938]">
                <QrCode className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="font-['Outfit'] font-extrabold text-base text-white">
                  4. Payment & Verification
                </h2>
                <p className="text-xs text-white/50 font-normal">
                  Official UPI payment for instant squad pass generation.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* QR Code Block */}
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

              {/* UTR Input */}
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-[#0A0D13] border border-white/[0.08]">
                  <div className="flex justify-between items-center text-xs font-['Outfit']">
                    <span className="text-white/60">Squad Challenge:</span>
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
              className="btn-mono-accent px-8 py-3.5 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isSubmitting ? 'Issuing Pass...' : 'Issue Squad Pass'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
