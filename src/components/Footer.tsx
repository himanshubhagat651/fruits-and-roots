import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { playChimeSound } from '../utils/audio';
import { ShieldCheck, Leaf, Heart, ArrowRight, MapPin, Phone, Sparkles } from 'lucide-react';

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

  return (
    <footer className="bg-brand-950 text-brand-parchment border-t border-brand-900 pt-20 pb-12 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Newsletter Signup Row */}
        <div className="bg-brand-900 rounded-3xl p-8 sm:p-14 border border-brand-800 flex flex-col lg:flex-row items-center justify-between gap-8 mb-20 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-amber/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-xl text-center lg:text-left space-y-2 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-gold flex items-center justify-center lg:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              <span>JOIN THE REFRIGERATED CIRCLE</span>
            </span>
            <h3 className="font-display text-3xl sm:text-5xl font-black text-brand-cream uppercase tracking-tight">
              Enjoy 15% off your first cold delivery.
            </h3>
            <p className="text-xs sm:text-sm text-brand-cream/80 font-normal">
              Plus seasonal Indian harvest announcements, cleanse protocols, and regenerative farming dispatches.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 max-w-md relative z-10">
            <input
              type="email"
              required
              placeholder="ENTER YOUR EMAIL..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-4 rounded-full bg-brand-950 border border-brand-700 text-brand-cream placeholder-brand-500 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-brand-amber w-full shadow-inner"
            />
            <button
              type="submit"
              className="px-8 py-4 rounded-full bg-brand-amber hover:bg-brand-gold text-brand-950 font-mono font-black text-xs uppercase tracking-wider transition-all shadow-xl hover:scale-105 active:scale-95 shrink-0 flex items-center justify-center gap-2"
            >
              <span>CLAIM 15%</span>
              <ArrowRight className="w-4 h-4 text-brand-950" />
            </button>
          </form>
        </div>

        {/* Main Footer Links Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-brand-900">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-cream text-brand-950 flex items-center justify-center font-display text-xl font-black shadow-md">
                &amp;
              </div>
              <span className="font-display text-2xl font-black text-brand-cream uppercase tracking-tight">
                FRUITS <span className="text-brand-amber">&amp;</span> ROOTS
              </span>
            </div>
            
            <p className="text-xs text-brand-cream/70 leading-relaxed max-w-sm font-normal">
              Dedicated to raw, unadulterated botanical living vitality. Cold hydraulic pressure extracts whole organic produce daily at our Mumbai Bandra Flagship press room. Zero thermal heat destruction.
            </p>

            <div className="pt-2 text-xs font-mono text-brand-cream/80 space-y-1.5 font-medium">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-amber" />
                <span>FLAGSHIP PRESS ROOM: PERRY CROSS RD, BANDRA WEST, MUMBAI 400050</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-amber" />
                <span>+91 (22) 2640-ROOTS (7668) • DAILY 6:30 AM – 9:00 PM IST</span>
              </p>
            </div>
          </div>

          {/* Column 1: Cold Menu */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-cream">
              THE COLD DISPENSARY
            </h4>
            <ul className="space-y-2 text-brand-cream/70">
              <li><a href="#catalog" className="hover:text-brand-gold transition">COLD-PRESSED JUICES</a></li>
              <li><a href="#catalog" className="hover:text-brand-gold transition">VELVET SMOOTHIES</a></li>
              <li><a href="#catalog" className="hover:text-brand-gold transition">22G PLANT PROTEIN</a></li>
              <li><a href="#cleanses" className="hover:text-brand-gold transition">MULTI-DAY PROTOCOLS</a></li>
              <li><a href="#catalog" className="hover:text-brand-gold transition">IMMUNITY SHOTS (60ML)</a></li>
              <li><a href="#horaires" className="hover:text-brand-gold transition">DISPENSARY TIMINGS</a></li>
            </ul>
          </div>

          {/* Column 2: Science & Architecture */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-cream">
              ARCHITECTURE &amp; CRAFT
            </h4>
            <ul className="space-y-2 text-brand-cream/70">
              <li><a href="#alchemy-journey" className="hover:text-brand-gold transition">3D BOTTLE LAB (WEBGL)</a></li>
              <li><a href="#botanical-vault" className="hover:text-brand-gold transition">BOTANICAL VAULT</a></li>
              <li><a href="#alchemy-journey" className="hover:text-brand-gold transition">15,000 PSI HYDRAULIC PRESS</a></li>
              <li><a href="#terroir" className="hover:text-brand-gold transition">INDIAN REGENERATIVE SOIL</a></li>
              <li><a href="#craft-faq" className="hover:text-brand-gold transition">CRAFT SECRETS &amp; FAQ</a></li>
              <li><a href="#craft-faq" className="hover:text-brand-gold transition">₹25 UPI BOTTLE DEPOSIT</a></li>
            </ul>
          </div>

          {/* Column 3: Standards */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="font-bold uppercase tracking-widest text-brand-cream">
              STANDARDS
            </h4>
            <ul className="space-y-2 text-brand-cream/70">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-brand-gold" /> FSSAI LIC NO. 10023022001489</li>
              <li className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5 text-brand-gold" /> ZERO SINGLE-USE PLASTIC</li>
              <li className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-brand-ruby" /> 1% FOR SOIL RESTORATION</li>
              <li className="flex items-center gap-1.5">ELECTRIC CHILLED VANS (2.2°C)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-brand-cream/60">
          <p>
            © {new Date().getFullYear()} FRUITS &amp; ROOTS BOTANICAL CO. ALL RIGHTS RESERVED. BOTTLED COLD AT 2.2°C • GSTIN 27AABCF1234F1Z5.
          </p>

          <div className="flex gap-6 text-xs text-brand-cream/60">
            <a href="#" className="hover:text-brand-cream">PRIVACY</a>
            <a href="#" className="hover:text-brand-cream">TERMS</a>
            <a href="#" className="hover:text-brand-cream">FSSAI COMPLIANCE</a>
            <a href="#" className="hover:text-brand-cream">CIRCULARITY</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
