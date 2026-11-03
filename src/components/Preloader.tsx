import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

export const Preloader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0);
  const [currentText, setCurrentText] = useState('Harvesting Organic Produce...');

  useEffect(() => {
    const texts = [
      'Harvesting Organic Indian Produce...',
      'Cold-Pressing Under 15,000 PSI...',
      'Preserving Active Living Enzymes...',
      'Chilling to 2.2°C in Borosilicate Glass...',
      'Fruits & Roots Ready.'
    ];

    let count = 0;
    const interval = setInterval(() => {
      count += 2;
      setPercent(Math.min(100, count));

      const textIdx = Math.min(texts.length - 1, Math.floor((count / 100) * texts.length));
      setCurrentText(texts[textIdx]);

      if (count >= 100) {
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
        // 2. Bar Topas 5-color sliding curtain stagger reveal
        .to('.curtain-strip', {
          yPercent: -100,
          duration: 0.85,
          stagger: 0.07,
          ease: 'power4.inOut'
        }, '-=0.15');
      }
    }, 24);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Bar Topas 5-curtain color palette (Harmonious Warmth)
  const curtainColors = [
    '#8A1521', // Deep Heritage Burgundy
    '#C8741B', // Warm Roasted Turmeric Amber
    '#DDA74F', // Champagne Honey Gold
    '#F2EADF', // Warm Linen Parchment
    '#0C0A09', // Deep Obsidian Espresso Noir
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex flex-col items-center justify-center overflow-hidden">
      {/* Bar Topas 5-Column Sliding Curtains */}
      <div className="absolute inset-0 flex z-10 pointer-events-none">
        {curtainColors.map((color, idx) => (
          <div
            key={idx}
            className="curtain-strip flex-1 h-full"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      {/* Center Kinetic Content */}
      <div className="preloader-content relative z-20 flex flex-col items-center text-center px-4">
        {/* Animated Bloom Monogram */}
        <div className="relative mb-6">
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
          <p className="text-xs font-mono uppercase tracking-widest text-brand-gold">
            RAW COLD-PRESSED BOTANICAL ELIXIRS • MUMBAI
          </p>
        </div>

        {/* Progress Bar & Numeric Ticker */}
        <div className="w-64 sm:w-80 mt-8 space-y-2">
          <div className="flex justify-between items-baseline text-xs font-mono">
            <span className="text-brand-cream/80 text-[11px] truncate pr-2">{currentText}</span>
            <span className="text-brand-gold font-black text-sm">{percent}%</span>
          </div>

          <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-white/10 backdrop-blur-sm">
            <div
              className="h-full bg-gradient-to-r from-brand-amber via-brand-gold to-white transition-all duration-75 ease-out rounded-full shadow-[0_0_12px_rgba(221,167,79,0.9)]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
