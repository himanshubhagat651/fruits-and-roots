import React, { useRef, useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { Product } from '../types';
import { playPopSound, playChimeSound } from '../utils/audio';
import { ArrowRight, ArrowLeft, Droplet, Star, Sparkles, Plus, Info } from 'lucide-react';

interface PartakeCardData {
  product: Product;
  bgColor: string; // Pastel background
  textColor: string; // High-contrast chunky title color
  borderColor: string; // Bold pop border
  shadowColor: string; // 3D offset shadow color
  lifestyleImage: string; // Action pour shot (Partake reference)
  accentPillBg: string;
}

export const HorizontalFlavorSlider: React.FC = () => {
  const { addToCart, openProductModal } = useCart();
  const sliderRef = useRef<HTMLDivElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>('golden-roots-glow'); // Default active on first card like Partake
  const [scrollProgress, setScrollProgress] = useState(0);

  // Drag-to-scroll state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Track carousel scroll position for interactive background text movement
  const handleSliderScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      const maxScroll = scrollWidth - clientWidth;
      const progress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    handleSliderScroll();
    const node = sliderRef.current;
    if (!node) return;
    node.addEventListener('scroll', handleSliderScroll, { passive: true });
    return () => node.removeEventListener('scroll', handleSliderScroll);
  }, []);

  // Curated 6 Master Cold-Press Flavors with Partake Foods Pastel Color Identity
  const partakeCards: PartakeCardData[] = [
    {
      product: PRODUCTS[0], // Golden Roots Glow
      bgColor: '#FDF1A9', // Buttercup Yellow (matching Soft Baked Lemon in Partake)
      textColor: '#703E00',
      borderColor: '#8C4E00',
      shadowColor: '#8C4E00',
      accentPillBg: '#E68000',
      lifestyleImage: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=800&q=80', // Action juice pour
    },
    {
      product: PRODUCTS[1], // Emerald Canopy
      bgColor: '#C7EED8', // Fresh Mint Green
      textColor: '#0B4221',
      borderColor: '#0B4221',
      shadowColor: '#0B4221',
      accentPillBg: '#1B6B3A',
      lifestyleImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80', // Green bowl / pour
    },
    {
      product: PRODUCTS[2], // Ruby Beet Vitality
      bgColor: '#FBC3D8', // Soft Strawberry Pink (matching Classic Grahams in Partake)
      textColor: '#73112A',
      borderColor: '#73112A',
      shadowColor: '#73112A',
      accentPillBg: '#9B1D3D',
      lifestyleImage: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80', // Ruby pour
    },
    {
      product: PRODUCTS[3], // Dragon Fruit Sunrise
      bgColor: '#90D8ED', // Sky Cyan Blue (matching Teeny Tiny in Partake)
      textColor: '#003A68',
      borderColor: '#003A68',
      shadowColor: '#003A68',
      accentPillBg: '#0065A8',
      lifestyleImage: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80', // Pitaya dragonfruit bowl
    },
    {
      product: PRODUCTS[4], // Blue Majik Ocean Tonic
      bgColor: '#DDBDFC', // Pastel Lavender
      textColor: '#3E0F6B',
      borderColor: '#3E0F6B',
      shadowColor: '#3E0F6B',
      accentPillBg: '#611B9E',
      lifestyleImage: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80', // Blue spirulina pour
    },
    {
      product: PRODUCTS[5] || PRODUCTS[0], // Avocado Velvet
      bgColor: '#E2EDB8', // Pastel Pistachio Avocado
      textColor: '#29440F',
      borderColor: '#29440F',
      shadowColor: '#29440F',
      accentPillBg: '#446E1B',
      lifestyleImage: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=800&q=80', // Smoothie glass pour
    },
  ];

  // Carousel Navigation
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -380, behavior: 'smooth' });
      playPopSound();
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 380, behavior: 'smooth' });
      playPopSound();
    }
  };

  // Drag to scroll
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeftState(sliderRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftState - walk;
    handleSliderScroll();
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section
      id="runway"
      className="py-20 sm:py-32 bg-[#FFFDF7] border-t border-earth-900/10 overflow-hidden select-none relative"
    >
      {/* Background Archival Typography & Atmospheric Stage (Clearly Visible & Kinetically Movable) */}
      <div className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden">
        {/* Ambient Warm Botanical Halos */}
        <div
          className="absolute -top-24 -left-24 w-[540px] h-[540px] rounded-full bg-gradient-to-br from-[#F9B213]/40 via-[#FFA826]/30 to-transparent blur-[110px] pointer-events-none"
        />
        <div
          className="absolute -bottom-28 -right-28 w-[580px] h-[580px] rounded-full bg-gradient-to-tl from-[#DE492A]/35 via-[#C8741B]/25 to-transparent blur-[120px] pointer-events-none"
        />

        {/* Upper Secondary Ribbon */}
        <div className="absolute top-8 left-0 w-full overflow-hidden opacity-[0.22] sm:opacity-[0.28]">
          <div
            className="flex whitespace-nowrap transition-transform duration-100 ease-out will-change-transform"
            style={{ transform: `translate3d(${scrollProgress * 280}px, 0, 0)` }}
          >
            <div className="flex animate-ticker-right">
              <span className="font-display text-[7vw] font-black uppercase text-[#DE492A] tracking-tight block leading-none mr-12 drop-shadow-sm">
                100% RAW LIVING JUICES &bull; ZERO PRESERVATIVES &bull; SINGLE ORIGIN HARVESTS &bull;
              </span>
            </div>
            <div className="flex animate-ticker-right" aria-hidden="true">
              <span className="font-display text-[7vw] font-black uppercase text-[#DE492A] tracking-tight block leading-none mr-12 drop-shadow-sm">
                100% RAW LIVING JUICES &bull; ZERO PRESERVATIVES &bull; SINGLE ORIGIN HARVESTS &bull;
              </span>
            </div>
          </div>
        </div>

        {/* Center Primary Watermark Track: Highly Visible Roasted Turmeric Typography */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full overflow-hidden">
          <div
            className="flex whitespace-nowrap transition-transform duration-100 ease-out will-change-transform opacity-[0.28] sm:opacity-[0.35]"
            style={{
              transform: `translate3d(${-scrollProgress * 550}px, 0, 0)`,
            }}
          >
            <div className="flex animate-ticker-left">
              <span className="font-display text-[18vw] sm:text-[22vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-16 drop-shadow-[0_4px_24px_rgba(200,116,27,0.32)]">
                FRUITS &amp; ROOTS &bull; RAW COLD-PRESSED BOTANICALS &bull; PURE HARVEST &bull; MUMBAI &bull;
              </span>
            </div>
            <div className="flex animate-ticker-left" aria-hidden="true">
              <span className="font-display text-[18vw] sm:text-[22vw] font-black uppercase text-[#C8741B] tracking-tight block leading-none mr-16 drop-shadow-[0_4px_24px_rgba(200,116,27,0.32)]">
                FRUITS &amp; ROOTS &bull; RAW COLD-PRESSED BOTANICALS &bull; PURE HARVEST &bull; MUMBAI &bull;
              </span>
            </div>
          </div>
        </div>

        {/* Floating Bar Topas Ghost Letterforms in background with counter-drift */}
        <div
          className="absolute inset-0 flex items-center justify-between px-10 text-[#C8741B]/[0.22] font-display text-[28vw] font-black leading-none pointer-events-none select-none transition-transform duration-200 ease-out"
          style={{
            transform: `translate3d(${scrollProgress * 220}px, 0, 0)`,
          }}
        >
          <span>R</span>
          <span>A</span>
          <span>W</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Partake Foods Signature Headline Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-12 border-b border-earth-900/10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00609C] text-white text-xs font-mono font-black tracking-widest uppercase shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FDF1A9]" />
              <span>ACT IV &bull; ALL THE LIVING TASTE</span>
            </div>

            {/* Giant Bold Headline (Direct Partake Foods "None of the FOMO" Reference) */}
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#00609C] uppercase tracking-tight leading-[0.88] drop-shadow-xs">
              None of the<br />
              <span className="text-[#E24A2B]">Pasteurisation.</span>
            </h2>

            <p className="font-mono text-xs sm:text-sm text-earth-700 max-w-xl pt-2 font-medium leading-relaxed">
              Never heated or boiled. Zero added sugar. 100% pure cold-pressed juice with all its fresh vitamins and rich natural taste, pressed daily from Indian farm harvests.
            </p>
          </div>

          {/* Partake Foods Signature Circular Solid Blue Navigation Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollLeft}
              className="w-14 h-14 rounded-full bg-[#00609C] hover:bg-[#004B87] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group"
              aria-label="Scroll carousel left"
            >
              <ArrowLeft className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={scrollRight}
              className="w-14 h-14 rounded-full bg-[#00609C] hover:bg-[#004B87] text-white flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group"
              aria-label="Scroll carousel right"
            >
              <ArrowRight className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* The Partake Foods Horizontal Card Carousel */}
        <div className="mt-12 relative">
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`flex gap-6 sm:gap-8 overflow-x-auto pb-14 pt-6 px-2 scrollbar-none snap-x snap-mandatory ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {partakeCards.map((card, idx) => {
              const { product, bgColor, textColor, borderColor, shadowColor, lifestyleImage, accentPillBg } = card;
              const isHovered = hoveredId === product.id;

              return (
                <div
                  key={product.id}
                  onMouseEnter={() => setHoveredId(product.id)}
                  onClick={() => openProductModal(product)}
                  className="w-[300px] sm:w-[340px] md:w-[370px] shrink-0 snap-start transition-all duration-300 ease-out cursor-pointer"
                  style={{
                    transform: isHovered
                      ? `rotate(${idx % 2 === 0 ? '-3.5deg' : '3deg'}) translateY(-12px) scale(1.02)`
                      : 'rotate(0deg) translateY(0px) scale(1)',
                  }}
                >
                  {/* Master Partake Squircle Card Container */}
                  <div
                    className="relative h-[530px] sm:h-[570px] rounded-[38px] p-6 sm:p-7 flex flex-col justify-between overflow-hidden transition-all duration-300"
                    style={{
                      backgroundColor: bgColor,
                      border: isHovered ? `3.5px solid ${borderColor}` : '3.5px solid transparent',
                      boxShadow: isHovered
                        ? `8px 14px 0px ${shadowColor}, 0 20px 30px rgba(0,0,0,0.12)`
                        : '0 8px 24px rgba(0,0,0,0.06)',
                    }}
                  >
                    {/* Top Badges: Bottle Volume & Circular Rating */}
                    <div className="flex items-center justify-between z-10">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-wider text-white shadow-xs"
                        style={{ backgroundColor: accentPillBg }}
                      >
                        0{idx + 1} &bull; {product.benefits[0] || 'LIVING'}
                      </span>

                      <div className="bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono font-black flex items-center gap-1 shadow-2xs text-earth-950">
                        <Star className="w-3 h-3 text-[#E24A2B] fill-[#E24A2B]" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    {/* Center Image Showcase: Default Bottle vs Hover Lifestyle Pour Shot (Partake signature) */}
                    <div className="relative my-auto w-full aspect-[4/5] rounded-[28px] overflow-hidden flex items-center justify-center transition-transform duration-500">
                      
                      {/* Image 1: Default Pure Bottle Product Shot */}
                      <img
                        src={product.image}
                        alt={product.name}
                        className={`absolute inset-0 w-full h-full object-cover rounded-[28px] transition-all duration-500 ease-out ${
                          isHovered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                        }`}
                      />

                      {/* Image 2: Lifestyle Action Pour Shot (like Partake pouring milk over cookies) */}
                      <img
                        src={lifestyleImage}
                        alt={`${product.name} Pour`}
                        className={`absolute inset-0 w-full h-full object-cover rounded-[28px] transition-all duration-500 ease-out ${
                          isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-110'
                        }`}
                      />

                      {/* Floating Lifestyle Badge on Hover */}
                      {isHovered && (
                        <div className="absolute bottom-3 inset-x-3 bg-black/60 backdrop-blur-md text-white text-[10px] font-mono font-bold uppercase tracking-wider py-1.5 px-3 rounded-full text-center animate-in fade-in duration-200">
                          RAW COLD-POUR AT 2.2&deg;C
                        </div>
                      )}
                    </div>

                    {/* Bottom Area: Partake Chunky Rounded Display Typography */}
                    <div className="z-10 text-center space-y-2 pt-2">
                      
                      {/* Subtitle Accent Line */}
                      <span
                        className="font-mono text-[10px] font-bold uppercase tracking-widest block opacity-75"
                        style={{ color: textColor }}
                      >
                        {product.volume} &bull; 1.8 KG HARVEST
                      </span>

                      {/* Colossal Chunky Rounded Title (Matching Partake Foods) */}
                      <h3
                        className="font-display text-2xl sm:text-3xl md:text-[2rem] font-black tracking-tight leading-[0.94] drop-shadow-2xs line-clamp-2"
                        style={{ color: textColor }}
                      >
                        {product.name}
                      </h3>

                      {/* Action Pill on Hover or Price Deck */}
                      <div className="pt-2 flex items-center justify-center gap-2">
                        {isHovered ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              addToCart(product);
                              playChimeSound();
                            }}
                            className="w-full py-3 px-5 rounded-full text-white font-mono font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 hover:scale-103 active:scale-97 transition-transform animate-in zoom-in-95 duration-200"
                            style={{ backgroundColor: borderColor }}
                          >
                            <Plus className="w-4 h-4 text-white" />
                            <span>QUICK ADD &bull; ₹{product.price}</span>
                          </button>
                        ) : (
                          <div
                            className="font-mono text-xs font-black tracking-wider uppercase opacity-80"
                            style={{ color: textColor }}
                          >
                            ₹{product.price} &bull; ₹{product.subscriptionPrice} SUB
                          </div>
                        )}
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Interactive Hint */}
          <div className="mt-4 flex items-center justify-between font-mono text-xs text-earth-600 border-t border-earth-900/10 pt-4">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00609C] animate-pulse" />
              <span className="uppercase tracking-wider font-bold">HOVER ANY CARD TO REVEAL 3D TILT &amp; COLD POUR</span>
            </span>
            <span className="font-bold text-[#00609C]">
              6 MASTER BOTANICALS
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
