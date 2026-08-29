import React, { createContext, useContext, useState, useEffect } from 'react';
import { RegistrationRecord, EventItem, SystemSettings } from '../types/registration';
import { DEFAULT_EVENTS, DEFAULT_SETTINGS } from '../data/initialEvents';

interface RegistrationContextType {
  registrations: RegistrationRecord[];
  events: EventItem[];
  settings: SystemSettings;
  cloudStatus: 'synced' | 'syncing' | 'offline' | 'local';
  addRegistration: (reg: Omit<RegistrationRecord, 'id' | 'passId' | 'securityHash' | 'registeredAt' | 'paymentStatus' | 'checkInStatus'>) => RegistrationRecord;
  updateRegistrationStatus: (id: string, paymentStatus: RegistrationRecord['paymentStatus'], checkInStatus?: RegistrationRecord['checkInStatus']) => void;
  deleteRegistration: (id: string) => void;
  getRegistrationByPassId: (passId: string) => RegistrationRecord | undefined;
  syncWithCloud: () => Promise<boolean>;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events] = useState<EventItem[]>(DEFAULT_EVENTS);
  const [settings] = useState<SystemSettings>(() => {
    try {
      const saved = localStorage.getItem('srishti_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [registrations, setRegistrations] = useState<RegistrationRecord[]>(() => {
    try {
      const saved = localStorage.getItem('srishti_registrations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [cloudStatus, setCloudStatus] = useState<'synced' | 'syncing' | 'offline' | 'local'>('local');

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem('srishti_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.error('Failed to save registrations locally:', e);
    }
  }, [registrations]);

  const syncWithCloud = async (): Promise<boolean> => {
    if (!settings.cloudDbUrl) return false;
    setCloudStatus('syncing');
    try {
      const res = await fetch(settings.cloudDbUrl + '?action=get_registrations', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.registrations && Array.isArray(data.registrations)) {
          setRegistrations(data.registrations);
          setCloudStatus('synced');
          return true;
        }
      }
      setCloudStatus('synced');
      return true;
    } catch {
      setCloudStatus('local');
      return false;
    }
  };

  const addRegistration = (
    regData: Omit<RegistrationRecord, 'id' | 'passId' | 'securityHash' | 'registeredAt' | 'paymentStatus' | 'checkInStatus'>
  ): RegistrationRecord => {
    const rawRandom = Math.floor(100000 + Math.random() * 900000).toString();
    const passId = `SR27-${rawRandom}`;
    const securityHash = `V27-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;

    const newRecord: RegistrationRecord = {
      ...regData,
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      passId,
      securityHash,
      paymentStatus: 'Payment Verified',
      checkInStatus: 'Not Checked In',
      registeredAt: new Date().toISOString(),
    };

    const next = [newRecord, ...registrations];
    setRegistrations(next);

    // Background push to Google Apps Script cloud db if configured
    if (settings.cloudDbUrl) {
      try {
        fetch(settings.cloudDbUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_registration',
            record: newRecord,
          }),
        }).catch(() => {});
      } catch {}
    }

    return newRecord;
  };

  const updateRegistrationStatus = (
    id: string,
    paymentStatus: RegistrationRecord['paymentStatus'],
    checkInStatus?: RegistrationRecord['checkInStatus']
  ) => {
    const next = registrations.map((r) => {
      if (r.id === id) {
        return {
          ...r,
          paymentStatus,
          checkInStatus: checkInStatus || r.checkInStatus,
        };
      }
      return r;
    });
    setRegistrations(next);
  };

  const deleteRegistration = (id: string) => {
    const next = registrations.filter((r) => r.id !== id);
    setRegistrations(next);
  };

  const getRegistrationByPassId = (passId: string) => {
    const cleanId = passId.toLowerCase().trim();
    return registrations.find((r) => r.passId.toLowerCase().trim() === cleanId);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrations,
        events,
        settings,
        cloudStatus,
        addRegistration,
        updateRegistrationStatus,
        deleteRegistration,
        getRegistrationByPassId,
        syncWithCloud,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  return context;
};
