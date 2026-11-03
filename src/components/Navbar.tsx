import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playPopSound, playChimeSound, toggleSound } from '../utils/audio';
import { ShoppingBag, Sparkles, MapPin, Search, Menu, X, ShieldCheck, Volume2, VolumeX, ArrowRight } from 'lucide-react';

export const Navbar: React.FC<{ onSearchOpen: () => void }> = ({ onSearchOpen }) => {
  const { itemCount, subtotal, openCart, openQuiz, boxItems, boxTarget, setDeliveryMode, deliveryMode, zipCode, setZipCode } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [inputZip, setInputZip] = useState(zipCode);
  const [soundActive, setSoundActive] = useState(false);

  const handleZipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputZip.trim()) {
      setZipCode(inputZip.trim());
      setShowLocationModal(false);
      playPopSound();
    }
  };

  const handleAudioToggle = () => {
    const active = toggleSound();
    setSoundActive(active);
    if (active) playPopSound();
  };

  return (
    <>
      {/* Main Glassmorphic Sticky Header */}
      <header className="sticky top-0 z-40 bg-brand-cream/94 backdrop-blur-2xl border-b border-brand-950/10 transition-all duration-300 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo with Editorial Monogram */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                playPopSound();
              }}
              className="lg:hidden p-2 rounded-xl text-brand-950 hover:bg-brand-parchment transition"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <a
              href="#"
              onClick={() => playPopSound()}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-full bg-brand-950 flex items-center justify-center text-brand-gold shadow-md group-hover:scale-105 transition-transform duration-300 font-display font-black text-xl">
                &amp;
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl sm:text-3xl font-black tracking-tight text-brand-950 uppercase flex items-center gap-1 leading-none">
                  FRUITS <span className="text-brand-amber">&amp;</span> ROOTS
                </span>
                <span className="font-mono text-[9px] uppercase font-bold tracking-widest text-brand-600 mt-0.5">
                  RAW COLD-PRESSED BOTANICALS
                </span>
              </div>
            </a>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-mono font-bold tracking-wider uppercase text-brand-900">
            <a
              href="#catalog"
              onClick={() => playPopSound()}
              className="hover:text-brand-amber transition-colors"
            >
              THE MENU
            </a>
            <a
              href="#alchemy-journey"
              onClick={() => playPopSound()}
              className="hover:text-brand-amber transition-colors"
            >
              3D BOTTLE LAB
            </a>
            <a
              href="#botanical-vault"
              onClick={() => playPopSound()}
              className="hover:text-brand-amber transition-colors"
            >
              BOTANICAL VAULT
            </a>
            <a
              href="#horaires"
              onClick={() => playPopSound()}
              className="hover:text-[#8A1521] text-[#8A1521] font-black transition-colors flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#C8741B] animate-pulse" />
              <span>TIMINGS</span>
            </a>
            <a
              href="#cleanses"
              onClick={() => playPopSound()}
              className="hover:text-brand-amber transition-colors"
            >
              CLEANSE PLANS
            </a>
            <a
              href="#craft-faq"
              onClick={() => playPopSound()}
              className="hover:text-brand-amber transition-colors"
            >
              CRAFT FAQ
            </a>
            <button
              onClick={() => {
                openQuiz();
                playPopSound();
              }}
              className="flex items-center gap-1.5 text-brand-moss hover:text-brand-amber transition-colors group"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-gold group-hover:rotate-12 transition-transform" />
              <span>FLAVOUR QUIZ</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Fulfillment / Location Selector */}
            <button
              onClick={() => {
                setShowLocationModal(true);
                playPopSound();
              }}
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono font-bold text-brand-800 bg-white/90 hover:bg-white px-3.5 py-2 rounded-full border border-brand-950/15 transition shadow-xs"
              title="Change Delivery Location"
            >
              <MapPin className="w-3.5 h-3.5 text-brand-amber" />
              <span>{deliveryMode === 'pickup' ? 'MUMBAI FLAGSHIP' : `PIN ${zipCode}`}</span>
            </button>

            {/* Sound Toggle */}
            <button
              onClick={handleAudioToggle}
              className="p-2.5 rounded-full text-brand-800 hover:text-brand-950 hover:bg-brand-parchment transition"
              title="Toggle Sound"
            >
              {soundActive ? (
                <Volume2 className="w-4 h-4 text-brand-amber animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-brand-500" />
              )}
            </button>

            {/* Search Trigger */}
            <button
              onClick={() => {
                onSearchOpen();
                playPopSound();
              }}
              className="p-2.5 rounded-full text-brand-800 hover:text-brand-950 hover:bg-brand-parchment transition"
              aria-label="Search drinks"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Shopping Bag CTA */}
            <button
              onClick={() => {
                openCart();
                playChimeSound();
              }}
              className="relative flex items-center gap-2.5 bg-brand-950 hover:bg-brand-900 text-brand-cream px-4 sm:px-5 py-2.5 rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl active:scale-95 group font-mono"
              aria-label="Open Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 text-brand-gold group-hover:scale-110 transition-transform" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-brand-amber text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-brand-cream animate-bounce">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold hidden sm:inline">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-cream border-b border-brand-950/10 px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200 font-mono text-xs font-bold uppercase tracking-wider">
            <nav className="flex flex-col space-y-3 text-brand-900">
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-brand-950/10 hover:text-brand-amber"
              >
                THE MENU
              </a>
              <a
                href="#alchemy-journey"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-brand-950/10 hover:text-brand-amber"
              >
                3D BOTTLE LAB
              </a>
              <a
                href="#botanical-vault"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-brand-950/10 hover:text-brand-amber"
              >
                BOTANICAL VAULT
              </a>
              <a
                href="#horaires"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-brand-950/10 text-[#8A1521] font-black flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-[#C8741B]" />
                <span>PRESS ROOM TIMINGS</span>
              </a>
              <a
                href="#cleanses"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 border-b border-brand-950/10 hover:text-brand-amber"
              >
                CLEANSE PLANS
              </a>
              <a
                href="#craft-faq"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 hover:text-brand-amber"
              >
                CRAFT FAQ
              </a>
            </nav>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openQuiz();
                }}
                className="w-full py-3 rounded-xl bg-brand-sand/30 text-brand-950 font-bold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-brand-amber" />
                <span>TAKE FLAVOUR QUIZ</span>
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLocationModal(true);
                }}
                className="w-full py-3 rounded-xl bg-white border border-brand-950/15 text-brand-950 font-bold flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4 text-brand-amber" />
                <span>DELIVERY PIN: {zipCode}</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Location / Pincode Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-brand-cream rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-3xl border border-white/60">
            <div className="flex items-center justify-between pb-4 border-b border-brand-950/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-amber" />
                <h3 className="font-display text-xl font-bold text-brand-950 uppercase">
                  Delivery Pincode
                </h3>
              </div>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-1.5 rounded-full hover:bg-brand-parchment text-brand-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-xs font-mono text-brand-700 leading-relaxed">
                Choose fulfillment method. Daily morning press delivered cold at 2.2°C in insulated ice-cooled bags across Mumbai, Bengaluru, Delhi-NCR, Hyderabad &amp; Pune.
              </p>

              {/* Delivery Mode Radios */}
              <div className="grid grid-cols-2 gap-3 font-mono">
                <button
                  type="button"
                  onClick={() => setDeliveryMode('local-courier')}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    deliveryMode === 'local-courier'
                      ? 'border-brand-amber bg-brand-amber/10 text-brand-950 font-bold shadow-xs'
                      : 'border-brand-950/15 bg-white text-brand-700 hover:border-brand-950/30'
                  }`}
                >
                  <div className="text-[10px] font-bold text-brand-amber uppercase tracking-wider">DOORSTEP COURIER</div>
                  <div className="text-xs font-bold mt-0.5">Cold-Chain Delivery</div>
                  <div className="text-[10px] text-brand-500 mt-1">Refrigerated bag</div>
                </button>

                <button
                  type="button"
                  onClick={() => setDeliveryMode('pickup')}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    deliveryMode === 'pickup'
                      ? 'border-brand-amber bg-brand-amber/10 text-brand-950 font-bold shadow-xs'
                      : 'border-brand-950/15 bg-white text-brand-700 hover:border-brand-950/30'
                  }`}
                >
                  <div className="text-[10px] font-bold text-brand-moss uppercase tracking-wider">FLAGSHIP DISPENSARY</div>
                  <div className="text-xs font-bold mt-0.5">Bandra West Bar</div>
                  <div className="text-[10px] text-brand-500 mt-1">Ready in 20 mins</div>
                </button>
              </div>

              {deliveryMode !== 'pickup' && (
                <form onSubmit={handleZipSubmit} className="pt-2">
                  <label className="block text-xs font-mono font-bold text-brand-800 uppercase tracking-wider mb-1.5">
                    Enter Delivery Pincode
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputZip}
                      onChange={(e) => setInputZip(e.target.value)}
                      placeholder="e.g. 400050, 560038, 110057"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-brand-950/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-amber font-mono"
                    />
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-brand-950 hover:bg-brand-900 text-brand-cream text-xs font-mono font-bold rounded-xl transition"
                    >
                      UPDATE
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
