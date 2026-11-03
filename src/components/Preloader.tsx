import React, { useEffect, useState } from 'react';
import gsap from 'gsap';
import { PreloaderFruitSvg, PreloaderFruitType } from './PreloaderFruits';

interface FruitConfig {
  type: PreloaderFruitType;
  top: string;
  size: number;
  rotation: number;
  animClass: string;
}

interface CurtainStrip {
  id: string;
  name: string;
  color: string;
  fruits: FruitConfig[];
}

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
        // 2. 5-color sliding curtain stagger reveal with fruits sliding inside them
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

  // 5 Color Strips paired with matching-coloured living botanical fruits
  const curtainStrips: CurtainStrip[] = [
    // 1. RED STRIP: Deep Heritage Burgundy with Red Fruits
    {
      id: 'strip-red',
      name: 'Red Botanical Harvest',
      color: '#8A1521',
      fruits: [
        { type: 'red-pomegranate', top: '14%', size: 78, rotation: -12, animClass: 'animate-fruit-float-1' },
        { type: 'beet-wheel', top: '38%', size: 72, rotation: 18, animClass: 'animate-fruit-float-2' },
        { type: 'pomegranate-arils', top: '62%', size: 68, rotation: -8, animClass: 'animate-fruit-float-3' },
        { type: 'red-apple', top: '84%', size: 76, rotation: 15, animClass: 'animate-fruit-float-4' },
      ],
    },
    // 2. ORANGE STRIP: Roasted Turmeric Amber with Orange Fruits
    {
      id: 'strip-orange',
      name: 'Orange Citrus Harvest',
      color: '#C8741B',
      fruits: [
        { type: 'orange-slice', top: '12%', size: 76, rotation: 14, animClass: 'animate-fruit-float-2' },
        { type: 'turmeric-root', top: '36%', size: 74, rotation: -22, animClass: 'animate-fruit-float-3' },
        { type: 'orange-wedge', top: '60%', size: 70, rotation: 25, animClass: 'animate-fruit-float-1' },
        { type: 'whole-orange', top: '86%', size: 78, rotation: -10, animClass: 'animate-fruit-float-4' },
      ],
    },
    // 3. YELLOW STRIP: Champagne Honey Gold with Golden/Yellow Fruits
    {
      id: 'strip-yellow',
      name: 'Golden Pineapple & Lemon Harvest',
      color: '#DDA74F',
      fruits: [
        { type: 'lemon-wheel', top: '15%', size: 76, rotation: -18, animClass: 'animate-fruit-float-3' },
        { type: 'pineapple-slice', top: '40%', size: 80, rotation: 12, animClass: 'animate-fruit-float-1' },
        { type: 'golden-turmeric', top: '64%', size: 70, rotation: -15, animClass: 'animate-fruit-float-4' },
        { type: 'lemon-wedge', top: '85%', size: 72, rotation: 20, animClass: 'animate-fruit-float-2' },
      ],
    },
    // 4. CREAM STRIP: Warm Linen with Green & Light Botanicals (Green Apple, Cucumber, Mint)
    {
      id: 'strip-cream',
      name: 'Crisp Green Apple & Mint Harvest',
      color: '#F2EADF',
      fruits: [
        { type: 'green-apple', top: '14%', size: 78, rotation: 14, animClass: 'animate-fruit-float-1' },
        { type: 'cucumber-wheel', top: '38%', size: 74, rotation: -16, animClass: 'animate-fruit-float-4' },
        { type: 'mint-leaf', top: '62%', size: 72, rotation: 28, animClass: 'animate-fruit-float-2' },
        { type: 'coconut-half', top: '84%', size: 80, rotation: -12, animClass: 'animate-fruit-float-3' },
      ],
    },
    // 5. OBSIDIAN STRIP: Midnight Noir with Dark Blackberries, Grapes & Blueberries
    {
      id: 'strip-obsidian',
      name: 'Midnight Dark Berry Harvest',
      color: '#0C0A09',
      fruits: [
        { type: 'blackberry', top: '16%', size: 76, rotation: -10, animClass: 'animate-fruit-float-4' },
        { type: 'dark-grapes', top: '40%', size: 80, rotation: 15, animClass: 'animate-fruit-float-2' },
        { type: 'purple-plum', top: '64%', size: 72, rotation: -20, animClass: 'animate-fruit-float-1' },
        { type: 'blueberries', top: '86%', size: 78, rotation: 12, animClass: 'animate-fruit-float-3' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 pointer-events-auto flex flex-col items-center justify-center overflow-hidden select-none">
      {/* 5-Column Sliding Curtains with Matching Color Fruits */}
      <div className="absolute inset-0 flex z-10 pointer-events-none">
        {curtainStrips.map((strip) => (
          <div
            key={strip.id}
            className="curtain-strip flex-1 h-full relative overflow-hidden will-change-transform"
            style={{ backgroundColor: strip.color }}
          >
            {/* Array of matching color animated fruits */}
            {strip.fruits.map((fruit, fIdx) => (
              <div
                key={fIdx}
                className={`absolute left-1/2 -translate-x-1/2 select-none pointer-events-none drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)] ${fruit.animClass}`}
                style={{
                  top: fruit.top,
                  transform: `translate(-50%, -50%) rotate(${fruit.rotation}deg)`,
                }}
              >
                <div className="transform scale-75 sm:scale-90 md:scale-100 transition-transform">
                  <PreloaderFruitSvg type={fruit.type} size={fruit.size} />
                </div>
              </div>
            ))}
          </div>
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
