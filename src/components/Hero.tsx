import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { FloatingProduce } from './FloatingProduce';
import { playPopSound, playChimeSound } from '../utils/audio';
import { ArrowRight, Sparkles, ShieldCheck, ShoppingBag, Eye } from 'lucide-react';

interface HeroJuiceItem {
  id: string;
  name: string;
  shortName: string;
  colorHex: string;
  image: string;
  fruitTitle: string;
  fruitDescription: string;
  fruitsBeside: string[];
  productIndex: number;
}

const HERO_ITEMS: HeroJuiceItem[] = [
  {
    id: 'golden-roots-glow',
    name: 'Golden Roots Glow',
    shortName: 'GOLDEN',
    colorHex: '#FFA826',
    image: '/images/hero/golden-glass-fruit.jpg',
    fruitTitle: 'Fresh Nagpur Oranges & Lakadong Turmeric',
    fruitDescription: 'Chilled citrus elixir with whole and sliced Nagpur oranges & wild turmeric root beside the glass.',
    fruitsBeside: ['Nagpur Oranges', 'Turmeric Root', 'Golden Apples', 'Assam Lime'],
    productIndex: 0,
  },
  {
    id: 'emerald-canopy-detox',
    name: 'Emerald Canopy',
    shortName: 'EMERALD',
    colorHex: '#3D6847',
    image: '/images/hero/emerald-glass-fruit.jpg',
    fruitTitle: 'Crisp Green Apple, Celery & Cucumber',
    fruitDescription: 'Vibrant living green cold-press with crisp sliced green apples, cucumber wheels & mountain celery stalks beside the glass.',
    fruitsBeside: ['Green Apple', 'Crisp Cucumber', 'Celery Stalks', 'Garden Mint'],
    productIndex: 1,
  },
  {
    id: 'ruby-beet-vitality',
    name: 'Ruby Beet Vitality',
    shortName: 'RUBY',
    colorHex: '#8F1E42',
    image: '/images/hero/ruby-user-highres.jpg',
    fruitTitle: 'Solan Pomegranate & Ooty Crimson Beet',
    fruitDescription: 'Deep ruby cold-press with a whole ripe pomegranate & open ruby seeds spilling beside the glass on the counter.',
    fruitsBeside: ['Whole Pomegranate', 'Pomegranate Seeds', 'Crimson Beet', 'Wild Berries'],
    productIndex: 2,
  },
  {
    id: 'pitaya-sunrise-velvet',
    name: 'Dragon Fruit Sunrise Nectar',
    shortName: 'DRAGON',
    colorHex: '#C02856',
    image: '/images/hero/dragon-glass-fruit.jpg',
    fruitTitle: 'Pink Dragonfruit & Ratnagiri Alphonso Mango',
    fruitDescription: 'Chilled magenta pitaya nectar with fresh sliced dragon fruit & sun-kissed Alphonso mango wedges beside the glass.',
    fruitsBeside: ['Pink Dragonfruit', 'Alphonso Mango', 'Tender Coconut', 'Assam Lime'],
    productIndex: 3,
  },
  {
    id: 'blue-majik-cloud',
    name: 'Blue Majik Marine Tonic',
    shortName: 'BLUE',
    colorHex: '#1B6CA8',
    image: '/images/hero/blue-glass-fruit.jpg',
    fruitTitle: 'Blue Spirulina, Tender Coconut & Pineapple',
    fruitDescription: 'Radiant azure botanical tonic with fresh cracked coconut, golden pineapple slice & fresh mint beside the glass.',
    fruitsBeside: ['Blue Spirulina', 'Cracked Coconut', 'Golden Pineapple', 'Cooling Mint'],
    productIndex: 4,
  },
];

export const Hero: React.FC = () => {
  const { addToCart, openProductModal } = useCart();
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

        {/* Fresh Cold-Pressed Juice Glass & Fruit Presentation Showcase */}
        <div className="relative max-w-3xl mx-auto flex flex-col items-center justify-center my-3">
          
          {/* Main Visual Showcase Card */}
          <div
            onClick={() => {
              openProductModal(activeProduct);
              playPopSound();
            }}
            className="w-full relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#FAF6EE] border-2 border-brand-950/15 shadow-[0_20px_50px_-12px_rgba(23,20,18,0.22)] cursor-pointer group transition-all duration-500 hover:shadow-[0_28px_65px_-10px_rgba(23,20,18,0.28)]"
          >
            {/* Top Floating Badges */}
            <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-20 flex items-center gap-2">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cream/92 backdrop-blur-md border border-brand-950/10 shadow-sm text-[11px] font-mono font-bold uppercase tracking-wider text-brand-950">
                <span className="w-2.5 h-2.5 rounded-full animate-pulse shadow-xs" style={{ backgroundColor: activeHero.colorHex }} />
                <span>{activeHero.name}</span>
              </div>
            </div>

            <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-950/85 backdrop-blur-md text-brand-cream text-[10px] sm:text-[11px] font-mono font-bold tracking-wider uppercase shadow-sm">
              <span className="text-brand-amber">❄</span>
              <span>CHILLED AT 2.2°C</span>
            </div>

            {/* Juice Glass & Fruit Beside Image Display */}
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[440px] sm:max-h-[480px] overflow-hidden bg-brand-cream/40 flex items-center justify-center">
              <img
                key={activeHero.id}
                src={activeHero.image}
                alt={`${activeHero.name} juice in a glass with fresh ${activeHero.fruitTitle} beside it`}
                className="w-full h-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 select-none animate-in fade-in zoom-in-95"
              />

              {/* Subtle ambient lighting vignette & bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-brand-950/15 to-transparent pointer-events-none" />
            </div>

            {/* Editorial Glass & Fruit Bar Overlay */}
            <div className="absolute bottom-3 inset-x-3 sm:bottom-4 sm:inset-x-4 z-20 p-3.5 sm:p-4 rounded-2xl bg-brand-cream/94 backdrop-blur-md border border-brand-950/10 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-mono font-bold text-brand-amber uppercase tracking-widest">
                    RAW HARVEST BESIDE THE GLASS:
                  </span>
                  {activeHero.fruitsBeside.map((fruit) => (
                    <span
                      key={fruit}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-950/5 border border-brand-950/10 text-brand-900"
                    >
                      {fruit}
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm font-display font-black text-brand-950 uppercase tracking-tight">
                  {activeHero.fruitDescription}
                </p>
              </div>

              {/* Quick Add To Bag Action */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className="font-display font-black text-sm text-brand-950">
                  ₹{activeProduct.price}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(activeProduct);
                    playChimeSound();
                  }}
                  className="px-4 py-2 rounded-xl bg-brand-950 hover:bg-[#8A1521] text-brand-cream text-xs font-mono font-bold tracking-wider uppercase transition shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-brand-amber" />
                  <span>ADD TO BAG</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Tap Hint */}
          <div className="mt-2.5 text-center">
            <span className="text-[11px] font-mono uppercase tracking-wider text-brand-600">
              TAP SHOWCASE TO VIEW NUTRITION FACTS &bull; SWITCH FLAVOURS BELOW &darr;
            </span>
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
