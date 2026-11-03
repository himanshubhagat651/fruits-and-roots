import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { ThreeJuiceGlassCanvas } from './ThreeJuiceGlassCanvas';
import { FloatingProduce } from './FloatingProduce';
import { playPopSound, playChimeSound } from '../utils/audio';
import { ArrowRight, Sparkles, ShieldCheck, RotateCcw } from 'lucide-react';

interface HeroJuiceItem {
  id: string;
  name: string;
  shortName: string;
  colorHex: string;
  productIndex: number;
}

const HERO_ITEMS: HeroJuiceItem[] = [
  {
    id: 'golden-roots-glow',
    name: 'Golden Roots Glow',
    shortName: 'GOLDEN',
    colorHex: '#FFA826',
    productIndex: 0,
  },
  {
    id: 'emerald-canopy-detox',
    name: 'Emerald Canopy',
    shortName: 'EMERALD',
    colorHex: '#3D6847',
    productIndex: 1,
  },
  {
    id: 'ruby-beet-vitality',
    name: 'Ruby Beet Vitality',
    shortName: 'RUBY',
    colorHex: '#8F1E42',
    productIndex: 2,
  },
  {
    id: 'pitaya-sunrise-velvet',
    name: 'Dragon Fruit Sunrise Nectar',
    shortName: 'DRAGON',
    colorHex: '#C02856',
    productIndex: 3,
  },
  {
    id: 'blue-majik-cloud',
    name: 'Blue Majik Marine Tonic',
    shortName: 'BLUE',
    colorHex: '#1B6CA8',
    productIndex: 4,
  },
];

export const Hero: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  const activeHero = HERO_ITEMS[activeIdx];
  const activeProduct = PRODUCTS[activeHero.productIndex] || PRODUCTS[0];

  return (
    <section
      id="prologue"
      className="relative min-h-[96vh] flex flex-col justify-between pt-6 pb-12 bg-brand-cream overflow-hidden border-b border-brand-800/10 select-none"
    >
      {/* Procedural Subtle Botanical Parallax Layer */}
      <FloatingProduce />

      {/* Dynamic Ambient Warmth Halo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full blur-[160px] opacity-25 transition-all duration-1000 pointer-events-none"
        style={{ backgroundColor: activeHero.colorHex }}
      />

      {/* Center Giant Hero Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 py-6 my-auto">
        
        {/* Editorial Headline */}
        <div className="text-center space-y-3 mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-amber/15 border border-brand-amber/30 text-brand-950 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
            <span>100% Raw &bull; Zero Heat &bull; Cold-Pressed Daily in Mumbai</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-brand-950 uppercase leading-[0.88]">
            COLD-PRESSED.<br />
            <span className="font-editorial italic font-normal text-brand-amber lowercase tracking-normal">
              unapologetically
            </span>{' '}
            RAW.
          </h1>

          <p className="text-sm sm:text-base text-brand-800 max-w-xl mx-auto pt-2 font-normal leading-relaxed">
            Freshly extracted every sunrise from 1.8 kg of single-origin Indian harvests. Zero added sugars, zero preservatives. Delivered ice-cold to your doorstep in Mumbai.
          </p>
        </div>

        {/* Real 3D WebGL Juice Glass & Fresh Fruits Canvas Stage */}
        <div className="relative max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[460px] sm:min-h-[520px]">
          
          <div className="w-full h-full min-h-[460px] sm:min-h-[520px] relative z-10">
            <ThreeJuiceGlassCanvas
              colorHex={activeHero.colorHex}
              flavorIndex={activeIdx}
            />
          </div>

          {/* Interactive Drag & Swirl Hint */}
          <div className="absolute bottom-1 inset-x-0 flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-wider text-brand-700 bg-brand-cream/80 backdrop-blur-md py-1.5 px-4 rounded-full border border-brand-800/10 shadow-xs max-w-fit mx-auto z-20">
            <RotateCcw className="w-3.5 h-3.5 text-brand-amber" />
            <span>DRAG TO ROTATE &bull; TAP TO SWIRL JUICE</span>
          </div>
        </div>

        {/* Interactive Juice Flavour Switcher Controls */}
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {HERO_ITEMS.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveIdx(idx);
                playPopSound();
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2.5 border cursor-pointer ${
                activeIdx === idx
                  ? 'bg-brand-950 text-brand-cream border-brand-950 shadow-xl scale-105'
                  : 'bg-white text-brand-900 border-brand-800/15 hover:border-brand-800/40 hover:bg-brand-parchment hover:scale-102'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full shadow-xs" style={{ backgroundColor: item.colorHex }} />
              <span>{item.shortName}</span>
            </button>
          ))}
        </div>

        {/* High-Impact Actions */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#catalog"
            onClick={() => playPopSound()}
            className="w-full sm:w-auto px-10 py-4 rounded-full bg-[#8A1521] hover:bg-[#680D1A] text-white font-mono font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>ORDER FRESH JUICES</span>
            <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-1.5 transition-transform" />
          </a>

          <a
            href="#plans"
            onClick={() => playPopSound()}
            className="w-full sm:w-auto px-9 py-4 rounded-full bg-brand-950 hover:bg-brand-900 text-brand-cream font-mono font-black text-xs tracking-widest uppercase transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-brand-amber" />
            <span>CLEANSE PLANS (SAVE 15%)</span>
          </a>
        </div>
      </div>

      {/* Bottom Customer Trust & Delivery Ticker */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono uppercase tracking-wider text-brand-700 border-t border-brand-800/10 pt-4">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-brand-moss" />
          <span>Chilled 2-Hour Delivery in Mumbai &bull; 2.2&deg;C Cold-Chain</span>
        </div>
        <a
          href="#catalog"
          className="flex items-center gap-1.5 text-brand-950 font-black cursor-pointer hover:text-brand-amber"
        >
          <span>Explore The Full Juice Menu &darr;</span>
        </a>
        <div className="flex items-center gap-2 font-bold">
          <span>Pure Reusable Glass Bottle</span>
          <span>&bull;</span>
          <span className="text-brand-amber">&#8377;25 Bottle Return Credit</span>
        </div>
      </div>
    </section>
  );
};
