import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playPopSound } from '../utils/audio';
import {
  Gauge,
  Leaf,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  MapPin,
  CheckCircle2,
  Droplets,
  ArrowUpRight,
  ArrowDown,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Sourced Farm Data (Original Content from Bento Grid)
// ---------------------------------------------------------------------------
interface Farm {
  id: string;
  name: string;
  produce: string;
  region: string;
  distance: string;
  soilScore: number;
  highlight: string;
}

const FARMS: Farm[] = [
  {
    id: 'jaintia',
    name: 'Jaintia Hills Organics',
    produce: 'Lakadong 7.5% Curcumin Turmeric',
    region: 'Jaintia Hills, Meghalaya',
    distance: '2,150 km',
    soilScore: 99,
    highlight: 'Hand-dug at peak maturity from misty volcanic soil; 3.75x higher potency than commercial powder.',
  },
  {
    id: 'konkan',
    name: 'Konkan Coast Orchards',
    produce: 'GI-Tagged Ratnagiri Alphonso Mango',
    region: 'Ratnagiri, Maharashtra',
    distance: '340 km',
    soilScore: 99,
    highlight: 'Naturally tree-ripened with Arabian Sea breezes; zero chemical carbide, 100% pure fructose.',
  },
  {
    id: 'nilgiri',
    name: 'Nilgiri Mountain Farms',
    produce: 'Organic Curly Kale & Crisp Mountain Celery',
    region: 'Ooty, Tamil Nadu',
    distance: '1,120 km',
    soilScore: 98,
    highlight: 'Grown at 2,000m altitude in cool mountain air; rich in natural chlorophyll and living enzymes.',
  },
  {
    id: 'wayanad',
    name: 'Wayanad Forest Soils',
    produce: 'High-Gingerol Ginger & Black Malabar Peppercorn',
    region: 'Western Ghats, Kerala',
    distance: '1,180 km',
    soilScore: 98,
    highlight: 'Intercropped in bio-diverse forest shade with pristine rainwater compost; bold natural kick.',
  },
];

// ---------------------------------------------------------------------------
// 4 Master Chapters (Exact Original Brand Content + Luxury Editorial Architecture)
// ---------------------------------------------------------------------------
interface ProcessChapter {
  id: string;
  step: string;
  code: string;
  badge: string;
  subBadge: string;
  headline: string;
  headlineAccent: string;
  body: string;
}

const CHAPTERS: ProcessChapter[] = [
  {
    id: 'cold-press',
    step: '01',
    code: '01',
    badge: 'OUR COLD-PRESS METHOD',
    subBadge: 'SLOW COLD-PRESS',
    headline: 'SLOWLY SQUEEZED COLD.',
    headlineAccent: 'never heated.',
    body: 'Regular blenders and juicers use fast spinning metal blades that heat up fresh fruits, cooking away delicate vitamins before you take a sip. We gently press whole produce cold with slow hydraulic pressure—preserving every drop of fresh taste, natural color, and live vitamins.',
  },
  {
    id: 'farm-soil',
    step: '02',
    code: '02',
    badge: 'FARM QUALITY',
    subBadge: '100% ORGANIC',
    headline: 'GROWN WITH CARE IN INDIAN SOIL.',
    headlineAccent: 'straight from family farms.',
    body: 'Great juice starts with great soil. We source all our fruits, greens, and roots from trusted family farms that use zero chemical pesticides and 100% natural organic compost. We never buy from mass industrial wholesale auctions.',
  },
  {
    id: 'freshness',
    step: '03',
    code: '03',
    badge: 'COLD FRESHNESS',
    subBadge: 'NEVER BOILED',
    headline: 'NO BOILED JUICE.',
    headlineAccent: 'ever.',
    body: 'Supermarket juices are heated and boiled to sit on shelves for months. We use clean cold water pressure to keep our juice completely safe while keeping all its fresh flavor, natural vibrancy, and live vitamins intact.',
  },
  {
    id: 'zero-plastic',
    step: '04',
    code: '04',
    badge: 'REUSABLE GLASS',
    subBadge: '+₹25 / BOTTLE',
    headline: 'ZERO PLASTIC.',
    headlineAccent: 'pure crystal glass.',
    body: 'All our juices are poured into clean, reusable glass bottles. Simply hand your rinsed empty bottles to our delivery rider and receive ₹25 per bottle back on UPI.',
  },
];

export const BentoGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Interactive state for Chapter 2: Farm partner region selector
  const [selectedFarmIdx, setSelectedFarmIdx] = useState(0);
  const activeFarm = FARMS[selectedFarmIdx];

  // -------------------------------------------------------------------------
  // Pinned Horizontal Scroll Trigger (Smooth GPU-accelerated scrub)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const total = CHAPTERS.length;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          id: 'process-pinned-scroll',
          trigger: container,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${window.innerWidth * 3.0}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            const idx = Math.min(total - 1, Math.floor(p * total + 0.15));
            setActiveIdx(idx);
          },
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  // Jump to specific slide on indicator click
  const jumpToSlide = (idx: number) => {
    playPopSound();
    const clampedIdx = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
    setActiveIdx(clampedIdx);
    setScrollProgress(clampedIdx / (CHAPTERS.length - 1));

    if (!containerRef.current) return;
    const container = containerRef.current;
    const start = container.offsetTop;
    const totalDistance = window.innerWidth * 3.0;
    const targetScroll = start + (clampedIdx / (CHAPTERS.length - 1)) * totalDistance;

    if ((window as any).__lenis) {
      (window as any).__lenis.scrollTo(targetScroll, { duration: 0.8 });
    } else {
      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="terroir"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none bg-[#FAF6EE] text-brand-950 border-t border-brand-950/10"
    >
      {/* ------------------------------------------------------------------- */}
      {/* Ambient Warm Botanical Glows (Ensures continuous warm luxury canvas)  */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute top-1/4 left-1/4 w-[520px] h-[520px] rounded-full bg-brand-amber/[0.08] blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[580px] h-[580px] rounded-full bg-[#8A1521]/[0.06] blur-[150px] pointer-events-none" />

      {/* ------------------------------------------------------------------- */}
      {/* 1. Sticky Top Editorial Header                                      */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 py-4 sm:py-5 flex items-center justify-between border-b border-brand-950/10 backdrop-blur-md bg-[#FAF6EE]/85">
        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber animate-pulse" />
          <span className="text-brand-950">OUR COLD-PRESS CRAFTSMANSHIP</span>
          <span className="hidden md:inline text-brand-950/30">&bull;</span>
          <span className="hidden md:inline text-brand-700 font-normal">
            SOURCED DIRECT FROM ORGANIC INDIAN SOIL
          </span>
        </div>

        <div className="font-mono text-xs tracking-wider text-brand-800 flex items-center gap-2">
          <span className="text-brand-amber font-bold">{CHAPTERS[activeIdx].badge}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Pinned Horizontal Track (4 Luxury Editorial Slides)              */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${CHAPTERS.length * 100}vw` }}
      >
        {/* ================================================================= */}
        {/* SLIDE 01: OUR COLD-PRESS METHOD (SLOW COLD-PRESS)                 */}
        {/* ================================================================= */}
        <div className="w-screen h-full shrink-0 flex items-center justify-center px-6 sm:px-12 lg:px-20 pt-20 pb-16 bg-[#FAF6EE] text-brand-950 relative">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-3.5 py-1.5 rounded-full bg-brand-950 text-[#FAF6EE] font-bold tracking-widest uppercase shadow-sm">
                  {CHAPTERS[0].badge}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-brand-amber/15 text-brand-amber border border-brand-amber/30 font-bold uppercase tracking-wider">
                  {CHAPTERS[0].subBadge}
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-brand-950 uppercase tracking-tight leading-[0.92]">
                {CHAPTERS[0].headline}
                <br />
                <span className="font-serif italic font-normal text-brand-amber lowercase tracking-normal">
                  {CHAPTERS[0].headlineAccent}
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-brand-800 max-w-xl font-normal leading-relaxed">
                {CHAPTERS[0].body}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-brand-700 uppercase tracking-widest font-semibold">
                <span className="w-2 h-2 rounded-full bg-brand-amber" />
                <span>ZERO BLADES &bull; ZERO THERMAL DEGRADATION &bull; 100% LIVING JUICE</span>
              </div>
            </div>

            {/* Right Visual Card: Master Luxury Cold-Press Specification Dossier */}
            <div className="lg:col-span-5">
              <div className="bg-[#FCFAF6] text-brand-950 rounded-[32px] p-6 sm:p-8 border border-brand-950/15 shadow-[0_24px_50px_-12px_rgba(45,36,30,0.12)] space-y-6 relative overflow-hidden">
                {/* Subtle Ambient Amber Glow */}
                <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-brand-amber/10 blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-brand-950/10 font-mono text-xs relative z-10">
                  <span className="flex items-center gap-2 text-brand-950 font-bold uppercase tracking-wider">
                    <Gauge className="w-4 h-4 text-brand-amber" /> HYDRAULIC CRAFT SPECIFICATION
                  </span>
                  <span className="px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber border border-brand-amber/30 font-mono font-bold text-[11px] uppercase tracking-wider">
                    15,000 PSI STATIC EXTRACTION
                  </span>
                </div>

                {/* Craft Comparison Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                  {/* Conventional Centrifugal Juicer */}
                  <div className="p-4 rounded-2xl bg-brand-parchment/60 border border-brand-950/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-ruby">FAST BLADES JUICER</span>
                      <span className="px-2 py-0.5 rounded bg-brand-ruby/10 text-brand-ruby font-mono text-[9px] font-bold">14,000 RPM</span>
                    </div>
                    <p className="text-xs text-brand-700 leading-snug font-sans">
                      Fast spinning metal blades create friction heat up to 48°C, cooking away vitamins and oxidizing fresh flavor.
                    </p>
                    <div className="text-[11px] font-mono text-brand-ruby font-bold flex items-center gap-1 pt-1">
                      <span>&times;</span> <span>Thermal friction damage</span>
                    </div>
                  </div>

                  {/* Fruits & Roots Hydraulic Press */}
                  <div className="p-4 rounded-2xl bg-white border-2 border-brand-amber/40 shadow-xs space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-brand-amber">FRUITS &amp; ROOTS PRESS</span>
                      <span className="px-2 py-0.5 rounded bg-brand-amber/20 text-brand-amber font-mono text-[9px] font-bold">0 RPM &bull; COLD</span>
                    </div>
                    <p className="text-xs text-brand-800 leading-snug font-sans">
                      Zero rotating blades. Slow hydraulic ram applies 15,000 PSI to gently squeeze out 100% pure living botanical nectar.
                    </p>
                    <div className="text-[11px] font-mono text-brand-moss font-bold flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-moss" /> <span>Intact live bio-enzymes</span>
                    </div>
                  </div>
                </div>

                {/* 3 Real Cold-Press Metrics */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-brand-950/10 relative z-10 text-center font-mono">
                  <div className="bg-white p-3.5 rounded-2xl border border-brand-950/10 shadow-xs">
                    <span className="block text-[10px] text-brand-600 uppercase tracking-wider">HEAT GENERATED</span>
                    <span className="text-xl sm:text-2xl font-serif font-black text-brand-950 mt-1 block">0.0°C</span>
                    <span className="text-[10px] text-brand-amber block mt-0.5 font-bold uppercase">Zero Friction</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-brand-950/10 shadow-xs">
                    <span className="block text-[10px] text-brand-600 uppercase tracking-wider">CHAMBER FORCE</span>
                    <span className="text-xl sm:text-2xl font-serif font-black text-brand-amber mt-1 block">15,000</span>
                    <span className="text-[10px] text-brand-700 block mt-0.5 font-semibold uppercase">PSI Pressure</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-2xl border border-brand-950/10 shadow-xs">
                    <span className="block text-[10px] text-brand-600 uppercase tracking-wider">LIVE ENZYMES</span>
                    <span className="text-xl sm:text-2xl font-serif font-black text-brand-moss mt-1 block">100%</span>
                    <span className="text-[10px] text-brand-moss block mt-0.5 font-bold uppercase">Intact Enzymes</span>
                  </div>
                </div>

                {/* Bottom Bandra Press Room Certification Stamp */}
                <div className="pt-2 text-[11px] font-mono text-brand-700 text-center uppercase tracking-wider font-semibold border-t border-brand-950/5">
                  FSSAI CERTIFIED RAW &bull; ZERO PRESERVATIVES &bull; PRESSED FRESH IN BANDRA WEST
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SLIDE 02: FARM QUALITY (100% ORGANIC INDIAN SOIL)                 */}
        {/* ================================================================= */}
        <div className="w-screen h-full shrink-0 flex items-center justify-center px-6 sm:px-12 lg:px-20 pt-20 pb-16 bg-[#F5EFEB] text-brand-950 relative">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-3.5 py-1.5 rounded-full bg-brand-moss text-white font-bold tracking-widest uppercase shadow-sm">
                  {CHAPTERS[1].badge}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-brand-950/10 text-brand-900 font-semibold uppercase tracking-wider">
                  {CHAPTERS[1].subBadge}
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-brand-950 uppercase tracking-tight leading-[0.92]">
                {CHAPTERS[1].headline}
                <br />
                <span className="font-serif italic font-normal text-brand-moss lowercase tracking-normal">
                  {CHAPTERS[1].headlineAccent}
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-brand-800 max-w-xl font-normal leading-relaxed">
                {CHAPTERS[1].body}
              </p>

              {/* 99/100 Organic Harvest Score Callout */}
              <div className="flex items-center gap-5 pt-2">
                <div className="text-4xl sm:text-5xl font-serif font-black text-brand-950">
                  99<span className="text-xl sm:text-2xl text-brand-amber font-normal font-sans">/100</span>
                </div>
                <div className="border-l border-brand-950/20 pl-4 font-mono text-xs">
                  <span className="block font-bold text-brand-950 uppercase tracking-wider">ORGANIC HARVEST SCORE</span>
                  <span className="text-brand-700 block mt-0.5">Certified chemical-free volcanic &amp; laterite soils</span>
                </div>
              </div>
            </div>

            {/* Right Visual Card: Interactive Partner Region Selector */}
            <div className="lg:col-span-6">
              <div className="bg-[#FCFAF6] rounded-[32px] p-6 sm:p-8 border border-brand-950/15 shadow-[0_24px_50px_-12px_rgba(45,36,30,0.12)] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-brand-950/10 font-mono text-xs">
                  <span className="flex items-center gap-2 text-brand-950 font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-brand-amber" /> SELECT PARTNER REGION
                  </span>
                  <span className="text-brand-moss font-bold font-mono text-xs uppercase tracking-wider">
                    DIRECT FROM FARMERS
                  </span>
                </div>

                {/* 4 Region Selection Buttons */}
                <div className="grid grid-cols-2 gap-2.5">
                  {FARMS.map((farm, idx) => (
                    <button
                      key={farm.id}
                      onClick={() => {
                        setSelectedFarmIdx(idx);
                        playPopSound();
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        selectedFarmIdx === idx
                          ? 'bg-brand-950 text-white border-brand-950 shadow-md scale-[1.02]'
                          : 'bg-white hover:bg-brand-parchment/60 text-brand-900 border-brand-950/10 shadow-2xs'
                      }`}
                    >
                      <span className="font-mono text-xs font-bold block truncate">{farm.name.split(' ')[0]}</span>
                      <span className="text-[10px] font-mono mt-1 opacity-70 block">{farm.distance}</span>
                    </button>
                  ))}
                </div>

                {/* Selected Farm Detail Panel */}
                <div className="bg-white p-5 rounded-2xl border border-brand-950/10 shadow-xs space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between font-bold text-brand-950">
                    <span className="flex items-center gap-1.5">
                      <Leaf className="w-3.5 h-3.5 text-brand-moss" /> {activeFarm.region}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-moss/10 text-brand-moss text-[11px] font-bold">
                      SOIL SCORE: {activeFarm.soilScore}/100
                    </span>
                  </div>

                  <div className="text-sm font-serif font-bold text-brand-950 pt-1">
                    {activeFarm.produce}
                  </div>

                  <p className="text-xs font-sans text-brand-700 leading-relaxed pt-1">
                    {activeFarm.highlight}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SLIDE 03: COLD FRESHNESS (NO BOILED JUICE. EVER.)                 */}
        {/* ================================================================= */}
        <div className="w-screen h-full shrink-0 flex items-center justify-center px-6 sm:px-12 lg:px-20 pt-20 pb-16 bg-[#FAF6EE] text-brand-950 relative">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-3.5 py-1.5 rounded-full bg-[#8A1521] text-white font-bold tracking-widest uppercase shadow-sm">
                  {CHAPTERS[2].badge}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-brand-950/10 text-brand-900 font-semibold uppercase tracking-wider">
                  {CHAPTERS[2].subBadge}
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-brand-950 uppercase tracking-tight leading-[0.92]">
                {CHAPTERS[2].headline}
                <br />
                <span className="font-serif italic font-normal text-[#8A1521] lowercase tracking-normal">
                  {CHAPTERS[2].headlineAccent}
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-brand-800 max-w-xl font-normal leading-relaxed">
                {CHAPTERS[2].body}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-brand-moss font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-brand-moss shrink-0" />
                <span>NATURAL VITAMINS &amp; ENZYMES: 100% INTACT &bull; UNPASTEURIZED</span>
              </div>
            </div>

            {/* Right Visual Card: Comparison Breakdown */}
            <div className="lg:col-span-6">
              <div className="bg-[#FCFAF6] rounded-[32px] p-6 sm:p-8 border border-brand-950/15 shadow-[0_24px_50px_-12px_rgba(45,36,30,0.12)] space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between pb-3 border-b border-brand-950/10 font-mono text-xs">
                  <span className="flex items-center gap-2 text-brand-950 font-bold uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-brand-ruby" /> THE RAW INTEGRITY AUDIT
                  </span>
                  <span className="text-brand-amber font-bold font-mono text-xs uppercase tracking-wider">
                    COLD WATER HYPERBARIC
                  </span>
                </div>

                {/* Supermarket Comparison Card */}
                <div className="bg-brand-parchment/60 rounded-2xl p-5 border border-brand-950/10 shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-brand-ruby font-bold uppercase tracking-wider">
                      COMMERCIAL SUPERMARKET JUICE
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-ruby/10 text-brand-ruby text-[10px] font-bold">
                      BOILED / FLASH-HEATED (95°C)
                    </span>
                  </div>
                  <p className="text-xs text-brand-700 leading-relaxed font-sans">
                    Heated to 95°C for long ambient shelf life in warehouse supply chains. High heat destroys delicate vitamin C, cooks away active enzymes, and alters natural farm taste. Packed in single-use plastic.
                  </p>
                  <div className="text-[11px] font-mono text-brand-ruby font-semibold pt-1">
                    &times; Boiled to 95°C &bull; Months-old store shelf life &bull; Zero live bio-activity
                  </div>
                </div>

                {/* Fruits & Roots Cold-Pressed Card */}
                <div className="bg-white rounded-2xl p-6 border-2 border-brand-amber/35 shadow-sm space-y-2.5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-brand-amber/10 blur-2xl pointer-events-none" />

                  <div className="flex items-center justify-between text-xs font-mono relative z-10">
                    <span className="text-brand-950 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-amber" /> FRUITS &amp; ROOTS METHOD
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-amber/15 text-brand-amber border border-brand-amber/30 text-[10px] font-bold">
                      CHILLED COLD WATER PRESSURE (2.2°C)
                    </span>
                  </div>

                  <p className="text-xs text-brand-800 leading-relaxed font-sans pt-1 relative z-10">
                    100% raw living juice bottled immediately at 2.2°C. Clean cold water pressure eliminates bacteria without heating a single degree. Experience the crisp snap and vibrant color of freshly picked produce.
                  </p>

                  <div className="text-xs font-mono text-brand-moss font-bold pt-2 flex items-center gap-1.5 relative z-10">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-moss" />
                    <span>100% Intact Living Enzymes &bull; Delivered Chilled Daily in Mumbai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* SLIDE 04: REUSABLE GLASS (ZERO PLASTIC. PURE GLASS.)              */}
        {/* ================================================================= */}
        <div className="w-screen h-full shrink-0 flex items-center justify-center px-6 sm:px-12 lg:px-20 pt-20 pb-16 bg-[#F5EFEB] text-brand-950 relative">
          <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* Left Narrative Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3 font-mono text-xs">
                <span className="px-3.5 py-1.5 rounded-full bg-brand-amber text-brand-950 font-bold tracking-widest uppercase shadow-sm">
                  {CHAPTERS[3].badge}
                </span>
                <span className="px-3.5 py-1.5 rounded-full bg-brand-950/10 text-brand-900 font-semibold uppercase tracking-wider">
                  {CHAPTERS[3].subBadge}
                </span>
              </div>

              <h2 className="font-serif text-4xl sm:text-6xl md:text-7xl font-black text-brand-950 uppercase tracking-tight leading-[0.92]">
                {CHAPTERS[3].headline}
                <br />
                <span className="font-serif italic font-normal text-brand-amber lowercase tracking-normal">
                  {CHAPTERS[3].headlineAccent}
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-brand-800 max-w-xl font-normal leading-relaxed">
                {CHAPTERS[3].body}
              </p>

              <div className="pt-2 flex items-center gap-3 text-xs font-mono text-brand-800 uppercase tracking-widest font-semibold">
                <RotateCcw className="w-4 h-4 text-brand-amber shrink-0" />
                <span>CIRCULAR PACKAGING &bull; RINSE &bull; RETURN &bull; INSTANT UPI REFUND</span>
              </div>
            </div>

            {/* Right Visual Card: Bottle Deposit Circular Economy Stats */}
            <div className="lg:col-span-6">
              <div className="bg-[#FCFAF6] rounded-[32px] p-6 sm:p-8 border border-brand-950/15 shadow-[0_24px_50px_-12px_rgba(45,36,30,0.12)] space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-brand-950/10 font-mono text-xs">
                  <span className="text-brand-950 font-bold uppercase tracking-wider flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-brand-amber" /> BOTTLE RECYCLING IMPACT
                  </span>
                  <span className="px-3 py-1 rounded-full bg-brand-amber/15 text-brand-amber border border-brand-amber/30 text-xs font-bold uppercase tracking-wider">
                    MUMBAI CIRCULAR INITIATIVE
                  </span>
                </div>

                {/* Giant Metric Counter */}
                <div className="bg-white p-6 rounded-2xl border border-brand-950/10 shadow-xs text-center space-y-1">
                  <div className="font-serif text-4xl sm:text-5xl font-black text-brand-950 tracking-tight">
                    248,600+
                  </div>
                  <div className="font-mono text-xs text-brand-amber uppercase tracking-wider font-bold">
                    PLASTIC BOTTLES SAVED FROM MUMBAI LANDFILLS
                  </div>
                </div>

                {/* Circular Deposit Workflow */}
                <div className="grid grid-cols-3 gap-3 text-center font-mono text-xs">
                  <div className="bg-white p-3.5 rounded-xl border border-brand-950/10 shadow-xs space-y-1">
                    <span className="text-brand-950 block font-bold text-xs uppercase tracking-wider">DRINK RAW</span>
                    <span className="text-[10px] text-brand-700 block">Pure crystal glass</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-950/10 shadow-xs space-y-1">
                    <span className="text-brand-950 block font-bold text-xs uppercase tracking-wider">RINSE &amp; HAND</span>
                    <span className="text-[10px] text-brand-700 block">Give bottle to rider</span>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-brand-950/10 shadow-xs space-y-1">
                    <span className="text-brand-moss block font-bold text-xs uppercase tracking-wider">GET ₹25 UPI</span>
                    <span className="text-[10px] text-brand-moss/80 block">Instant refund</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Bottom Sticky Telemetry Ribbon & Progress Bar                    */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute bottom-0 left-0 right-0 z-30 px-6 sm:px-12 py-3 bg-[#FAF6EE]/90 backdrop-blur-md border-t border-brand-950/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
        {/* Cold-Chain Dispatch Telemetry */}
        <div className="flex items-center gap-3 text-brand-950">
          <span className="px-2.5 py-1 rounded-md bg-brand-950 text-brand-gold font-bold text-[11px]">
            2.2°C
          </span>
          <span className="font-semibold text-brand-900 truncate">
            COLD-CHAIN INTEGRITY DISPATCH &bull; Bandra West Press Room 01 &bull; Lot #0849-BOM
          </span>
        </div>

        {/* Scroll Progress & Jump CTA */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex items-center gap-2 text-brand-700 text-[11px]">
            <span>SCROLL TO DISCOVER</span>
            <ArrowDown className="w-3 h-3 text-brand-amber animate-bounce" />
          </div>

          <a
            href="#catalog"
            onClick={() => playPopSound()}
            className="px-4 py-1.5 rounded-full bg-brand-amber hover:bg-brand-gold text-brand-950 font-bold uppercase tracking-wider text-[11px] transition shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>EXPLORE BLENDS</span>
            <ArrowUpRight className="w-3 h-3 text-brand-950" />
          </a>
        </div>

        {/* Ultra-fine horizontal scrubber line */}
        <div
          className="absolute bottom-0 left-0 h-[2px] bg-brand-amber transition-all duration-75 origin-left"
          style={{ width: `${Math.round(scrollProgress * 100)}%` }}
        />
      </div>
    </section>
  );
};
