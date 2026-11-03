import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product, FunctionalBenefit } from '../types';
import { playPopSound, playChimeSound } from '../utils/audio';
import { ArrowLeft, ArrowRight, Droplet, Star, Plus, Info, LayoutGrid, SlidersHorizontal, Sparkles, RefreshCw, Check } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Raw Juices' },
  { id: 'immunity', label: 'Immunity & Roots', benefitFilter: 'Immunity' },
  { id: 'greens', label: 'Alkaline Deep Greens', benefitFilter: 'Cellular Detox' },
  { id: 'energy', label: 'Cardiovascular & Energy', benefitFilter: 'Energy Boost' },
  { id: 'glow', label: 'Citrus Glow & Tonics', benefitFilter: 'Skin Glow' },
];

export const ProductCatalog: React.FC = () => {
  const { addToCart, openProductModal } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'runway' | 'grid'>('runway');
  const [scrollProgress, setScrollProgress] = useState(0);

  const runwayRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Filtered cold-pressed juices only
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const activeCat = CATEGORIES.find((c) => c.id === selectedCategory);
      const matchesCategory =
        selectedCategory === 'all' ||
        (activeCat?.benefitFilter && p.benefits.includes(activeCat.benefitFilter as any));
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.ingredients.some((ing) => ing.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Runway horizontal navigation
  const scrollRunway = (direction: 'left' | 'right') => {
    if (runwayRef.current) {
      playPopSound();
      const scrollAmount = direction === 'left' ? -460 : 460;
      runwayRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Track runway scroll progress for watermark parallax
  const handleRunwayScroll = () => {
    if (runwayRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = runwayRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    }
  };

  // Mouse drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!runwayRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - runwayRef.current.offsetLeft);
    setScrollLeftState(runwayRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !runwayRef.current) return;
    e.preventDefault();
    const x = e.pageX - runwayRef.current.offsetLeft;
    const walk = (x - startX) * 1.6;
    runwayRef.current.scrollLeft = scrollLeftState - walk;
    handleRunwayScroll();
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section
      id="catalog"
      className="py-20 sm:py-32 bg-[#FAF6EE] text-earth-950 relative overflow-hidden select-none border-t border-earth-900/10"
    >
      <div id="menu" className="absolute -top-24 pointer-events-none" />
      <div id="runway" className="absolute -top-24 pointer-events-none" />
      
      {/* Giant Ghost Watermark & Outline Contours drifting behind the cards */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 flex items-center justify-center">
        {/* Ambient Warm Botanical Halos */}
        <div
          className="absolute -top-24 -left-24 w-[560px] h-[560px] rounded-full bg-gradient-to-br from-[#C8741B]/20 via-[#8A1521]/15 to-transparent blur-[110px] pointer-events-none"
        />
        <div
          className="absolute -bottom-28 -right-28 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#8A1521]/25 via-[#C8741B]/15 to-transparent blur-[130px] pointer-events-none"
        />

        {/* Kinetic Watermark Marquee (Distinctly Visible & Movable) */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex whitespace-nowrap opacity-[0.28] sm:opacity-[0.35] transition-transform duration-100 ease-out will-change-transform drop-shadow-[0_4px_24px_rgba(200,116,27,0.30)]"
          style={{ transform: `translate3d(${-scrollProgress * 480}px, 0, 0)` }}
        >
          <div className="flex animate-ticker-left">
            <span className="font-display text-[20vw] sm:text-[24vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-12 select-none">
              FRUITS &amp; ROOTS &bull; RAW COLD-PRESSED JUICES &bull; 15,000 PSI HYDRAULIC &bull; 2.2&deg;C COLD-CHAIN &bull; MUMBAI &bull;
            </span>
          </div>
          <div className="flex animate-ticker-left" aria-hidden="true">
            <span className="font-display text-[20vw] sm:text-[24vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-12 select-none">
              FRUITS &amp; ROOTS &bull; RAW COLD-PRESSED JUICES &bull; 15,000 PSI HYDRAULIC &bull; 2.2&deg;C COLD-CHAIN &bull; MUMBAI &bull;
            </span>
          </div>
        </div>

        {/* Large Decorative Ghost Letter Outlines */}
        <div
          className="absolute -left-20 top-1/4 text-[#C8741B]/[0.22] font-display text-[45vw] font-black leading-none select-none pointer-events-none transition-transform duration-200 ease-out"
          style={{ transform: `translate3d(${scrollProgress * 150}px, 0, 0)` }}
        >
          J
        </div>
        <div
          className="absolute right-0 bottom-10 text-[#C8741B]/[0.22] font-display text-[35vw] font-black leading-none select-none pointer-events-none transition-transform duration-200 ease-out"
          style={{ transform: `translate3d(${-scrollProgress * 150}px, 0, 0)` }}
        >
          U
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Bar: Center Capsule Badge & Right Pill Link */}
        <div className="flex items-center justify-between pb-6 border-b border-earth-900/10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-black uppercase tracking-[0.2em] text-[#8A1521]">
              RAW COLD-PRESSED JUICES
            </span>
          </div>

          {/* Centered Daily Press Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8A1521] text-white font-mono text-[11px] font-black tracking-wider uppercase shadow-sm">
            <span className="w-2 h-2 rounded-full bg-cream-100 animate-pulse" />
            <span>PRESSED DAILY FROM 6:30 A.M. IST</span>
          </div>

          {/* Right Pill Link to Cleanse Plans */}
          <a
            href="#cleanses"
            className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full border border-earth-900/25 bg-white text-earth-950 font-mono text-xs font-black uppercase tracking-wider hover:bg-earth-950 hover:text-white transition-all shadow-2xs hover:scale-102"
          >
            <span>EXPLORE CLEANSE PLANS</span>
            <span className="text-sm font-sans font-bold">&nearr;</span>
          </a>
        </div>

        {/* Top Header: Pure Cold-Pressed Juice Menu */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-6 pb-8 border-b border-earth-900/15">
          <div className="space-y-2">
            {/* Burgundy Subtitle Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8A1521] animate-pulse" />
              <span className="text-xs sm:text-sm font-mono font-black uppercase tracking-[0.25em] text-[#8A1521]">
                100% UNPASTEURISED &bull; ZERO ADDED SUGAR &bull; 2.2&deg;C COLD-CHAIN
              </span>
            </div>

            {/* Giant Bold Headline */}
            <h2 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-[#8A1521] tracking-tight uppercase leading-[0.88]">
              THE LIVING<br />
              JUICE MENU.
            </h2>

            <p className="text-sm sm:text-base text-earth-800 max-w-xl pt-2 font-normal leading-relaxed">
              Pressed fresh daily from over 1.5 kg of organic Indian fruits and vegetables. Zero added sugar, zero preservatives. Bottled in reusable glass with &#8377;25 cashback on return.
            </p>
          </div>

          {/* Controls: Search, View Toggle, and Navigation Arrows */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Quick Search */}
            <input
              type="text"
              placeholder="Search ingredient (Lakadong, Kale)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-5 py-3 rounded-full border border-earth-900/20 bg-white text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#8A1521] w-full sm:w-64 shadow-xs"
            />

            {/* View Mode Toggle: Runway vs Grid */}
            <div className="inline-flex rounded-full bg-white p-1 border border-earth-900/15 shadow-xs font-mono text-xs font-bold">
              <button
                onClick={() => {
                  setViewMode('runway');
                  playPopSound();
                }}
                className={`px-4 py-2 rounded-full transition ${
                  viewMode === 'runway'
                    ? 'bg-[#A31D1D] text-white shadow-xs'
                    : 'text-earth-700 hover:text-earth-950'
                }`}
              >
                RUNWAY
              </button>
              <button
                onClick={() => {
                  setViewMode('grid');
                  playPopSound();
                }}
                className={`px-4 py-2 rounded-full transition flex items-center gap-1.5 ${
                  viewMode === 'grid'
                    ? 'bg-[#A31D1D] text-white shadow-xs'
                    : 'text-earth-700 hover:text-earth-950'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>GRID</span>
              </button>
            </div>

            {/* Navigation Arrows for Runway */}
            {viewMode === 'runway' && (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => scrollRunway('left')}
                  className="w-12 h-12 rounded-full bg-white border border-earth-900/20 text-earth-950 flex items-center justify-center hover:bg-cream-200 transition shadow-xs hover:scale-105 active:scale-95"
                  aria-label="Scroll left"
                >
                  <ArrowLeft className="w-5 h-5 text-earth-900" />
                </button>
                <button
                  onClick={() => scrollRunway('right')}
                  className="w-12 h-12 rounded-full bg-[#A31D1D] text-white flex items-center justify-center hover:bg-[#851616] transition shadow-md hover:scale-105 active:scale-95"
                  aria-label="Scroll right"
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Tabs Filter */}
        <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none font-mono">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                playPopSound();
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 border ${
                selectedCategory === cat.id
                  ? 'bg-earth-950 text-cream-100 border-earth-950 shadow-md scale-102'
                  : 'bg-white text-earth-800 hover:bg-cream-200 border-earth-900/15'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* VIEW 1: THE BAR TÒPAS SIGNATURE RUNWAY (HORIZONTAL CARD WAVE) */}
        {viewMode === 'runway' && (
          <div className="mt-14 relative skew-on-scroll">
            <div
              ref={runwayRef}
              onScroll={handleRunwayScroll}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className={`flex gap-8 sm:gap-10 overflow-x-auto pb-16 pt-8 px-2 scrollbar-none snap-x snap-mandatory ${
                isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
              }`}
            >
              {filteredProducts.map((product, idx) => (
                <BarTopasCard
                  key={product.id}
                  product={product}
                  index={idx}
                  onQuickView={() => {
                    openProductModal(product);
                    playPopSound();
                  }}
                  onAddToCart={(isSub) => {
                    addToCart(product, { isSubscription: isSub });
                    playChimeSound();
                  }}
                />
              ))}
            </div>

            {/* Interactive Drag Hint Bar */}
            <div className="mt-2 flex items-center justify-between font-mono text-xs text-earth-600 border-t border-earth-900/10 pt-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C8741B] animate-pulse" />
                <span className="uppercase tracking-wider font-bold">DRAG OR SWIPE RUNWAY TO DISCOVER ALL BLENDS</span>
              </span>
              <span className="font-bold text-earth-950">
                {filteredProducts.length} LIVING FORMULAS
              </span>
            </div>
          </div>
        )}

        {/* VIEW 2: STANDARD ARCHIVAL GRID */}
        {viewMode === 'grid' && (
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <BarTopasCard
                key={product.id}
                product={product}
                index={idx}
                isGridMode={true}
                onQuickView={() => {
                  openProductModal(product);
                  playPopSound();
                }}
                onAddToCart={(isSub) => {
                  addToCart(product, { isSubscription: isSub });
                  playChimeSound();
                }}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 bg-white rounded-3xl border border-earth-900/10 mt-8 space-y-3">
            <p className="font-display text-2xl font-black text-earth-950 uppercase tracking-tight">
              No living elixirs found matching &quot;{searchQuery}&quot;
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                playPopSound();
              }}
              className="px-6 py-2.5 rounded-full bg-earth-950 text-cream-100 text-xs font-mono font-bold"
            >
              RESET CATALOG FILTERS
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ==========================================
// BAR TÒPAS SIGNATURE CARD COMPONENT
// ==========================================
interface BarTopasCardProps {
  product: Product;
  index: number;
  isGridMode?: boolean;
  onQuickView: () => void;
  onAddToCart: (isSubscription: boolean) => void;
}

const BarTopasCard: React.FC<BarTopasCardProps> = ({
  product,
  index,
  isGridMode = false,
  onQuickView,
  onAddToCart,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSubSelected, setIsSubSelected] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Dynamic 3D tilt transform
  const [tiltStyle, setTiltStyle] = useState({});

  // Bar Topas Undulating Heights & Playful Rotations
  const rhythmClasses = useMemo(() => {
    if (isGridMode) return '';
    const patterns = [
      'translate-y-2 -rotate-1',
      'translate-y-8 rotate-2',
      '-translate-y-3 -rotate-1',
      'translate-y-6 rotate-1.5',
    ];
    return patterns[index % patterns.length];
  }, [index, isGridMode]);

  // Card Number formatted with leading zero
  const cardNum = String(index + 1).padStart(2, '0');

  // Interactive 3D Perspective Tilt Physics on Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 12; // Max 12deg tilt
    const rotY = ((x - centerX) / centerX) * 12;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-8px) scale3d(1.03, 1.03, 1.03)`,
      transition: 'transform 0.1s ease-out',
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
      transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)',
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  // Split product name into punchy stylized display words
  const displayName = product.name.toUpperCase();

  return (
    <div
      className={`shrink-0 snap-start transition-transform duration-500 ease-out ${
        isGridMode
          ? 'w-full'
          : 'w-[310px] sm:w-[360px] md:w-[390px] animate-wave-bob'
      } ${rhythmClasses}`}
      style={{
        animationDelay: `${(index % 4) * 0.75}s`,
      }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={tiltStyle}
        className="group relative w-full cursor-pointer"
      >
        {/* 1. Bar Topas Overlapping Number Badge (e.g. 01, 02, 03, 04) */}
        <div className="absolute -top-8 right-6 z-30 pointer-events-none select-none">
          <span className="font-display text-5xl sm:text-6xl md:text-7xl font-black text-[#8A1521] tracking-tighter drop-shadow-[0_4px_12px_rgba(138,21,33,0.3)] block group-hover:scale-115 group-hover:-translate-y-2 transition-all duration-300">
            {cardNum}
          </span>
        </div>

        {/* 2. Master Card Container with Smooth Squircle Corners (rounded-[34px]) */}
        <div className="relative h-[490px] sm:h-[540px] rounded-[34px] overflow-hidden bg-white shadow-xl hover:shadow-2xl border-2 border-earth-950/15 flex flex-col justify-between transition-all duration-500">
          
          {/* Full-Bleed Photography with Subtle Ambient Tint */}
          <div className="absolute inset-0 z-0 overflow-hidden bg-cream-200">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Deep Cinematic Contrast Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/35 to-black/10" />
            <div
              className="absolute inset-0 opacity-25 mix-blend-multiply pointer-events-none"
              style={{ backgroundColor: product.colorHex }}
            />
          </div>

          {/* Top Badges (Inside Card) */}
          <div className="relative z-10 p-5 sm:p-6 flex items-start justify-between">
            <span
              className="px-3.5 py-1.5 rounded-full text-[10px] font-mono font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md"
              style={{ backgroundColor: product.accentColor }}
            >
              {product.badge || product.category.toUpperCase()}
            </span>

            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-mono font-bold flex items-center gap-1.5 shadow-md">
              <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
              <span>{product.rating}</span>
              <span className="text-white/60">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Bottom Content Area: Bar Topas Chunky Vintage Typography */}
          <div className="relative z-10 p-5 sm:p-7 space-y-3">
            
            {/* Produce Origin Subtitle */}
            <div className="text-[11px] font-mono font-bold text-brand-gold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
              <span>{product.ingredientHighlights[0]?.origin || 'Single Origin, India'}</span>
            </div>

            {/* Colossal Punchy White Name (Matching LA CHALUTIÈRE in Bar Topas) */}
            <h3
              onClick={onQuickView}
              className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase leading-[0.88] drop-shadow-[0_6px_20px_rgba(0,0,0,0.95)] cursor-pointer hover:text-brand-gold transition-colors"
            >
              {displayName}
            </h3>

            <p className="text-xs text-cream-200 line-clamp-2 leading-relaxed font-sans font-medium">
              {product.tagline}
            </p>

            {/* Price & Action Deck */}
            <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/20">
              <div>
                <span className="font-display text-2xl font-black text-white block leading-none">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-mono font-bold text-brand-gold block mt-0.5">
                  or ₹{product.subscriptionPrice.toLocaleString('en-IN')} sub
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onQuickView();
                  }}
                  className="p-2.5 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md text-white transition shadow-sm"
                  title="View Full Ingredients & Nutrition Specs"
                >
                  <Info className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddToCart(false);
                  }}
                  className="px-4 py-2.5 rounded-full bg-[#8A1521] hover:bg-[#680D1A] text-white font-mono font-black text-xs uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 shadow-lg hover:scale-105 active:scale-95"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>ADD • ₹{product.price}</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
