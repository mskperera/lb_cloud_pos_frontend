// src/components/CookieConsentBanner.jsx
import { useEffect, useState } from 'react';
import CookieConsent, { Cookies, getCookieConsentValue } from 'react-cookie-consent';

const CookieConsentBanner = () => {
  const [showSettings, setShowSettings] = useState(false);

  // Force banner to re-appear when user wants to change settings
  const openConsentDialog = () => {
    Cookies.remove('legendpos_cookie_consent'); // or your cookie name
    setShowSettings(true);
    window.location.reload(); // simplest way – banner will show again
    // Alternative: if you want to avoid reload → use state + custom modal logic
  };

  useEffect(() => {
    const consent = getCookieConsentValue();
    if (consent === 'true') {
      // load analytics / marketing scripts here
      console.log('Analytics loaded (user consented)');
    }
  }, []);

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Reject All"
        cookieName="legendpos_cookie_consent"
        style={{ background: '#1e293b', color: '#f1f5f9', fontSize: '15px' }}
        buttonStyle={{
          backgroundColor: '#0ea5e9',
          color: 'white',
          fontSize: '14px',
          borderRadius: '8px',
          padding: '12px 24px',
        }}
        declineButtonStyle={{
          backgroundColor: 'transparent',
          color: '#94a3b8',
          border: '1px solid #94a3b8',
          borderRadius: '8px',
          padding: '12px 24px',
        }}
        enableDeclineButton
        flipButtons // Decline button appears first (better for GDPR)
        expires={365}
        overlay
        // debug={true} // ← useful during development
      >
        We use cookies to improve your experience and analyze site usage.{' '}
        <a
          href="/cookie-policy"
          className="underline font-medium text-sky-300 hover:text-sky-200"
        >
          Cookie Policy
        </a>
      </CookieConsent>

      {/* Floating button – always visible after first interaction */}
      {getCookieConsentValue() !== undefined && (
        <button
          onClick={openConsentDialog}
          className="fixed bottom-6 left-6 z-[1000] bg-slate-800 hover:bg-slate-700 text-white text-sm px-5 py-3 rounded-full shadow-xl transition-all flex items-center gap-2"
          title="Change cookie preferences"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          Cookie Settings
        </button>
      )}
    </>
  );
};

export default CookieConsentBanner;