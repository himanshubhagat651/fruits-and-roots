import React, { useState } from 'react';
import { playPopSound, playChimeSound } from '../utils/audio';
import { Star, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';
import { PRESS_MENTIONS } from '../data/products';

interface CustomerReview {
  id: string;
  name: string;
  role: string;
  location: string;
  rating: number;
  comment: string;
  cardColor: string; // Background color (Partake reference)
  shadowColor: string; // 3D offset border/shadow color
  sparkColor: string; // Playful spark burst rays color
}

const REVIEWS_DATA: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'PRIYA & ROHAN DESHMUKH',
    role: 'Daily Morning Ritual Subscribers',
    location: 'Pali Hill, Bandra West, Mumbai',
    rating: 5,
    comment:
      '"We replaced commercial packaged juices with Fruits & Roots six months ago and the difference in our energy and digestion is night and day. You can genuinely taste the soil purity — the Lakadong turmeric and Nagpur orange have this vibrant, sunlit sweetness with strictly zero added sugar. Leaving the empty bottles out for rider pick-up with instant UPI cashback makes the whole ritual effortless!"',
    cardColor: '#C8741B', // Warm Roasted Turmeric Amber
    shadowColor: '#FDE68A', // Warm Honey Gold Offset
    sparkColor: '#DDA74F',
  },
  {
    id: 'rev-2',
    name: 'DR. ANANYA & ARJUN SEN',
    role: 'Digestive Health Specialists',
    location: 'Juhu Tara Road, Mumbai',
    rating: 5,
    comment:
      '"As doctors, finding authentic fresh cold-pressed juice in India delivered cold without boiling or chemical preservatives was nearly impossible. Fruits & Roots uses gentle cold-pressing that keeps all natural fresh vitamins, minerals, and live nutrients completely intact. My morning celery juice and Emerald Canopy have become non-negotiable!"',
    cardColor: '#2E4733', // Deep Nilgiri Botanical Forest Green
    shadowColor: '#D9CEBE', // Warm Sand Offset
    sparkColor: '#DDA74F',
  },
  {
    id: 'rev-3',
    name: 'KARAN SINGHANIA',
    role: 'Marathon Coach & Triathlete',
    location: 'Indiranagar, Bengaluru',
    rating: 5,
    comment:
      '"The Ruby Beet and Golden Roots have permanently replaced artificial energy drinks in my training. The fresh beet juice gives me steady, long-lasting stamina on long runs, with zero caffeine crashes or stomach upset. It is pure, honest plant nutrition that truly works!"',
    cardColor: '#8A1521', // Bar Tòpas Signature Deep Cherry Wine
    shadowColor: '#DDA74F', // Champagne Amber Offset
    sparkColor: '#DDA74F',
  },
  {
    id: 'rev-4',
    name: 'SIMRAN & KABIR MEHTA',
    role: 'Health-Conscious Parents',
    location: 'Cuffe Parade, South Mumbai',
    rating: 5,
    comment:
      '"Our kids used to drink sugary supermarket cartons until we introduced them to the Pitaya Sunrise and Nagpur Orange press. They love the vibrant natural colors and heavy glass bottles, and we love having total peace of mind knowing every bottle contains 1.8 kg of fresh organic Indian fruits with zero preservatives and zero added sugar!"',
    cardColor: '#932839', // Deep Beet Burgundy
    shadowColor: '#F2EADF', // Warm Linen Offset
    sparkColor: '#DDA74F',
  },
  {
    id: 'rev-5',
    name: 'VIKRAMADITYA CHATTERJEE',
    role: 'Sustainable Architecture Director',
    location: 'Worli Sea Face, Mumbai',
    rating: 5,
    comment:
      '"What won me over first was their zero single-use plastic conviction. Drinking cold-pressed juice out of heavy, chilled borosilicate glass preserves the crisp botanical notes of Nilgiri kale and Wayanad ginger without any microplastic leaching. Their circular bottle return system is the gold standard for conscious wellness in Mumbai."',
    cardColor: '#1E3023', // Deep Cypress Moss
    shadowColor: '#D9CEBE', // Linen Parchment Offset
    sparkColor: '#DDA74F',
  },
  {
    id: 'rev-6',
    name: 'MEERA IYER-RAMAN',
    role: 'Yoga Acharya & Mindfulness Teacher',
    location: 'Koramangala, Bengaluru',
    rating: 5,
    comment:
      '"Starting the sunrise practice with Golden Roots Glow feels like drinking liquid sunshine. The high-curcumin Meghalaya turmeric combined with black pepper and raw cold-pressed coconut water settles systemic inflammation and grounds my morning routine. Pure Sattvic nourishment at its finest!"',
    cardColor: '#B45309', // Warm Golden Spice
    shadowColor: '#FAF6EE', // Champagne Cream Offset
    sparkColor: '#DDA74F',
  },
];

export const ReviewsSection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length);
    playPopSound();
  };

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % REVIEWS_DATA.length);
    playChimeSound();
  };

  const current = REVIEWS_DATA[activeIndex];
  const prevItem = REVIEWS_DATA[(activeIndex - 1 + REVIEWS_DATA.length) % REVIEWS_DATA.length];
  const nextItem = REVIEWS_DATA[(activeIndex + 1) % REVIEWS_DATA.length];

  return (
    <section id="reviews" className="relative select-none overflow-hidden bg-brand-950 text-white">
      
      {/* 1. Full-Bleed High-Res Macro Food/Botanical Background (Direct Partake Foods Reference) */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=2000&q=85"
          alt="Fresh Organic Botanical Harvest Macro Background"
          className="w-full h-full object-cover object-center scale-105"
        />
        {/* Warm Earthy Botanical Harvest Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#241712]/88 via-[#1A110D]/80 to-[#261510]/92 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-28 pb-16 sm:pb-24">
        
        {/* Top Press Mentions Ticker (Retaining Editorial Credibility) */}
        <div className="mb-14 pb-8 border-b border-white/15">
          <div className="flex flex-wrap items-center justify-around gap-6 text-center font-mono text-xs uppercase tracking-widest text-white/70">
            {PRESS_MENTIONS.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="font-display font-black text-white text-sm sm:text-base uppercase tracking-wider">{item.outlet}</span>
                <span className="text-brand-amber font-normal hidden md:inline">&mdash; &ldquo;{item.quote}&rdquo;</span>
              </div>
            ))}
          </div>
        </div>

        {/* Partake Foods Signature Colossal Headline */}
        <div className="text-center space-y-2 mb-10 sm:mb-14">
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl font-black text-white tracking-tight uppercase leading-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Certified Tasty
          </h2>
          <div className="flex items-center justify-center gap-2 pt-1 font-mono text-xs sm:text-sm font-bold text-white/90">
            <span className="w-2 h-2 rounded-full bg-[#C8741B] animate-pulse" />
            <span>4.9 / 5.0 RATING &bull; 50,000+ COLD-PRESSED BOTTLES DELIVERED IN MUMBAI</span>
          </div>
        </div>

        {/* 2. The Partake Foods 3-Card Interactive Carousel Stage */}
        <div className="relative flex items-center justify-center min-h-[380px] sm:min-h-[420px] max-w-5xl mx-auto">
          
          {/* LEFT PEEKING CARD */}
          <div
            onClick={prevReview}
            className="hidden md:block absolute left-0 -translate-x-12 lg:-translate-x-16 w-80 h-[320px] rounded-[36px] p-6 shadow-2xl opacity-60 hover:opacity-90 scale-90 transition-all duration-500 cursor-pointer z-10 overflow-hidden"
            style={{
              backgroundColor: prevItem.cardColor,
              boxShadow: `6px 10px 0px ${prevItem.shadowColor}`,
            }}
          >
            <div className="flex items-center justify-center gap-1 text-[#DDA74F] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#DDA74F]" />
              ))}
            </div>
            <p className="text-xs text-white/90 line-clamp-5 leading-relaxed text-center font-sans font-medium">
              {prevItem.comment}
            </p>
            <span className="block text-center font-display font-black text-xs text-white tracking-widest uppercase mt-4">
              {prevItem.name}
            </span>
          </div>

          {/* ACTIVE CENTER CARD */}
          <div className="relative z-20 w-full max-w-xl sm:max-w-2xl px-2">
            
            {/* Warm Amber Spark Burst - Top Left */}
            <div className="absolute -top-5 -left-3 sm:-left-5 pointer-events-none select-none text-[#DDA74F] z-30 animate-pulse">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <line x1="10" y1="22" x2="2" y2="22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="14" y1="14" x2="6" y2="6" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="22" y1="10" x2="22" y2="2" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Warm Amber Spark Burst - Bottom Right */}
            <div className="absolute -bottom-5 -right-3 sm:-right-5 pointer-events-none select-none text-[#DDA74F] z-30 animate-pulse">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <line x1="34" y1="22" x2="42" y2="22" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="30" y1="30" x2="38" y2="38" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                <line x1="22" y1="34" x2="22" y2="42" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </div>

            {/* Main Rounded Center Card */}
            <div
              className="relative rounded-[38px] sm:rounded-[46px] p-7 sm:p-11 text-center shadow-2xl transition-all duration-500 flex flex-col justify-between min-h-[340px] sm:min-h-[390px]"
              style={{
                backgroundColor: current.cardColor,
                boxShadow: `10px 14px 0px ${current.shadowColor}, 0 25px 50px rgba(0,0,0,0.5)`,
              }}
            >
              {/* 5 Solid Warm Golden Amber Stars */}
              <div className="flex items-center justify-center gap-1.5 text-[#DDA74F] mb-4 sm:mb-6">
                {[...Array(current.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-6 h-6 sm:w-7 sm:h-7 fill-[#DDA74F] text-[#DDA74F] drop-shadow-xs"
                  />
                ))}
              </div>

              {/* Verified Review Quote */}
              <blockquote className="font-sans font-medium text-base sm:text-lg md:text-xl text-white leading-relaxed max-w-lg mx-auto drop-shadow-xs">
                {current.comment}
              </blockquote>

              {/* Author & Location Signature */}
              <div className="mt-6 sm:mt-8 pt-4 border-t border-white/20">
                <span className="font-display font-black text-sm sm:text-base text-white tracking-widest uppercase block">
                  &mdash; {current.name}
                </span>
                <span className="font-mono text-xs text-white/80 block mt-0.5 uppercase tracking-wider font-semibold">
                  {current.role} &bull; {current.location}
                </span>
              </div>
            </div>

            {/* Circular Solid Burgundy Navigation Arrows on Left and Right (Warmth Palette) */}
            <button
              onClick={prevReview}
              className="absolute left-[-16px] sm:left-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8A1521] hover:bg-[#680D1A] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-30 border-2 border-white/30"
              aria-label="Previous review"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            <button
              onClick={nextReview}
              className="absolute right-[-16px] sm:right-[-24px] top-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8A1521] hover:bg-[#680D1A] text-white flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all z-30 border-2 border-white/30"
              aria-label="Next review"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

          </div>

          {/* RIGHT PEEKING CARD */}
          <div
            onClick={nextReview}
            className="hidden md:block absolute right-0 translate-x-12 lg:translate-x-16 w-80 h-[320px] rounded-[36px] p-6 shadow-2xl opacity-60 hover:opacity-90 scale-90 transition-all duration-500 cursor-pointer z-10 overflow-hidden"
            style={{
              backgroundColor: nextItem.cardColor,
              boxShadow: `6px 10px 0px ${nextItem.shadowColor}`,
            }}
          >
            <div className="flex items-center justify-center gap-1 text-[#DDA74F] mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#DDA74F]" />
              ))}
            </div>
            <p className="text-xs text-white/90 line-clamp-5 leading-relaxed text-center font-sans font-medium">
              {nextItem.comment}
            </p>
            <span className="block text-center font-display font-black text-xs text-white tracking-widest uppercase mt-4">
              {nextItem.name}
            </span>
          </div>

        </div>

        {/* 3. Bottom Colorful Card Tabs Indicator */}
        <div className="mt-12 flex items-center justify-center gap-2.5">
          {REVIEWS_DATA.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveIndex(idx);
                playPopSound();
              }}
              className={`h-3 rounded-full transition-all duration-300 ${
                activeIndex === idx
                  ? 'w-10 shadow-md scale-105'
                  : 'w-3 opacity-50 hover:opacity-80'
              }`}
              style={{ backgroundColor: item.cardColor }}
              aria-label={`Jump to review ${idx + 1}`}
            />
          ))}
        </div>

        {/* Bottom Verification Badge */}
        <div className="mt-8 text-center font-mono text-xs text-white/70 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#DDA74F]" />
          <span>FSSAI VERIFIED &bull; 100% UNPASTEURISED LIVING HARVEST &bull; MUMBAI BANDRA WEST</span>
        </div>

      </div>
    </section>
  );
};
