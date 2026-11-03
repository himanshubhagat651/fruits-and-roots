import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { playPopSound, playChimeSound } from '../utils/audio';
import { ArrowDown, Compass, MapPin, Sparkles, Wind, Sun, Mountain, Flame, Check } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Terroir Data Definition
// ---------------------------------------------------------------------------
interface TerroirChapter {
  id: string;
  step: string;
  code: string;
  coordinates: string;
  region: string;
  state: string;
  altitude: string;
  headlineFirst: string;
  headlineSecond: string;
  produceName: string;
  subhead: string;
  narrative: string;
  calloutPrefix: string;
  calloutTitle: string;
  calloutNote: string;
  dialType: 'curcumin' | 'solar' | 'altitude' | 'rainforest';
  accentColor: string;
  accentBg: string;
  theme: 'dark' | 'light';
}

const CHAPTERS: TerroirChapter[] = [
  {
    id: 'intro',
    step: '00',
    code: 'ORIGIN 00',
    coordinates: '19.0760° N, 72.8777° E',
    region: 'PAN-INDIAN HARVEST',
    state: 'DIRECT FROM FAMILY FARMS',
    altitude: 'SEA LEVEL TO 2,100M',
    headlineFirst: 'BORN IN INDIAN SOIL.',
    headlineSecond: 'BOTTLED IN MUMBAI.',
    produceName: '100% Raw Botanical Terroir',
    subhead: 'NO MASS INDUSTRIAL WHOLESALE. NO WAREHOUSE STORAGE.',
    narrative:
      'We do not buy from wholesale industrial auctions. Every sunrise, living harvests arrive at our Bandra West press room directly from organic family farms in Meghalaya, Maharashtra, Tamil Nadu, and Kerala. Cold-pressed within hours of arrival.',
    calloutPrefix: 'THE CONVICTION',
    calloutTitle: 'ZERO COMMODITY JUICE',
    calloutNote: 'Single-origin terroir traceability in every single glass bottle.',
    dialType: 'curcumin',
    accentColor: '#E5A93C',
    accentBg: '#171412',
    theme: 'dark',
  },
  {
    id: 'jaintia',
    step: '01',
    code: 'ORIGIN 01',
    coordinates: '25.4484° N, 92.1933° E',
    region: 'JAINTIA HILLS',
    state: 'MEGHALAYA',
    altitude: 'ALTITUDE 1,200M • VOLCANIC SOIL',
    headlineFirst: 'JAINTIA',
    headlineSecond: 'HILLS',
    produceName: 'Lakadong 7.5% Curcumin Turmeric',
    subhead: 'CLOUD-MISTED VOLCANIC HIGHLANDS',
    narrative:
      'High in the misty rain-fed valleys of Meghalaya, untouched volcanic soils nurture the world’s most potent turmeric. Hand-dug at peak maturity by indigenous women’s farming collectives, never bleached, and pressed fresh for raw golden warmth.',
    calloutPrefix: 'GIVES US',
    calloutTitle: '7.5% PURE CURCUMIN',
    calloutNote: 'vs 2.0% in commercial wholesale powder • 3.75x higher active bio-potency',
    dialType: 'curcumin',
    accentColor: '#FF9F1C',
    accentBg: '#F7F3EA',
    theme: 'light',
  },
  {
    id: 'konkan',
    step: '02',
    code: 'ORIGIN 02',
    coordinates: '16.9902° N, 73.3120° E',
    region: 'KONKAN COAST',
    state: 'MAHARASHTRA',
    altitude: 'SEA LEVEL • RED LATERITE CLIFFS',
    headlineFirst: 'KONKAN',
    headlineSecond: 'COAST',
    produceName: 'GI-Tagged Ratnagiri Alphonso & Citrus',
    subhead: 'ARABIAN SEA BREEZES & LATERITE SOIL',
    narrative:
      'Saline sea breezes off the Arabian Sea sweep over red laterite cliffs. Our Ratnagiri Alphonso mangoes and Assam Kaji Nemu limes ripen naturally under warm coastal sunshine—zero chemical carbide ripening, zero syrups, just honest citrus vitality.',
    calloutPrefix: 'GIVES US',
    calloutTitle: '24° BRIX SUNSHINE',
    calloutNote: '100% natural tree-ripened fructose • Zero added sugar • Zero concentrates',
    dialType: 'solar',
    accentColor: '#E85D04',
    accentBg: '#F5EFE6',
    theme: 'light',
  },
  {
    id: 'nilgiri',
    step: '03',
    code: 'ORIGIN 03',
    coordinates: '11.4916° N, 76.7337° E',
    region: 'NILGIRI PEAKS',
    state: 'TAMIL NADU',
    altitude: 'ALTITUDE 2,100M • MOUNTAIN MIST',
    headlineFirst: 'NILGIRI',
    headlineSecond: 'PEAKS',
    produceName: 'Curly Kale, Celery & Mountain Herbs',
    subhead: 'HIGH-ALTITUDE SHADOW CANOPY',
    narrative:
      'Cool alpine elevations kissed by morning frost and rolling tea-mist. Slow cellular growth in mineral mountain soils yields dense, deep green curly kale and crisp stalk celery packed with concentrated living chlorophyll and cellular hydration.',
    calloutPrefix: 'GIVES US',
    calloutTitle: 'LIVING CHLOROPHYLL',
    calloutNote: 'Dense cellular oxygenation • 1.8 kg of crisp mountain greens in every bottle',
    dialType: 'altitude',
    accentColor: '#2D6A4F',
    accentBg: '#F2ECE4',
    theme: 'light',
  },
  {
    id: 'wayanad',
    step: '04',
    code: 'ORIGIN 04',
    coordinates: '11.6854° N, 76.1320° E',
    region: 'WAYANAD VALLEY',
    state: 'KERALA',
    altitude: 'RAINFOREST CANOPY • PERENNIAL SPRINGS',
    headlineFirst: 'WAYANAD',
    headlineSecond: 'VALLEY',
    produceName: 'Wild Baby Ginger & Malabar Black Pepper',
    subhead: 'BIODIVERSE RAINFOREST SOILS',
    narrative:
      'Shaded cardamom and pepper groves watered by natural mountain springs. Tender, fiber-rich baby ginger brings a clean, warming botanical snap, while cracked Tellicherry black peppercorns enhance the body’s absorption of turmeric curcumin by up to 2000%.',
    calloutPrefix: 'GIVES US',
    calloutTitle: 'BIO-ACTIVE DIGESTIVE FIRE',
    calloutNote: 'Natural piperine bio-enhancer • Earthen warmth that soothes digestion',
    dialType: 'rainforest',
    accentColor: '#A44200',
    accentBg: '#EFE8DE',
    theme: 'light',
  },
];

// ---------------------------------------------------------------------------
// Precision Swiss-Style Mechanical SVG Instruments
// Inspired by Jeffrey Blum's Swiss Made Clock / Scientific Origin Mechanics
// ---------------------------------------------------------------------------

// 1. Lakadong Curcumin Potency Chronometer
const CurcuminInstrument: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center select-none group">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      >
        {/* Outer Heavy Brass Bezel */}
        <circle cx="200" cy="200" r="188" fill="#FBF8F2" stroke="#171412" strokeWidth="4" />
        <circle cx="200" cy="200" r="182" fill="none" stroke="#171412" strokeWidth="1" strokeDasharray="3,3" />

        {/* 60 Precision Dial Ticks */}
        {Array.from({ length: 60 }).map((_, i) => {
          const angle = (i * 6 * Math.PI) / 180;
          const isMajor = i % 5 === 0;
          const r1 = 176;
          const r2 = isMajor ? 154 : 166;
          const x1 = 200 + Math.sin(angle) * r1;
          const y1 = 200 - Math.cos(angle) * r1;
          const x2 = 200 + Math.sin(angle) * r2;
          const y2 = 200 - Math.cos(angle) * r2;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#171412"
              strokeWidth={isMajor ? 3.5 : 1.2}
              strokeLinecap="round"
            />
          );
        })}

        {/* Curcumin Potency Gauge Arc (0% to 10%) */}
        <path
          d="M 100 280 A 130 130 0 1 1 300 280"
          fill="none"
          stroke="#EAE0D1"
          strokeWidth="10"
          strokeLinecap="round"
        />
        {/* Active Golden Curcumin Arc from 0 to 7.5% */}
        <path
          d="M 100 280 A 130 130 0 1 1 275 140"
          fill="none"
          stroke="#FF9F1C"
          strokeWidth="10"
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />

        {/* Commercial Turmeric Reference Marker at 2.0% */}
        <line x1="112" y1="210" x2="135" y2="210" stroke="#7A6F66" strokeWidth="2.5" />
        <text x="142" y="214" fill="#7A6F66" fontSize="10" fontFamily="Space Grotesk, monospace" fontWeight="bold">
          COM. 2.0%
        </text>

        {/* Lakadong Pin Marker at 7.5% */}
        <circle cx="275" cy="140" r="6" fill="#FF9F1C" stroke="#171412" strokeWidth="2" />
        <text x="290" y="144" fill="#171412" fontSize="12" fontFamily="Space Grotesk, monospace" fontWeight="900">
          7.5% LAKADONG
        </text>

        {/* Inner Scientific Dial Text */}
        <text
          x="200"
          y="110"
          textAnchor="middle"
          fill="#171412"
          fontSize="11"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.25em"
          fontWeight="bold"
        >
          CURCUMIN CHRONOMETER
        </text>
        <text
          x="200"
          y="126"
          textAnchor="middle"
          fill="#8A7D73"
          fontSize="9"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.15em"
        >
          MEGHALAYA VOLCANIC SOIL
        </text>

        <text
          x="200"
          y="275"
          textAnchor="middle"
          fill="#171412"
          fontSize="10"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.3em"
          fontWeight="bold"
        >
          SWISS-INSPECTED CRAFT
        </text>

        {/* Central Monogram */}
        <text
          x="200"
          y="180"
          textAnchor="middle"
          fill="#171412"
          fontSize="28"
          fontFamily="Sink, Impact, sans-serif"
          fontWeight="900"
        >
          7.5%
        </text>
        <text
          x="200"
          y="198"
          textAnchor="middle"
          fill="#FF9F1C"
          fontSize="11"
          fontFamily="Space Grotesk, monospace"
          fontWeight="bold"
        >
          POTENCY INDEX
        </text>

        {/* Hour Hand (Points to origin coordinate) */}
        <line
          x1="200"
          y1="200"
          x2="150"
          y2="235"
          stroke="#171412"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {/* Minute Hand (Points to 7.5% dial calibration) */}
        <line
          x1="200"
          y1="200"
          x2="265"
          y2="145"
          stroke="#171412"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Mechanical Swiss Ticking Second Hand with Yellow Dot Pip (Inspired by Blum clock) */}
        <g className="origin-center animate-[spin_60s_steps(60)_infinite]">
          <line x1="200" y1="230" x2="200" y2="55" stroke="#171412" strokeWidth="1.8" />
          <circle cx="200" cy="85" r="9" fill="#FF9F1C" stroke="#171412" strokeWidth="2" />
        </g>

        {/* Solid Center Bezel Hub */}
        <circle cx="200" cy="200" r="14" fill="#171412" />
        <circle cx="200" cy="200" r="5" fill="#FAF6EE" />
      </svg>
    </div>
  );
};

// 2. Konkan Maritime Solar & Brix Sweetness Compass
const SolarInstrument: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center select-none group">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      >
        <circle cx="200" cy="200" r="188" fill="#FBF8F2" stroke="#171412" strokeWidth="4" />
        <circle cx="200" cy="200" r="182" fill="none" stroke="#E85D04" strokeWidth="2" opacity="0.4" />

        {/* 360 Degree Compass Rose Ticks */}
        {Array.from({ length: 36 }).map((_, i) => {
          const angle = (i * 10 * Math.PI) / 180;
          const isCardinal = i % 9 === 0;
          const r1 = 176;
          const r2 = isCardinal ? 148 : 164;
          return (
            <line
              key={i}
              x1={200 + Math.sin(angle) * r1}
              y1={200 - Math.cos(angle) * r1}
              x2={200 + Math.sin(angle) * r2}
              y2={200 - Math.cos(angle) * r2}
              stroke="#171412"
              strokeWidth={isCardinal ? 4 : 1.2}
            />
          );
        })}

        {/* Cardinal Directions */}
        <text x="200" y="52" textAnchor="middle" fill="#171412" fontSize="14" fontFamily="Space Grotesk, monospace" fontWeight="900">
          N (16.99° N)
        </text>
        <text x="352" y="205" textAnchor="middle" fill="#171412" fontSize="14" fontFamily="Space Grotesk, monospace" fontWeight="900">
          E
        </text>
        <text x="200" y="360" textAnchor="middle" fill="#171412" fontSize="14" fontFamily="Space Grotesk, monospace" fontWeight="900">
          S
        </text>
        <text x="48" y="205" textAnchor="middle" fill="#171412" fontSize="14" fontFamily="Space Grotesk, monospace" fontWeight="900">
          W (ARABIAN SEA)
        </text>

        {/* Brix Scale Arc */}
        <path
          d="M 120 200 A 80 80 0 1 1 280 200"
          fill="none"
          stroke="#EAE0D1"
          strokeWidth="8"
        />
        <path
          d="M 120 200 A 80 80 0 0 1 260 145"
          fill="none"
          stroke="#E85D04"
          strokeWidth="8"
          strokeLinecap="round"
        />

        <text
          x="200"
          y="120"
          textAnchor="middle"
          fill="#171412"
          fontSize="11"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.2em"
          fontWeight="bold"
        >
          MARITIME SOLAR COMPASS
        </text>

        <text
          x="200"
          y="180"
          textAnchor="middle"
          fill="#171412"
          fontSize="30"
          fontFamily="Sink, Impact, sans-serif"
          fontWeight="900"
        >
          24° BRIX
        </text>
        <text
          x="200"
          y="200"
          textAnchor="middle"
          fill="#E85D04"
          fontSize="10"
          fontFamily="Space Grotesk, monospace"
          fontWeight="bold"
          letterSpacing="0.1em"
        >
          TREE-RIPENED RATNAGIRI
        </text>

        <text
          x="200"
          y="280"
          textAnchor="middle"
          fill="#7A6F66"
          fontSize="9"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.15em"
        >
          ZERO ARTIFICIAL RIPENING
        </text>

        {/* Compass Needle (Nautical pointer) */}
        <polygon points="200,85 208,200 192,200" fill="#E85D04" />
        <polygon points="200,315 208,200 192,200" fill="#171412" />

        {/* Rotating Solar Dot Pip */}
        <g className="origin-center animate-[spin_45s_linear_infinite]">
          <line x1="200" y1="200" x2="200" y2="70" stroke="#171412" strokeWidth="1.5" strokeDasharray="4,3" />
          <circle cx="200" cy="70" r="10" fill="#FFB703" stroke="#171412" strokeWidth="2" />
        </g>

        <circle cx="200" cy="200" r="14" fill="#171412" />
        <circle cx="200" cy="200" r="5" fill="#FAF6EE" />
      </svg>
    </div>
  );
};

// 3. Nilgiri High-Altitude Chlorophyll Barometer
const AltitudeInstrument: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center select-none group">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      >
        <circle cx="200" cy="200" r="188" fill="#FBF8F2" stroke="#171412" strokeWidth="4" />

        {/* Altitude Concentric Rings */}
        <circle cx="200" cy="200" r="160" fill="none" stroke="#D8CDBE" strokeWidth="1" />
        <circle cx="200" cy="200" r="130" fill="none" stroke="#171412" strokeWidth="1.5" strokeDasharray="2,4" />
        <circle cx="200" cy="200" r="100" fill="none" stroke="#D8CDBE" strokeWidth="1" />

        {/* Altitude Graduation Notches (0m to 2500m) */}
        {Array.from({ length: 50 }).map((_, i) => {
          const angle = ((i * 5.5 - 135) * Math.PI) / 180;
          const r1 = 175;
          const r2 = i % 5 === 0 ? 152 : 164;
          return (
            <line
              key={i}
              x1={200 + Math.cos(angle) * r1}
              y1={200 + Math.sin(angle) * r1}
              x2={200 + Math.cos(angle) * r2}
              y2={200 + Math.sin(angle) * r2}
              stroke="#171412"
              strokeWidth={i % 5 === 0 ? 3 : 1.2}
            />
          );
        })}

        {/* Altitude Pin at 2,100M */}
        <circle cx="295" cy="115" r="7" fill="#2D6A4F" stroke="#171412" strokeWidth="2" />
        <text x="310" y="120" fill="#2D6A4F" fontSize="12" fontFamily="Space Grotesk, monospace" fontWeight="900">
          2,100M PEAK
        </text>

        <text
          x="200"
          y="105"
          textAnchor="middle"
          fill="#171412"
          fontSize="11"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.2em"
          fontWeight="bold"
        >
          ALPINE ELEVATION BAROMETER
        </text>

        <text
          x="200"
          y="180"
          textAnchor="middle"
          fill="#171412"
          fontSize="28"
          fontFamily="Sink, Impact, sans-serif"
          fontWeight="900"
        >
          14°C MIST
        </text>
        <text
          x="200"
          y="200"
          textAnchor="middle"
          fill="#2D6A4F"
          fontSize="11"
          fontFamily="Space Grotesk, monospace"
          fontWeight="bold"
          letterSpacing="0.1em"
        >
          OOTY HIGHLANDS
        </text>

        <text
          x="200"
          y="280"
          textAnchor="middle"
          fill="#7A6F66"
          fontSize="9"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.2em"
        >
          DENSE LIVING CHLOROPHYLL
        </text>

        {/* Barometer Needle pointing to 2,100M */}
        <line x1="200" y1="200" x2="288" y2="120" stroke="#171412" strokeWidth="4.5" strokeLinecap="round" />

        {/* Sweeping Botanical Dot Pip */}
        <g className="origin-center animate-[spin_55s_linear_infinite]">
          <line x1="200" y1="220" x2="200" y2="55" stroke="#171412" strokeWidth="1.5" />
          <circle cx="200" cy="75" r="9" fill="#52B788" stroke="#171412" strokeWidth="2" />
        </g>

        <circle cx="200" cy="200" r="14" fill="#171412" />
        <circle cx="200" cy="200" r="5" fill="#FAF6EE" />
      </svg>
    </div>
  );
};

// 4. Wayanad Rainforest Bio-Potency Chronometer
const RainforestInstrument: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 flex items-center justify-center select-none group">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full drop-shadow-xl transition-transform duration-700 ease-out group-hover:scale-[1.02]"
      >
        <circle cx="200" cy="200" r="188" fill="#FBF8F2" stroke="#171412" strokeWidth="4" />
        <circle cx="200" cy="200" r="180" fill="none" stroke="#A44200" strokeWidth="2" strokeDasharray="4,4" />

        {/* Outer Dual Concentric Calibrations */}
        {Array.from({ length: 48 }).map((_, i) => {
          const angle = (i * 7.5 * Math.PI) / 180;
          const isMajor = i % 4 === 0;
          return (
            <line
              key={i}
              x1={200 + Math.sin(angle) * 175}
              y1={200 - Math.cos(angle) * 175}
              x2={200 + Math.sin(angle) * (isMajor ? 152 : 165)}
              y2={200 - Math.cos(angle) * (isMajor ? 152 : 165)}
              stroke="#171412"
              strokeWidth={isMajor ? 3.5 : 1.2}
            />
          );
        })}

        {/* Absorption Multiplier Arc */}
        <path
          d="M 110 270 A 120 120 0 1 1 290 270"
          fill="none"
          stroke="#EAE0D1"
          strokeWidth="10"
        />
        <path
          d="M 110 270 A 120 120 0 1 1 270 125"
          fill="none"
          stroke="#A44200"
          strokeWidth="10"
          strokeLinecap="round"
        />

        <text
          x="200"
          y="110"
          textAnchor="middle"
          fill="#171412"
          fontSize="11"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.2em"
          fontWeight="bold"
        >
          BIO-ACTIVE EXTRACTION
        </text>

        <text
          x="200"
          y="178"
          textAnchor="middle"
          fill="#171412"
          fontSize="28"
          fontFamily="Sink, Impact, sans-serif"
          fontWeight="900"
        >
          +2000%
        </text>
        <text
          x="200"
          y="198"
          textAnchor="middle"
          fill="#A44200"
          fontSize="11"
          fontFamily="Space Grotesk, monospace"
          fontWeight="bold"
        >
          PIPERINE SYNERGY
        </text>

        <text
          x="200"
          y="278"
          textAnchor="middle"
          fill="#7A6F66"
          fontSize="9"
          fontFamily="Space Grotesk, monospace"
          letterSpacing="0.2em"
        >
          WESTERN GHATS PERENNIAL CANOPY
        </text>

        {/* Dual Needle Array */}
        <line x1="200" y1="200" x2="140" y2="140" stroke="#171412" strokeWidth="5" strokeLinecap="round" />
        <line x1="200" y1="200" x2="265" y2="130" stroke="#A44200" strokeWidth="4" strokeLinecap="round" />

        {/* Mechanical Swiss Ticking Second Hand */}
        <g className="origin-center animate-[spin_60s_steps(60)_infinite]">
          <line x1="200" y1="225" x2="200" y2="55" stroke="#171412" strokeWidth="1.6" />
          <circle cx="200" cy="80" r="9" fill="#D97706" stroke="#171412" strokeWidth="2" />
        </g>

        <circle cx="200" cy="200" r="14" fill="#171412" />
        <circle cx="200" cy="200" r="5" fill="#FAF6EE" />
      </svg>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Component: The Award-Winning Pinned Origin Scroll Journey
// ---------------------------------------------------------------------------
export const BentoGrid: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const ctx = gsap.context(() => {
      const totalChapters = CHAPTERS.length;

      gsap.to(track, {
        x: () => -(track.scrollWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          id: 'terroir-scroll',
          trigger: container,
          pin: true,
          scrub: 0.85,
          start: 'top top',
          end: () => `+=${window.innerWidth * 3.4}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            setScrollProgress(p);
            const idx = Math.min(
              totalChapters - 1,
              Math.floor(p * totalChapters + 0.1)
            );
            setActiveIdx(idx);
          },
        },
      });
    }, container);

    return () => ctx.revert();
  }, []);

  const jumpToChapter = (idx: number) => {
    playPopSound();
    if (!containerRef.current) return;
    const container = containerRef.current;
    const start = container.offsetTop;
    const totalDistance = window.innerWidth * 3.4;
    const targetScroll = start + (idx / (CHAPTERS.length - 1)) * totalDistance;
    window.scrollTo({
      top: targetScroll,
      behavior: 'smooth',
    });
  };

  return (
    <section
      id="terroir"
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden select-none bg-brand-950 text-brand-cream"
    >
      {/* ------------------------------------------------------------------- */}
      {/* 1. Sticky Top Editorial Header (Remains visible during full pin) */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 sm:px-12 py-5 sm:py-7 flex items-center justify-between border-b border-white/10 backdrop-blur-md bg-brand-950/70">
        <div className="flex items-center gap-3 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase">
          <span className="w-2.5 h-2.5 rounded-full bg-brand-amber animate-pulse" />
          <span className="text-white">ACT I / 01 &bull; THE TERROIR ORIGIN</span>
          <span className="hidden md:inline text-white/40">&bull;</span>
          <span className="hidden md:inline text-white/60 font-normal">
            SINGLE-ORIGIN INDIAN HARVESTS
          </span>
        </div>

        <div className="font-mono text-xs tracking-wider text-brand-gold hidden sm:flex items-center gap-2">
          <span>CHAPTER {CHAPTERS[activeIdx].step} / 04</span>
          <span className="text-white/30">&bull;</span>
          <span className="text-white/70">{CHAPTERS[activeIdx].region}</span>
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 2. Horizontal Scrolling Pinned Track */}
      {/* ------------------------------------------------------------------- */}
      <div
        ref={trackRef}
        className="flex h-full will-change-transform"
        style={{ width: `${CHAPTERS.length * 100}vw` }}
      >
        {CHAPTERS.map((ch, idx) => {
          const isDark = ch.theme === 'dark';

          return (
            <div
              key={ch.id}
              className={`w-screen h-screen flex-shrink-0 relative flex flex-col justify-between pt-24 sm:pt-28 pb-16 px-6 sm:px-12 lg:px-20 transition-colors duration-700 ${
                isDark
                  ? 'bg-gradient-to-b from-[#0C0A09] via-[#14110F] to-[#0A0908] text-white'
                  : 'bg-gradient-to-b from-[#F7F4EC] via-[#F2ECE0] to-[#EAE2D2] text-brand-950'
              }`}
            >
              {/* Subtle Atmospheric Film Grain Texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.035]"
                style={{
                  backgroundImage: `radial-gradient(${isDark ? '#FFF' : '#000'} 1px, transparent 0)`,
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Top Metadata Strip */}
              <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-4 font-mono text-xs tracking-widest uppercase">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-brand-amber">{ch.code}</span>
                  <span className="text-black/30 dark:text-white/30">&bull;</span>
                  <span className="text-black/70 dark:text-white/70">{ch.coordinates}</span>
                </div>
                <div className="hidden sm:block text-black/50 dark:text-white/50 text-[11px]">
                  {ch.altitude}
                </div>
              </div>

              {/* Center Main Split: Hero Typography & Precision Instrument */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto z-10">
                
                {/* Left Column: Brutalist Editorial Typography (7 Cols) */}
                <div className="lg:col-span-7 space-y-6">
                  {idx === 0 ? (
                    // Cover Slide Layout (Identical to Jeffrey Blum's BORN IN... BUILT IN... layout)
                    <div className="space-y-4">
                      <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight leading-[0.85]">
                        <span className="block text-white">{ch.headlineFirst}</span>
                        <span className="block text-brand-amber">{ch.headlineSecond}</span>
                      </h2>

                      <div className="pt-4 flex items-center gap-3 font-mono text-xs sm:text-sm text-white/70 tracking-wider">
                        <span className="w-8 h-[2px] bg-brand-amber inline-block" />
                        <span>SCROLL TO TRAVEL THROUGH THE ORIGINS</span>
                        <ArrowDown className="w-4 h-4 text-brand-amber animate-bounce" />
                      </div>

                      <p className="text-sm sm:text-base text-white/80 max-w-xl font-normal leading-relaxed pt-3">
                        {ch.narrative}
                      </p>
                    </div>
                  ) : (
                    // Terroir Chapter Layout (Identical to Swiss watch / city slide layout)
                    <div className="space-y-4">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/15 dark:border-white/15 bg-black/5 dark:bg-white/5 font-mono text-[11px] font-bold tracking-widest uppercase text-brand-amber">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{ch.produceName}</span>
                      </div>

                      <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tight leading-[0.84] text-brand-950 dark:text-white">
                        <span className="block">{ch.headlineFirst}</span>
                        <span className="block text-brand-amber">{ch.headlineSecond}</span>
                      </h2>

                      <p className="text-sm sm:text-base md:text-lg text-brand-800 dark:text-white/85 max-w-xl font-normal leading-relaxed">
                        {ch.narrative}
                      </p>

                      {/* Editorial Callout */}
                      <div className="pt-4 border-t border-black/10 dark:border-white/10 flex items-start gap-6 font-mono">
                        <div>
                          <span className="text-[10px] tracking-widest text-black/50 dark:text-white/50 block font-bold uppercase">
                            {ch.calloutPrefix}
                          </span>
                          <span className="font-display text-2xl sm:text-3xl font-black text-brand-950 dark:text-white uppercase tracking-tight block mt-0.5">
                            {ch.calloutTitle}
                          </span>
                          <span className="text-xs text-brand-700 dark:text-white/70 block mt-1 font-sans">
                            {ch.calloutNote}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column: Mechanical Swiss-Style Precision Instrument (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
                  <div className="cursor-pointer" onClick={() => playChimeSound()}>
                    {ch.dialType === 'curcumin' && <CurcuminInstrument active={activeIdx === idx} />}
                    {ch.dialType === 'solar' && <SolarInstrument active={activeIdx === idx} />}
                    {ch.dialType === 'altitude' && <AltitudeInstrument active={activeIdx === idx} />}
                    {ch.dialType === 'rainforest' && <RainforestInstrument active={activeIdx === idx} />}
                  </div>

                  <span className="mt-3 font-mono text-[10px] uppercase tracking-widest text-black/40 dark:text-white/40">
                    &bull; TAP INSTRUMENT TO TEST MECHANICAL TICK &bull;
                  </span>
                </div>
              </div>

              {/* Bottom Terroir Certifications */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-black/10 dark:border-white/10 font-mono text-xs text-black/60 dark:text-white/60">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-brand-950 dark:text-white">CERTIFIED TERROIR</span>
                  <span>&bull;</span>
                  <span>100% ORGANIC CERTIFIED</span>
                  <span>&bull;</span>
                  <span className="text-brand-amber font-bold">ZERO FAST BLADES &bull; ZERO HEAT</span>
                </div>

                <div className="text-right text-[11px] text-black/40 dark:text-white/40 hidden md:block">
                  {ch.state} &bull; {ch.coordinates}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 3. Sticky Right Rail: Chapter Navigation Index (Direct Blum Jeffrey) */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-4 font-mono text-xs select-none">
        {CHAPTERS.map((ch, idx) => {
          const isActive = activeIdx === idx;
          return (
            <button
              key={ch.id}
              onClick={() => jumpToChapter(idx)}
              className="group flex items-center justify-end gap-3 text-right py-1 transition-all"
            >
              <span
                className={`transition-colors uppercase tracking-widest ${
                  isActive
                    ? 'text-brand-amber font-bold'
                    : 'text-white/40 group-hover:text-white/80'
                }`}
              >
                {ch.code}
              </span>
              <span
                className={`block h-[2px] transition-all duration-300 ${
                  isActive
                    ? 'w-10 bg-brand-amber'
                    : 'w-4 bg-white/20 group-hover:w-7 group-hover:bg-white/60'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* 4. Bottom Horizontal Progress Line */}
      {/* ------------------------------------------------------------------- */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/15 z-40">
        <div
          className="h-full bg-brand-amber transition-all duration-150 ease-out"
          style={{ width: `${Math.max(4, scrollProgress * 100)}%` }}
        />
      </div>
    </section>
  );
};
