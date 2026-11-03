import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { JourneyBottle3D } from './JourneyBottle3D';
import { playPopSound, playChimeSound } from '../utils/audio';
import { Zap, RotateCcw, Droplet, ArrowDown, Sparkles } from 'lucide-react';

interface StoryStage {
  step: string;
  title: string;
  headline: string;
  description: string;
  stats: { label: string; value: string }[];
  liquidPercent: number;
  liquidColor: string;
  pressure: string;
  temp: string;
}

const STAGES: StoryStage[] = [
  {
    step: '01',
    title: 'THE LIVING HARVEST',
    headline: '1.5 to 2.2 Kilograms of Living Soil Nutrition.',
    description: 'Every sunrise, hand-harvested regenerative organic produce arrives at our Bandra West press room from Meghalaya, Wayanad, Kashmir, and Konkan belts. Never frozen, never chemically preserved.',
    stats: [
      { label: 'Raw Produce / Bottle', value: '1.8 kg' },
      { label: 'Soil Health Score', value: '98/100' },
      { label: 'Farm Traceability', value: '100% Single Origin' },
    ],
    liquidPercent: 25,
    liquidColor: '#FFA826',
    pressure: '1 ATM (Ambient)',
    temp: '5.5°C (Farm Gate)',
  },
  {
    step: '02',
    title: '15,000 PSI HYDRAULIC PRESS',
    headline: 'Immense Pressure. Zero Destructive Heat.',
    description: 'Traditional centrifuges spin at 10,000 RPM, cooking delicate vitamins with friction heat. Our mammoth hydraulic press applies 15,000 PSI of pure crushing force to squeeze every drop of cellular nectar intact.',
    stats: [
      { label: 'Hydraulic Pressure', value: '15,000 PSI' },
      { label: 'Friction Heat Generated', value: '0.0°C' },
      { label: 'Cellular Yield', value: '94.8%' },
    ],
    liquidPercent: 55,
    liquidColor: '#2E6F40',
    pressure: '15,000 PSI Active',
    temp: '3.3°C (Controlled)',
  },
  {
    step: '03',
    title: 'NON-THERMAL HPP PRESERVATION',
    headline: 'Active Enzymes & Phytonutrients Survive.',
    description: 'Submerged under hyperbaric cold water pressure to neutralise unwanted microorganisms without thermal shock. Living Vitamins C, A, active probiotics, and polyphenols remain alive and bioavailable.',
    stats: [
      { label: 'Active Live Enzymes', value: '100%' },
      { label: 'Sugar Added', value: '0g' },
      { label: 'Water Dilution', value: '0.0%' },
    ],
    liquidPercent: 85,
    liquidColor: '#932839',
    pressure: '87,000 PSI Hyperbaric',
    temp: '2.5°C (Cryo Chill)',
  },
  {
    step: '04',
    title: 'BOROSILICATE GLASS & HERMETIC SEAL',
    headline: 'Pure Glass. Zero Plastic Leaching.',
    description: 'Sealed cold in 100% recyclable, UV-protective glass bottles with an airtight hermetic brass crown. Hand 6 clean bottles to your delivery rider for ₹150 instant UPI cashback.',
    stats: [
      { label: 'Single-Use Plastic', value: '0%' },
      { label: 'Bottle Return Credit', value: '₹25/ea' },
      { label: 'Chilled Shelf Life', value: '45 Days' },
    ],
    liquidPercent: 96,
    liquidColor: '#DDA74F',
    pressure: 'Hermetic Vacuum',
    temp: '2.2°C (Doorstep)',
  },
];

export const PinnedBottleJourney: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [scrubProgress, setScrubProgress] = useState(0);
  const [interpolatedLiquid, setInterpolatedLiquid] = useState(25);

  const activeStage = STAGES[currentStageIdx];

  // Henrietta Said Pinned GSAP ScrollTrigger Integration
  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const p = self.progress;
          setScrubProgress(p);

          // Calculate stage (0, 1, 2, 3) with clean thresholds
          const stage = Math.min(3, Math.floor(p * 3.99));
          setCurrentStageIdx(stage);

          // Smooth continuous liquid interpolation across the scroll
          const liquid = 25 + p * (96 - 25);
          setInterpolatedLiquid(Math.round(liquid));
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Smooth scroll jump to exact stage when clicking stage pill
  const scrollToStage = (idx: number) => {
    if (!containerRef.current) return;
    playPopSound();
    const containerTop = containerRef.current.getBoundingClientRect().top + window.scrollY;
    const containerHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + (idx / 3.99) * containerHeight + 10;
    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <section
      id="metamorphosis"
      ref={containerRef}
      className="relative min-h-[380vh] bg-brand-cream text-brand-950 select-none border-b border-brand-950/10"
    >
      {/* Henrietta Said Sticky Viewport Container */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden z-10 px-4 sm:px-6 lg:px-8">
        
        {/* Layer 1: Ambient Botanical Atmospheric Halos (Warm & Distinctly Visible) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Top-Left Honey Amber Sun Halo */}
          <div
            className="absolute -top-24 -left-24 w-[620px] h-[620px] rounded-full bg-gradient-to-br from-[#C8741B]/20 via-[#DDA74F]/15 to-transparent blur-[110px] pointer-events-none transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${scrubProgress * 60}px, ${scrubProgress * 80}px, 0)` }}
          />
          {/* Bottom-Right Terracotta / Ruby Sunset Halo */}
          <div
            className="absolute -bottom-28 -right-28 w-[660px] h-[660px] rounded-full bg-gradient-to-tl from-[#8A1521]/20 via-[#C8741B]/15 to-transparent blur-[130px] pointer-events-none transition-transform duration-300 ease-out"
            style={{ transform: `translate3d(${-scrubProgress * 70}px, ${-scrubProgress * 60}px, 0)` }}
          />
          {/* Dynamic Stage Liquid Aura */}
          <div
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] rounded-full blur-[140px] opacity-45 transition-all duration-700 pointer-events-none"
            style={{ backgroundColor: activeStage.liquidColor }}
          />
          {/* Concentric Rotating Botanical Astrolabe / Compass Rings */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[680px] rounded-full border-2 border-[#C8741B]/25 pointer-events-none select-none transition-transform duration-100 ease-out"
            style={{ transform: `translate(-50%, -50%) rotate(${scrubProgress * 180}deg)` }}
          >
            <div className="w-full h-full rounded-full border border-dashed border-[#C8741B]/35 p-12">
              <div className="w-full h-full rounded-full border border-[#C8741B]/25" />
            </div>
          </div>
        </div>

        {/* Layer 2: Upper Kinetic Marquee Ribbon (Visibly running above & behind header) */}
        <div className="absolute top-6 sm:top-10 left-0 w-full pointer-events-none select-none z-0 overflow-hidden">
          <div
            className="flex whitespace-nowrap opacity-[0.28] sm:opacity-[0.35] transition-transform duration-100 ease-out will-change-transform"
            style={{ transform: `translate3d(${-scrubProgress * 420}px, 0, 0)` }}
          >
            <div className="flex animate-ticker-left">
              <span className="font-display text-[9vw] sm:text-[7vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-12 drop-shadow-[0_2px_14px_rgba(200,116,27,0.32)]">
                FRUITS &amp; ROOTS &bull; RAW LIVING BOTANICALS &bull; 15,000 PSI HYDRAULIC &bull; 2.2&deg;C COLD-CHAIN &bull;
              </span>
            </div>
            <div className="flex animate-ticker-left" aria-hidden="true">
              <span className="font-display text-[9vw] sm:text-[7vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-12 drop-shadow-[0_2px_14px_rgba(200,116,27,0.32)]">
                FRUITS &amp; ROOTS &bull; RAW LIVING BOTANICALS &bull; 15,000 PSI HYDRAULIC &bull; 2.2&deg;C COLD-CHAIN &bull;
              </span>
            </div>
          </div>
        </div>


        {/* Layer 4: Lower Kinetic Ticker Ribbon (Visibly running across the bottom) */}
        <div className="absolute bottom-6 sm:bottom-8 left-0 w-full pointer-events-none select-none z-0 overflow-hidden">
          <div
            className="flex whitespace-nowrap opacity-[0.28] sm:opacity-[0.34] transition-transform duration-100 ease-out will-change-transform"
            style={{ transform: `translate3d(${scrubProgress * 380}px, 0, 0)` }}
          >
            <div className="flex animate-ticker-right">
              <span className="font-display text-[7vw] sm:text-[5.5vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-10 drop-shadow-[0_2px_12px_rgba(200,116,27,0.22)]">
                BOROSILICATE GLASS &bull; UV PROTECTION &bull; ZERO PLASTIC LEACH &bull; &#8377;150 INSTANT UPI RETURN &bull; 45-DAY CHILLED &bull;
              </span>
            </div>
            <div className="flex animate-ticker-right" aria-hidden="true">
              <span className="font-display text-[7vw] sm:text-[5.5vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-10 drop-shadow-[0_2px_12px_rgba(200,116,27,0.22)]">
                BOROSILICATE GLASS &bull; UV PROTECTION &bull; ZERO PLASTIC LEACH &bull; &#8377;150 INSTANT UPI RETURN &bull; 45-DAY CHILLED &bull;
              </span>
            </div>
          </div>
        </div>

        {/* Global Floating Botanical Particles reacting to scrub */}
        <div
          className="absolute top-1/4 left-8 pointer-events-none opacity-50 transition-transform duration-100 ease-out z-0 hidden lg:block"
          style={{
            transform: `translate3d(0, ${scrubProgress * 180}px, 0) rotate(${scrubProgress * 90}deg)`,
          }}
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C8741B] to-[#8A1521] blur-[1px] shadow-lg opacity-70" />
        </div>
        <div
          className="absolute bottom-1/4 right-12 pointer-events-none opacity-45 transition-transform duration-100 ease-out z-0 hidden lg:block"
          style={{
            transform: `translate3d(0, ${-scrubProgress * 220}px, 0) rotate(${-scrubProgress * 120}deg)`,
          }}
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#2E6F40] to-[#932839] blur-[2px] shadow-xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto w-full relative z-10 py-6 sm:py-8">
          
          {/* Top Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-brand-950/10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-950 text-brand-cream text-xs font-mono font-bold tracking-wider uppercase mb-2">
                <Zap className="w-3.5 h-3.5 text-brand-amber" />
                <span>Our Cold-Press Craftsmanship</span>
              </div>
              <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-brand-950 uppercase tracking-tight leading-[0.9]">
                From raw earth to glass bottle.
              </h2>
            </div>

            {/* Stage Selector Pills with Live Progress Sync */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono">
              {STAGES.map((s, idx) => (
                <button
                  key={s.step}
                  onClick={() => scrollToStage(idx)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                    currentStageIdx === idx
                      ? 'bg-brand-950 text-brand-cream border-brand-950 shadow-lg scale-105'
                      : 'bg-white text-brand-700 border-brand-950/15 hover:border-brand-950/30 hover:bg-brand-parchment'
                  }`}
                >
                  <span className="text-brand-amber font-black">{s.step}</span>
                  <span className="whitespace-nowrap hidden sm:inline">{s.title.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main 2-Column Experience Stage */}
          <div className="mt-6 sm:mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Column: Real Three.js WebGL 3D Interactive Bottle Card */}
            <div className="lg:col-span-6 bg-white/80 backdrop-blur-xl rounded-3xl p-5 sm:p-7 border border-brand-950/10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between min-h-[460px] sm:min-h-[520px]">
              
              {/* Dynamic Ambient Juice Halo Glow behind the glass */}
              <div
                className="absolute w-80 h-80 rounded-full blur-[140px] opacity-40 transition-all duration-700 pointer-events-none"
                style={{ backgroundColor: activeStage.liquidColor }}
              />

              {/* Top Badge: Extraction Status & Scroll Indicator */}
              <div className="w-full flex items-center justify-between text-xs font-mono pb-3 border-b border-brand-950/10 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-amber animate-ping" />
                  <span className="font-black text-brand-950 uppercase tracking-wider">
                    STAGE {activeStage.step}: {activeStage.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-black px-3 py-1 rounded-full bg-brand-amber/20 text-brand-amber border border-brand-amber/40 text-[11px] shadow-xs">
                    {interpolatedLiquid}% FILLED
                  </span>
                </div>
              </div>

              {/* The Real Three.js WebGL 3D Bottle Canvas */}
              <div className="w-full h-[320px] sm:h-[380px] relative z-10 my-auto">
                <JourneyBottle3D
                  stageIdx={currentStageIdx}
                  stageStep={activeStage.step}
                  stageTitle={activeStage.title}
                  liquidPercent={interpolatedLiquid}
                  liquidColor={activeStage.liquidColor}
                />
              </div>

              {/* Bottom 3D Interactive Drag Hint & Scroll Scrub Indicator */}
              <div className="w-full pt-3 border-t border-brand-950/10 flex items-center justify-between text-[11px] font-mono uppercase tracking-wider text-brand-700 relative z-10">
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-brand-amber" />
                  <span className="hidden sm:inline">DRAG 3D BOTTLE IN WEBGL</span>
                  <span className="sm:hidden">3D BOTTLE</span>
                </div>
                <div className="flex items-center gap-1.5 text-brand-950 font-black">
                  <ArrowDown className="w-3.5 h-3.5 text-[#8A1521] animate-bounce" />
                  <span>SCROLL TO SCRUB</span>
                </div>
              </div>
            </div>

            {/* Right Column: Stage Narrative, Telemetry & Scrub Scrubber */}
            <div className="lg:col-span-6 space-y-5">
              
              {/* Scrub Progress Bar (Henrietta Said Scrollytelling Meter) */}
              <div className="p-3 rounded-2xl bg-white border border-brand-950/10 shadow-xs flex items-center gap-4 font-mono text-xs">
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-600">
                  METAMORPHOSIS
                </span>
                <div className="flex-1 h-2 bg-brand-parchment rounded-full overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-brand-amber via-[#C8741B] to-[#8A1521] rounded-full transition-all duration-75"
                    style={{ width: `${Math.round(scrubProgress * 100)}%` }}
                  />
                </div>
                <span className="font-mono font-black text-brand-950 text-xs">
                  {Math.round(scrubProgress * 100)}%
                </span>
              </div>

              {/* Active Stage Narrative */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-3xl sm:text-5xl font-black text-brand-amber leading-none">
                    /{activeStage.step}
                  </span>
                  <span className="font-mono text-xs sm:text-sm uppercase tracking-widest text-brand-700 font-bold">
                    {activeStage.title}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-4xl md:text-5xl font-black text-brand-950 leading-[0.92] uppercase tracking-tight">
                  {activeStage.headline}
                </h3>

                <p className="text-xs sm:text-sm text-brand-700 leading-relaxed font-normal">
                  {activeStage.description}
                </p>
              </div>

              {/* Key Technical Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 font-mono">
                {activeStage.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-white border border-brand-950/10 shadow-sm text-left space-y-0.5 hover:border-brand-950/25 transition"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-brand-600 block font-bold">
                      {stat.label}
                    </span>
                    <span className="font-display text-lg sm:text-xl font-black text-brand-950 block">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Manual Stage Buttons */}
              <div className="pt-2 flex items-center justify-between font-mono">
                <button
                  onClick={() => scrollToStage(Math.max(0, currentStageIdx - 1))}
                  className="px-5 py-2.5 rounded-full border border-brand-950/20 bg-white hover:bg-brand-parchment text-xs font-bold text-brand-950 transition active:scale-95 shadow-sm"
                >
                  ← PREV STAGE
                </button>

                <button
                  onClick={() => scrollToStage(Math.min(3, currentStageIdx + 1))}
                  className="px-6 py-2.5 rounded-full bg-brand-950 hover:bg-brand-900 text-brand-cream text-xs font-black transition flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95"
                >
                  <span>NEXT STAGE →</span>
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
