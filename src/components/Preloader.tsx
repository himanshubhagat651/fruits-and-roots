import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

interface CurtainStrip {
  id: string;
  name: string;
  color: string;
}

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [currentText, setCurrentText] = useState('Harvesting Organic Produce...');

  useEffect(() => {
    const texts = [
      'Harvesting Organic Indian Produce...',
      'Cold-Pressing Under Gentle Pressure...',
      'Preserving Active Living Nutrients...',
      'Chilling to 2.2°C in Reusable Glass...',
      'Fruits & Roots Ready.'
    ];

    let count = 0;
    const interval = setInterval(() => {
      count += 1.5;
      const current = Math.min(100, Math.floor(count));
      setPercent(current);

      const textIdx = Math.min(texts.length - 1, Math.floor((current / 100) * texts.length));
      setCurrentText(texts[textIdx]);

      if (current >= 100) {
        clearInterval(interval);
        const tl = gsap.timeline({
          onComplete: () => {
            onComplete();
          }
        });

        // 1. Fade kinetic brand content
        tl.to('.preloader-content', {
          opacity: 0,
          y: -30,
          duration: 0.45,
          ease: 'power3.inOut'
        })
        // 2. 5-color sliding curtain stagger reveal
        .to('.curtain-strip', {
          yPercent: -100,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power4.inOut'
        }, '-=0.15');
      }
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  // 5 Iconic brand color strips
  const curtainStrips: CurtainStrip[] = [
    { id: 'strip-red', name: 'Ruby Beet Red', color: '#8A1521' },
    { id: 'strip-orange', name: 'Turmeric Amber', color: '#C8741B' },
    { id: 'strip-yellow', name: 'Golden Honey', color: '#DDA74F' },
    { id: 'strip-cream', name: 'Warm Cream Parchment', color: '#F2EADF' },
    { id: 'strip-obsidian', name: 'Midnight Charcoal Noir', color: '#0C0A09' },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex flex-col items-center justify-center overflow-hidden select-none">
      {/* 5-Column Sliding Curtains */}
      <div className="absolute inset-0 flex z-10 pointer-events-none">
        {curtainStrips.map((strip) => (
          <div
            key={strip.id}
            className="curtain-strip flex-1 h-full relative overflow-hidden will-change-transform"
            style={{ backgroundColor: strip.color }}
          />
        ))}
      </div>

      {/* Center Kinetic Content with Soft Glassmorphic Backdrop for 100% Legibility */}
      <div className="preloader-content relative z-20 flex flex-col items-center text-center px-6 py-8 rounded-[36px] bg-brand-950/40 backdrop-blur-md border border-white/10 shadow-2xl max-w-lg mx-4">
        {/* Animated Bloom Monogram */}
        <div className="relative mb-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-brand-cream/30 flex items-center justify-center animate-spin-slow">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-brand-amber/60 animate-pulse" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center font-display text-3xl font-black text-brand-cream">
            &amp;
          </div>
        </div>

        {/* Brand Name Typography */}
        <div className="space-y-1">
          <h2 className="font-display text-3xl sm:text-5xl font-black text-brand-cream tracking-tight uppercase">
            FRUITS <span className="text-brand-amber">&amp;</span> ROOTS
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-brand-gold font-bold">
            RAW COLD-PRESSED BOTANICAL ELIXIRS &bull; MUMBAI
          </p>
        </div>

        {/* Progress Bar & Numeric Ticker */}
        <div className="w-64 sm:w-80 mt-7 space-y-2.5">
          <div className="flex justify-between items-baseline text-xs font-mono">
            <span className="text-brand-cream/90 text-[11px] truncate pr-2 font-medium">{currentText}</span>
            <span className="text-brand-gold font-black text-sm">{percent}%</span>
          </div>

          <div className="w-full bg-black/50 h-2 rounded-full overflow-hidden border border-white/20 backdrop-blur-sm p-0.5">
            <div
              className="h-full bg-gradient-to-r from-brand-amber via-brand-gold to-white transition-all duration-75 ease-out rounded-full shadow-[0_0_14px_rgba(221,167,79,0.95)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
