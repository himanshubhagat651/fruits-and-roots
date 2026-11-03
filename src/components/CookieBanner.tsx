import React, { useState, useEffect } from 'react';
import { playPopSound, playChimeSound } from '../utils/audio';
import { useCart } from '../context/CartContext';
import { ShieldCheck, Check, X } from 'lucide-react';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
}

const STORAGE_KEY = 'fruits_roots_cookie_consent';

export const CookieBanner: React.FC = () => {
  const { showToast } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [showPolicy, setShowPolicy] = useState(false);

  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent has already been recorded
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      // Show banner gently after initial page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1400);
      return () => clearTimeout(timer);
    }

    // Global event listener to reopen settings from footer
    const handleOpenSettings = () => {
      setIsCustomizing(false);
      setShowPolicy(false);
      setIsOpen(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => window.removeEventListener('open-cookie-settings', handleOpenSettings);
  }, []);

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setIsOpen(false);
    setIsCustomizing(false);
    setShowPolicy(false);
  };

  const handleAcceptAll = () => {
    playChimeSound();
    saveConsent({
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    });
    showToast('Cookie preferences saved: All enabled.');
  };

  const handleRejectAll = () => {
    playPopSound();
    saveConsent({
      essential: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    });
    showToast('Non-essential cookies disabled.');
  };

  const handleSavePreferences = () => {
    playChimeSound();
    saveConsent({
      essential: true,
      analytics: preferences.analytics,
      marketing: preferences.marketing,
      timestamp: new Date().toISOString(),
    });
    showToast('Custom cookie settings updated.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-5 left-5 sm:bottom-6 sm:left-6 z-50 max-w-lg w-[calc(100vw-40px)] sm:w-[480px] animate-in fade-in slide-in-from-bottom-5 duration-300 select-none">
      <div className="bg-white rounded-[24px] p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.22)] border border-gray-100/80 text-gray-900 relative overflow-hidden backdrop-blur-xl">
        
        {/* Main Banner View (Exact Reference Image Style) */}
        {!isCustomizing && !showPolicy && (
          <div className="space-y-4">
            <div>
              <h3 className="font-sans font-bold text-base sm:text-lg text-gray-900 tracking-tight">
                Cookie Settings
              </h3>
              <p className="text-xs sm:text-[13px] text-gray-600 leading-relaxed font-sans mt-1.5">
                We use cookies to enhance your experience, analyze site traffic and deliver personalized content. Read our{' '}
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setShowPolicy(true);
                  }}
                  className="font-semibold text-gray-900 underline hover:text-brand-amber transition-colors cursor-pointer"
                >
                  Cookie Policy
                </button>
                .
              </p>
            </div>

            {/* Three Action Buttons Row */}
            <div className="grid grid-cols-3 gap-2.5 pt-1 font-sans">
              <button
                type="button"
                onClick={handleRejectAll}
                className="w-full py-2.5 px-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-900 font-medium text-xs sm:text-sm rounded-xl transition cursor-pointer text-center active:scale-98"
              >
                Reject all
              </button>

              <button
                type="button"
                onClick={() => {
                  playPopSound();
                  setIsCustomizing(true);
                }}
                className="w-full py-2.5 px-3 bg-[#F3F4F6] hover:bg-[#E5E7EB] text-gray-900 font-medium text-xs sm:text-sm rounded-xl transition cursor-pointer text-center active:scale-98"
              >
                Customize
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="w-full py-2.5 px-3 bg-[#0C0A09] hover:bg-black text-white font-medium text-xs sm:text-sm rounded-xl transition cursor-pointer text-center shadow-xs active:scale-98"
              >
                Accept all
              </button>
            </div>
          </div>
        )}

        {/* Customize Preferences View */}
        {isCustomizing && !showPolicy && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-sans font-bold text-base text-gray-900">
                Customize Preferences
              </h3>
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs">
              {/* Essential Cookies (Always Active) */}
              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="font-semibold text-gray-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-moss" />
                    <span>Strictly Necessary</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Required for bottle cart checkout, pin-code delivery, and secure sessions.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-[10px] font-mono font-bold shrink-0">
                  Always Active
                </span>
              </div>

              {/* Analytics & Performance Toggle */}
              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-gray-900 block">Performance &amp; Analytics</span>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Helps us measure site traffic and optimize chilled press room logistics.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }));
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                    preferences.analytics ? 'bg-brand-moss' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences.analytics ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Marketing & Personalization Toggle */}
              <div className="p-3 rounded-xl bg-gray-50 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-semibold text-gray-900 block">Personalized Offers</span>
                  <p className="text-[11px] text-gray-500 leading-snug">
                    Tailored seasonal harvest notifications and special subscriber codes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playPopSound();
                    setPreferences((prev) => ({ ...prev, marketing: !prev.marketing }));
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 shrink-0 cursor-pointer ${
                    preferences.marketing ? 'bg-brand-moss' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-transform ${
                      preferences.marketing ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Action Buttons in Customize View */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsCustomizing(false)}
                className="py-2 px-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-xs rounded-xl transition cursor-pointer"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="py-2 px-4 bg-[#0C0A09] hover:bg-black text-white font-medium text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Save choices</span>
              </button>
            </div>
          </div>
        )}

        {/* Read Cookie Policy Modal View */}
        {showPolicy && (
          <div className="space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <h3 className="font-sans font-bold text-base text-gray-900">
                Fruits &amp; Roots Cookie Policy
              </h3>
              <button
                type="button"
                onClick={() => setShowPolicy(false)}
                className="text-gray-400 hover:text-gray-700 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-2 text-xs font-sans text-gray-600 leading-relaxed pr-1 scrollbar-thin">
              <p>
                We believe in complete transparency. We only use cookies and local storage tokens to preserve your cart items, remember your Mumbai pin-code delivery zone, and understand general site performance.
              </p>
              <p>
                We never sell or distribute your private browsing data to third-party ad brokers. Your privacy is treated with the same uncompromising standard of purity as our raw botanical extracts.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPolicy(false)}
                className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium text-xs rounded-xl transition cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
