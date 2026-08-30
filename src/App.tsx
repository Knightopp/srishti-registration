import { useState, useEffect } from 'react';
import { RegistrationProvider, useRegistration } from './context/RegistrationContext';
import { AtmosphericBackground } from './components/AtmosphericBackground';
import { PortalHeader } from './components/PortalHeader';
import { EventTypeModal } from './components/EventTypeModal';
import { TeamEventsView } from './components/TeamEventsView';
import { TeamEventRegistration } from './components/TeamEventRegistration';
import { SoloEventsView } from './components/SoloEventsView';
import { SoloEventRegistration } from './components/SoloEventRegistration';
import { DigitalPassView } from './components/DigitalPassView';
import { PassVerificationView } from './components/PassVerificationView';
import { EventItem, RegistrationRecord } from './types/registration';

export function AppContent() {
  const { events } = useRegistration();

  const [currentTab, setCurrentTab] = useState<'register' | 'verify'>('register');
  const [eventMode, setEventMode] = useState<'solo' | 'team'>('team');
  const [showModeModal, setShowModeModal] = useState(true);

  // Selected event for dedicated registration page
  const [selectedTeamEvent, setSelectedTeamEvent] = useState<EventItem | null>(null);
  const [selectedSoloEvent, setSelectedSoloEvent] = useState<EventItem | null>(null);

  // Issued pass state for immediate display
  const [generatedPass, setGeneratedPass] = useState<RegistrationRecord | null>(null);
  const [passIdParam, setPassIdParam] = useState<string | undefined>(undefined);

  // URL state synchronization
  useEffect(() => {
    const handleUrlState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();

      // Check pass verification parameter
      const pParam = searchParams.get('pass');
      if (pParam) {
        setPassIdParam(pParam);
        setCurrentTab('verify');
        setShowModeModal(false);
        return;
      } else if (hash.includes('pass/') || hash.includes('verify/')) {
        const parts = hash.split('/');
        if (parts[1]) {
          setPassIdParam(parts[1]);
          setCurrentTab('verify');
          setShowModeModal(false);
          return;
        }
      } else if (hash.includes('verify')) {
        setCurrentTab('verify');
        setShowModeModal(false);
        return;
      }

      // Check mode parameter
      const mParam = searchParams.get('mode');
      if (mParam === 'solo' || mParam === 'team') {
        setEventMode(mParam);
        setShowModeModal(false);
      }

      // Check event parameter
      const evParam = searchParams.get('event');
      if (evParam) {
        const match = events.find((e) => e.id.toLowerCase() === evParam.toLowerCase());
        if (match) {
          if (match.eventType === 'team') {
            setEventMode('team');
            setSelectedTeamEvent(match);
            setSelectedSoloEvent(null);
          } else {
            setEventMode('solo');
            setSelectedSoloEvent(match);
            setSelectedTeamEvent(null);
          }
          setShowModeModal(false);
          setCurrentTab('register');
        }
      }
    };

    handleUrlState();
    window.addEventListener('popstate', handleUrlState);
    window.addEventListener('hashchange', handleUrlState);
    return () => {
      window.removeEventListener('popstate', handleUrlState);
      window.removeEventListener('hashchange', handleUrlState);
    };
  }, [events]);

  const handleSelectMode = (mode: 'solo' | 'team') => {
    setEventMode(mode);
    setShowModeModal(false);
    setSelectedTeamEvent(null);
    setSelectedSoloEvent(null);
    setGeneratedPass(null);
    setCurrentTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectTeamEvent = (event: EventItem) => {
    setSelectedTeamEvent(event);
    setSelectedSoloEvent(null);
    setGeneratedPass(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSoloEvent = (event: EventItem) => {
    setSelectedSoloEvent(event);
    setSelectedTeamEvent(null);
    setGeneratedPass(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePassGenerated = (pass: RegistrationRecord) => {
    setGeneratedPass(pass);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetRegistration = () => {
    setGeneratedPass(null);
    setSelectedTeamEvent(null);
    setSelectedSoloEvent(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen bg-transparent text-[#E8E8EC] antialiased selection:bg-[#2563EB] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Signature Atmospheric Background */}
      <AtmosphericBackground />

      {/* Dual Box Popup Modal (Top & Bottom sliding boxes) */}
      <EventTypeModal
        isOpen={showModeModal && currentTab === 'register' && !generatedPass}
        onClose={() => setShowModeModal(false)}
        onSelectType={handleSelectMode}
      />

      <div className="relative z-10 w-full">
        {/* Short, compact header navbar */}
        <PortalHeader
          currentTab={currentTab}
          eventMode={eventMode}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            if (tab === 'register') {
              setGeneratedPass(null);
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenModeModal={() => setShowModeModal(true)}
        />

        <main className="w-full pb-12">
          {/* TAB 1: PASS VERIFICATION */}
          {currentTab === 'verify' && (
            <PassVerificationView initialPassId={passIdParam} />
          )}

          {/* TAB 2: REGISTRATION FLOWS */}
          {currentTab === 'register' && (
            <>
              {/* If a pass was just generated, show the digital pass card */}
              {generatedPass ? (
                <DigitalPassView
                  record={generatedPass}
                  onNewRegistration={handleResetRegistration}
                />
              ) : selectedTeamEvent ? (
                /* Dedicated Team Event Registration Page */
                <TeamEventRegistration
                  event={selectedTeamEvent}
                  onBack={() => setSelectedTeamEvent(null)}
                  onPassGenerated={handlePassGenerated}
                />
              ) : selectedSoloEvent ? (
                /* Dedicated Solo Event Registration Page */
                <SoloEventRegistration
                  event={selectedSoloEvent}
                  onBack={() => setSelectedSoloEvent(null)}
                  onPassGenerated={handlePassGenerated}
                />
              ) : eventMode === 'team' ? (
                /* Team Events Showcase Catalog */
                <TeamEventsView
                  onSelectEvent={handleSelectTeamEvent}
                  onSwitchToSolo={() => handleSelectMode('solo')}
                  onOpenModeModal={() => setShowModeModal(true)}
                />
              ) : (
                /* Solo Events Showcase Catalog */
                <SoloEventsView
                  onSelectEvent={handleSelectSoloEvent}
                  onSwitchToTeam={() => handleSelectMode('team')}
                  onOpenModeModal={() => setShowModeModal(true)}
                />
              )}
            </>
          )}
        </main>
      </div>

      <footer className="w-full py-8 border-t border-white/[0.08] text-center font-['IBM_Plex_Mono'] text-xs text-white/30 no-print">
        <p>SRISHTI 2.7 • December 4–5, 2026 • St. Thomas College, Thrissur</p>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <RegistrationProvider>
      <AppContent />
    </RegistrationProvider>
  );
}

export default App;
