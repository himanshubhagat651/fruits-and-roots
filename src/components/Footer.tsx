import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playChimeSound } from '../utils/audio';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      playChimeSound();
      showToast('Welcome to the Fruits & Roots Club! 15% off code sent to your inbox.');
      setEmail('');
    }
  };

  const NAV_LINKS = [
    { label: 'Shop Fresh Juices', href: '#catalog' },
    { label: 'Our Cold-Press Process', href: '#our-process' },
    { label: 'Living Terroir & Soil', href: '#terroir' },
    { label: 'Dispensary Hours', href: '#horaires' },
    { label: 'Cleanse Protocols', href: '#cleanses' },
    { label: 'Contact Atelier', href: '#contact' },
  ];

  const SOCIAL_LINKS = [
    { name: 'Instagram', href: 'https://instagram.com' },
    { name: 'WhatsApp Concierge', href: 'https://whatsapp.com' },
    { name: 'Spotify Atelier Sounds', href: 'https://spotify.com' },
    { name: 'Strava Run Club', href: 'https://strava.com' },
    { name: 'Botanical Journal', href: '#terroir' },
  ];

  const LEGAL_LINKS = [
    { name: 'Terms of Service', href: '#' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'FSSAI Lic. #10023022001489', href: '#' },
    { name: '₹25 Bottle Return Policy', href: '#terroir' },
    { name: 'Cookie Preferences', href: '#' },
  ];

  return (
    <footer className="bg-[#0C0A09] text-[#FAF6EE] relative overflow-hidden select-none border-t border-white/[0.08]">
      {/* Background Monumental Brand Watermark (Kudos Style) */}
      <div className="absolute top-0 inset-x-0 flex justify-center pointer-events-none select-none opacity-[0.035] overflow-hidden whitespace-nowrap leading-none">
        <span className="font-display text-[15vw] font-black uppercase tracking-tight text-white">
          FRUITS &amp; ROOTS
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 pt-20 sm:pt-28 pb-12 relative z-10">
        
        {/* Main Grid: Left Manifesto & Contact / Right Navigation & Sub-columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">
          
          {/* Left Column: Manifesto, Origin & Direct Contact */}
          <div className="lg:col-span-7 lg:pr-16 space-y-10 sm:space-y-12">
            
            {/* Top Manifesto Statement with Highlighted Words */}
            <p className="text-2xl sm:text-3xl md:text-4xl text-white/45 leading-[1.25] font-sans font-normal tracking-tight max-w-xl">
              We choose{' '}
              <strong className="text-white font-bold">cold extraction over fast blades</strong>{' '}
              and{' '}
              <strong className="text-white font-bold">living Indian soil over commercial yield</strong>,{' '}
              because honest nutrition begins with{' '}
              <strong className="text-white font-bold">pure botanical respect</strong>.
            </p>

            {/* Atelier Meta Info */}
            <div className="space-y-1 font-mono text-xs uppercase tracking-[0.2em] text-white/40">
              <div>Cold-Pressed Botanical Atelier</div>
              <div>Based in Bandra West, Mumbai, IN</div>
            </div>

            {/* Large Primary Contact */}
            <div className="space-y-2 pt-2 sm:pt-4">
              <a
                href="mailto:hello@fruitsandroots.in"
                className="text-3xl sm:text-4xl md:text-5xl font-sans font-bold text-white hover:text-brand-amber transition-colors tracking-tight block"
              >
                hello@fruitsandroots.in
              </a>

              <div className="flex flex-wrap items-center gap-3 font-mono text-xs sm:text-sm text-white/60 pt-1">
                <a
                  href="tel:+919820144829"
                  className="hover:text-white transition-colors"
                >
                  (+91) 98201 44829
                </a>
                <span className="text-white/20">&bull;</span>
                <span>Flagship Press Room Daily 6:30 AM – 9:00 PM IST</span>
              </div>
            </div>

            {/* Minimalist Newsletter Signup */}
            <div className="pt-2 max-w-md">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-gold font-bold mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
                <span>Refrigerated Circle &bull; 15% Off First Delivery</span>
              </div>
              <form
                onSubmit={handleSubscribe}
                className="flex items-center border-b border-white/20 focus-within:border-brand-amber transition-colors pb-2"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-sm text-white placeholder-white/35 focus:outline-none w-full font-sans pr-4"
                />
                <button
                  type="submit"
                  className="text-brand-amber font-mono text-xs font-bold uppercase tracking-widest hover:text-white transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

          {/* Right Column: Menu Navigation & Sub-columns */}
          <div className="lg:col-span-5 lg:pl-16 lg:border-l lg:border-white/[0.08] flex flex-col justify-between space-y-10 sm:space-y-12">
            
            {/* Top Primary Navigation Menu (With right-aligned colon) */}
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between text-xl sm:text-2xl font-sans font-medium text-white hover:text-brand-amber transition-all duration-200 py-2.5 group cursor-pointer"
                >
                  <span className="group-hover:translate-x-1.5 transition-transform duration-200">
                    {link.label}
                  </span>
                  <span className="font-mono text-white/30 group-hover:text-brand-amber group-hover:translate-x-1 transition-all duration-200">
                    :
                  </span>
                </a>
              ))}
            </nav>

            {/* Bottom Sub-columns: Social & Legal */}
            <div className="border-t border-white/[0.08] pt-8 grid grid-cols-2 gap-8">
              
              {/* Social Media Column */}
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 block font-semibold">
                  Social media
                </span>
                <ul className="space-y-2 text-sm font-sans text-white/70">
                  {SOCIAL_LINKS.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-white transition-colors block"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal & Standards Column */}
              <div className="space-y-3">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/40 block font-semibold">
                  Legal &amp; Safety
                </span>
                <ul className="space-y-2 text-sm font-sans text-white/70">
                  {LEGAL_LINKS.map((item) => (
                    <li key={item.name}>
                      <a
                        href={item.href}
                        className="hover:text-white transition-colors block"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

        </div>

        {/* Bottom Bar: Copyright & Location Badge */}
        <div className="border-t border-white/[0.08] pt-8 mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/40">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded-full bg-white/10 text-white flex items-center justify-center font-serif font-black text-[10px]">
              &amp;
            </div>
            <span>&copy; {new Date().getFullYear()} Fruits &amp; Roots Botanicals Co. All rights reserved.</span>
          </div>

          <div className="text-center sm:text-right text-white/50">
            Cold-Pressed Daily in Bandra West, Mumbai &bull; Delivered Chilled at 2.2&deg;C
          </div>
        </div>

      </div>
    </footer>
  );
};
