import React, { useState } from 'react';
import { playPopSound } from '../utils/audio';
import { ShieldCheck, Leaf, MapPin, Gauge, RotateCcw, ArrowUpRight, Sparkles } from 'lucide-react';

interface Farm {
  name: string;
  produce: string;
  region: string;
  distance: string;
  soilScore: number;
}

const FARMS: Farm[] = [
  { name: 'Jaintia Hills Organics', produce: 'Lakadong 7.5% Curcumin Turmeric', region: 'Jaintia Hills, Meghalaya', distance: '2,150 km', soilScore: 99 },
  { name: 'Konkan Coast Orchards', produce: 'GI-Tagged Ratnagiri Alphonso', region: 'Ratnagiri, Maharashtra', distance: '340 km', soilScore: 99 },
  { name: 'Nilgiri Mountain Farms', produce: 'Organic Curly Kale & Celery', region: 'Ooty, Tamil Nadu', distance: '1,120 km', soilScore: 98 },
  { name: 'Wayanad Forest Soils', produce: 'High-Gingerol Ginger & Black Pepper', region: 'Western Ghats, Kerala', distance: '1,180 km', soilScore: 98 },
];

export const BentoGrid: React.FC = () => {
  const [activeFarmIdx, setActiveFarmIdx] = useState(0);
  const [psiLevel, setPsiLevel] = useState(15000);
  const activeFarm = FARMS[activeFarmIdx];

  return (
    <section id="terroir" className="py-20 sm:py-32 bg-brand-cream border-t border-brand-950/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-brand-950/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 text-brand-cream text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              <span>ACT I • SOURCED FROM ORGANIC INDIAN FARMS</span>
            </div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-brand-950 uppercase tracking-tight leading-[0.9]">
              Grown with care in Indian soil.
            </h2>
            <p className="text-sm sm:text-base text-brand-700 mt-2 max-w-xl font-normal leading-relaxed">
              We don't buy from mass industrial wholesale markets. We work directly with certified organic family farms across Meghalaya, Kerala, and Himachal to pick the sweetest, cleanest, pesticide-free fruits and vegetables.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs font-bold text-brand-950">
            <span className="w-2 h-2 rounded-full bg-brand-amber animate-pulse" />
            <span>STANDARDS: FSSAI CERTIFIED • ZERO ADDED SUGAR • ZERO PRESERVATIVES</span>
          </div>
        </div>

        {/* Bento Grid Matrix */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 skew-on-scroll">
          
          {/* Bento Cell 1: Slow Cold-Press Method */}
          <div className="md:col-span-2 lg:col-span-2 md:row-span-2 bg-brand-950 text-brand-cream rounded-3xl p-8 sm:p-10 border border-brand-800/80 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
            {/* Ambient Background Warmth Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-brand-amber/15 blur-3xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between pb-4 border-b border-brand-800/60 font-mono text-xs">
                <span className="flex items-center gap-2 text-brand-gold font-bold uppercase tracking-wider">
                  <Gauge className="w-4 h-4 text-brand-amber" /> OUR COLD-PRESS METHOD
                </span>
                <span className="bg-brand-900 border border-brand-800 px-3 py-1 rounded-full text-brand-amber font-black">
                  SLOW COLD-PRESS
                </span>
              </div>

              <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black text-brand-cream mt-6 leading-[0.92] uppercase tracking-tight">
                Slowly Squeezed Cold.<br />
                <span className="font-editorial italic font-normal text-brand-amber lowercase tracking-normal">Never heated.</span>
              </h3>

              <p className="text-sm text-brand-cream/80 mt-4 leading-relaxed font-normal max-w-lg">
                Regular blenders and juicers use fast spinning metal blades that heat up fresh fruits, cooking away delicate vitamins before you take a sip. We gently press whole produce cold with slow hydraulic pressure—preserving every drop of fresh taste, natural color, and live vitamins.
              </p>
            </div>

            {/* Interactive Pressure Demonstration Slider */}
            <div className="mt-8 pt-6 border-t border-brand-800/60 space-y-4">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-brand-cream/80 font-semibold uppercase">HOW WE SQUEEZE JUICE COLD:</span>
                <span className="text-brand-amber font-black text-sm">Gentle Pressure Active</span>
              </div>

              <input
                type="range"
                min="1000"
                max="15000"
                step="500"
                value={psiLevel}
                onChange={(e) => {
                  setPsiLevel(Number(e.target.value));
                  if (Number(e.target.value) % 3000 === 0) playPopSound();
                }}
                className="w-full accent-brand-amber cursor-pointer h-2 bg-brand-900 rounded-lg"
              />

              <div className="grid grid-cols-3 gap-3 pt-2 text-center font-mono">
                <div className="p-3 rounded-2xl bg-brand-900/80 border border-brand-800">
                  <span className="text-[10px] text-brand-cream/80 block uppercase">HEAT GENERATED</span>
                  <span className="font-display text-xl font-bold text-brand-amber">0.0°C</span>
                </div>
                <div className="p-3 rounded-2xl bg-brand-900/80 border border-brand-800">
                  <span className="text-[10px] text-brand-cream/80 block uppercase">JUICE PURITY</span>
                  <span className="font-display text-xl font-bold text-brand-gold">100% Pure</span>
                </div>
                <div className="p-3 rounded-2xl bg-brand-900/80 border border-brand-800">
                  <span className="text-[10px] text-brand-cream/80 block uppercase">NATURAL VITAMINS</span>
                  <span className="font-display text-xl font-bold text-brand-cream">100% Intact</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Cell 2: Organic Farm Quality (1 col, 2 rows) */}
          <div className="md:col-span-1 lg:col-span-1 md:row-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-brand-950/10 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-brand-950/10 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-brand-950 font-bold uppercase tracking-wider">
                  <Leaf className="w-4 h-4 text-brand-moss" /> FARM QUALITY
                </span>
                <span className="text-brand-amber font-black text-xs">100% ORGANIC</span>
              </div>

              <div className="mt-6">
                <span className="font-display text-5xl font-black text-brand-950 block">
                  {activeFarm.soilScore}<span className="text-2xl text-brand-amber">/100</span>
                </span>
                <span className="font-mono text-xs uppercase tracking-widest text-brand-600 block mt-1 font-bold">
                  ORGANIC HARVEST SCORE
                </span>
              </div>

              <p className="text-xs text-brand-700 mt-4 leading-relaxed font-normal">
                Great juice starts with great soil. We source all our fruits, greens, and roots from trusted family farms that use zero chemical pesticides and 100% natural organic compost.
              </p>

              {/* Partner Farm Selector */}
              <div className="mt-6 space-y-2 font-mono">
                <span className="text-[10px] font-bold text-brand-950 uppercase tracking-wider block">
                  SELECT PARTNER REGION:
                </span>
                {FARMS.map((farm, idx) => (
                  <button
                    key={farm.name}
                    onClick={() => {
                      setActiveFarmIdx(idx);
                      playPopSound();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition border ${
                      activeFarmIdx === idx
                        ? 'bg-brand-parchment border-brand-amber/60 text-brand-950 shadow-xs font-bold'
                        : 'border-brand-950/10 hover:border-brand-950/30 text-brand-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate">{farm.name.split(' ')[0]}</span>
                      <span className="text-[10px] text-brand-amber">{farm.distance}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-brand-950/10 font-mono text-[11px] text-brand-600 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-brand-950">
                <MapPin className="w-3.5 h-3.5 text-brand-amber" />
                <span>{activeFarm.region}</span>
              </div>
              <p className="text-brand-700 text-[10px]">{activeFarm.produce}</p>
            </div>
          </div>

          {/* Bento Cell 3: Gentle Freshness (1 col, 1 row) */}
          <div className="bg-brand-parchment rounded-3xl p-6 border border-brand-950/10 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-brand-950/10 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-brand-950 font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-brand-amber" /> COLD FRESHNESS
                </span>
                <span className="font-bold text-[10px] bg-brand-950 text-white px-2 py-0.5 rounded">
                  NEVER BOILED
                </span>
              </div>

              <h4 className="font-display text-2xl font-black text-brand-950 mt-4 leading-tight uppercase tracking-tight">
                No Boiled Juice. Ever.
              </h4>

              <p className="text-xs text-brand-700 mt-2 leading-relaxed">
                Supermarket juices are heated and boiled to sit on shelves for months. We use clean cold water pressure to keep our juice completely safe while keeping all its fresh flavor and live vitamins.
              </p>
            </div>

            <div className="pt-4 border-t border-brand-950/10 flex items-center justify-between font-mono text-xs">
              <span className="text-brand-600 font-bold">NATURAL VITAMINS:</span>
              <span className="text-brand-moss font-black">100% INTACT</span>
            </div>
          </div>

          {/* Bento Cell 4: Circular Glass Deposit Program (1 col, 1 row) */}
          <div className="bg-white rounded-3xl p-6 border border-brand-950/10 shadow-lg flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-brand-950/10 font-mono text-xs">
                <span className="flex items-center gap-1.5 text-brand-950 font-bold uppercase tracking-wider">
                  <RotateCcw className="w-4 h-4 text-brand-amber" /> REUSABLE GLASS
                </span>
                <span className="font-bold text-brand-amber text-xs">+₹25 / BOTTLE</span>
              </div>

              <h4 className="font-display text-2xl font-black text-brand-950 mt-4 leading-tight uppercase tracking-tight">
                Zero Plastic. Pure Glass.
              </h4>

              <p className="text-xs text-brand-700 mt-2 leading-relaxed">
                All our juices are poured into clean, reusable glass bottles. Simply hand your rinsed empty bottles to our delivery rider and receive ₹25 per bottle back on UPI.
              </p>
            </div>

            <div className="pt-4 border-t border-brand-950/10 flex items-center justify-between font-mono text-xs">
              <span className="text-brand-600 font-bold">PLASTIC BOTTLES SAVED:</span>
              <span className="text-brand-950 font-black">248,600+</span>
            </div>
          </div>

          {/* Bento Cell 5: Live Press Room Telemetry (2 cols, 1 row on large) */}
          <div className="md:col-span-2 lg:col-span-4 bg-brand-cream rounded-3xl p-6 sm:p-8 border border-brand-950/10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-2xl bg-brand-950 text-brand-gold flex items-center justify-center font-display text-lg font-black shrink-0 shadow-md">
                2.2°C
              </div>
              <div>
                <span className="text-xs font-bold text-brand-950 block uppercase tracking-wider">
                  COLD-CHAIN INTEGRITY DISPATCH
                </span>
                <span className="text-xs text-brand-700 block mt-0.5">
                  Mumbai Flagship Press Room 01 (Bandra West) • Monitored 24/7 at 2.2°C from hydraulic press to doorstep.
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <div className="px-4 py-2 rounded-xl bg-white border border-brand-950/10 text-xs text-brand-950 font-bold shadow-xs">
                LOT BATCH: <span className="text-brand-amber">#0849-BOM</span>
              </div>
              <a
                href="#catalog"
                onClick={() => playPopSound()}
                className="px-6 py-2.5 rounded-xl bg-brand-950 text-brand-cream hover:bg-brand-900 text-xs font-black uppercase tracking-wider transition shadow-md flex items-center gap-1.5"
              >
                <span>EXPLORE BLENDS</span>
                <ArrowUpRight className="w-4 h-4 text-brand-gold" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
