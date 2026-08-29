import { useState, useEffect } from 'react';
import { RegistrationProvider } from './context/RegistrationContext';
import { PortalHeader } from './components/PortalHeader';
import { RegistrationPortal } from './components/RegistrationPortal';
import { PassVerificationView } from './components/PassVerificationView';

export function AppContent() {
  const [currentTab, setCurrentTab] = useState<'register' | 'verify'>('register');
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>(undefined);
  const [passIdParam, setPassIdParam] = useState<string | undefined>(undefined);

  useEffect(() => {
    const handleUrlState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash.toLowerCase();

      // Check event parameter
      const evParam = searchParams.get('event');
      if (evParam) {
        setSelectedEventId(evParam);
        setCurrentTab('register');
      }

      // Check pass verification parameter
      const pParam = searchParams.get('pass');
      if (pParam) {
        setPassIdParam(pParam);
        setCurrentTab('verify');
      } else if (hash.includes('pass/') || hash.includes('verify/')) {
        const parts = hash.split('/');
        if (parts[1]) {
          setPassIdParam(parts[1]);
          setCurrentTab('verify');
        }
      } else if (hash.includes('verify')) {
        setCurrentTab('verify');
      }
    };

    handleUrlState();
    window.addEventListener('popstate', handleUrlState);
    window.addEventListener('hashchange', handleUrlState);
    return () => {
      window.removeEventListener('popstate', handleUrlState);
      window.removeEventListener('hashchange', handleUrlState);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050608] text-[#E8E8EC] antialiased selection:bg-[#2563EB] selection:text-white flex flex-col justify-between">
      <div className="w-full">
        <PortalHeader
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        <main className="w-full py-6">
          {currentTab === 'register' ? (
            <RegistrationPortal initialEventId={selectedEventId} />
          ) : (
            <PassVerificationView initialPassId={passIdParam} />
          )}
        </main>
      </div>

      <footer className="w-full py-6 border-t border-white/10 text-center text-xs text-gray-500 font-mono no-print">
        <p>SRISHTI 2.7 • Dedicated Registration & Ticketing Host • St. Thomas College</p>
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
