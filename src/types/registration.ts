export interface TeammateInfo {
  name: string;
  email?: string;
  phone?: string;
  college?: string;
  department?: string;
  year?: string;
}

export interface EventItem {
  id: string;
  number: string;
  stageLabel: string;
  title: string;
  category: string;
  eventType: 'solo' | 'team';
  teamSize?: string; // e.g. "Squad of 4", "Team (Max 4)", "Solo", "Duo / Solo"
  minTeamSize?: number;
  maxTeamSize?: number;
  highlightText: string;
  description: string;
  time: string;
  venue: string;
  prize: string;
  tags: string[];
  color: string;
  bgGradient: string;
  image: string;
  fee: number; // in INR (0 for free)
  isParticipating?: boolean;
  day?: 'dec-4' | 'dec-5';
  dayLabel?: string;
  subtitle?: string;
  locationId?: string;
  speaker?: {
    name: string;
    role: string;
  };
  highlights?: string[];
  side?: 'left' | 'right';
}

export interface RegistrationRecord {
  id: string;
  passId: string;
  securityHash: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  teamName?: string;
  isTeamRegistration?: boolean;
  teammates?: TeammateInfo[];
  selectedEventIds: string[];
  selectedEventNames: string[];
  totalFee: number;
  paymentUtr: string;
  paymentScreenshotUrl?: string;
  paymentStatus: 'Pending Verification' | 'Payment Verified' | 'Rejected';
  checkInStatus: 'Not Checked In' | 'Checked In';
  registeredAt: string;
  // Super Admin Security & Telemetry Metadata
  ipAddress?: string;
  deviceInfo?: string;
  locationInfo?: string;
  screenResolution?: string;
  ispProvider?: string;
  cpuCores?: string;
  deviceMemory?: string;
  connectionType?: string;
  languageTimezone?: string;
  userAgentRaw?: string;
}

export interface SystemSettings {
  upiId: string;
  upiQrImage: string;
  contactEmail: string;
  contactPhone: string;
  collegeName: string;
  cloudDbUrl: string;
  mainSiteUrl: string;
}

