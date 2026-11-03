import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { CLEANSE_PROGRAMS } from '../data/products';
import { CleanseProgram, Product } from '../types';
import { playPopSound, playChimeSound } from '../utils/audio';
import { ShieldCheck, CheckCircle2, Sparkles, Clock, ArrowRight, Zap, RefreshCw } from 'lucide-react';

interface ProtocolTicket {
  id: string;
  program: CleanseProgram;
  scriptTitle: string; // Golden script calligraphy
  timelineBadge: string; // Hot pink badge
  features: string[];
  basePrice: number;
}

export const SubscriptionSection: React.FC = () => {
  const { addToCart, showToast } = useCart();
  const [selectedDuration, setSelectedDuration] = useState<3 | 5 | 7>(3);
  const [activeCardId, setActiveCardId] = useState<string>('cleanse-balanced');
  const [showScheduleModal, setShowScheduleModal] = useState<CleanseProgram | null>(null);

  // 3 Curated Cleanse Plans with punchy, high-impact benefits
  const protocols: ProtocolTicket[] = [
    {
      id: 'cleanse-beginner',
      program: CLEANSE_PROGRAMS[0],
      scriptTitle: 'Beginner Gentle',
      timelineBadge: `${selectedDuration}-Day Gentle Reset`,
      basePrice: 899,
      features: [
        '6 Cold-pressed juices + 2 wellness shots daily',
        'Easy, soothing reset that keeps hunger away',
        'Delivered chilled to your door every morning',
      ],
    },
    {
      id: 'cleanse-balanced',
      program: CLEANSE_PROGRAMS[1] || CLEANSE_PROGRAMS[0],
      scriptTitle: 'Balanced Reset',
      timelineBadge: `${selectedDuration}-Day Energy Reboot`,
      basePrice: 999,
      features: [
        '6 Nutrient-rich juices + daily ginger shot',
        'Steady stamina, mental clarity & natural glow',
        'Delivered chilled to your door every morning',
      ],
    },
    {
      id: 'cleanse-green',
      program: CLEANSE_PROGRAMS[1] || CLEANSE_PROGRAMS[0],
      scriptTitle: 'Deep Green Pro',
      timelineBadge: `${selectedDuration}-Day Pure Greens`,
      basePrice: 1199,
      features: [
        '6 Pure low-sugar green juices & charcoal elixir',
        'Deep digestive refresh & debloating recharge',
        'Delivered chilled to your door every morning',
      ],
    },
  ];

  const handleOrderProtocol = (protocol: ProtocolTicket) => {
    playChimeSound();
    const totalPrice = protocol.basePrice * selectedDuration;
    const cleanseProduct: Product = {
      id: `${protocol.program.id}-${selectedDuration}day`,
      name: `${protocol.program.name} (${selectedDuration}-Day Juice Plan)`,
      subname: `${protocol.scriptTitle} Plan`,
      tagline: `${selectedDuration * protocol.program.bottlesPerDay} bottles total • Delivered in refrigerated cold-chain coolers`,
      description: protocol.program.description,
      category: 'detox',
      price: totalPrice,
      subscriptionPrice: Math.round(totalPrice * 0.85),
      volume: `${selectedDuration * protocol.program.bottlesPerDay}x 473 ml Bottles + Shots`,
      calories: 120,
      benefits: ['Gentle Reset', 'Digestive Health', 'All-Day Energy'],
      ingredients: ['Organic Leafy Greens', 'Cold-Pressed Roots', 'Living Vitamins'],
      ingredientHighlights: [],
      nutritionFacts: {
        servingSize: '1 Bottle',
        servingsPerContainer: selectedDuration * protocol.program.bottlesPerDay,
        calories: 110,
        totalFat: '0g',
        sodium: '40mg',
        totalCarb: '22g',
        dietaryFiber: '2g',
        totalSugars: '16g',
        addedSugars: '0g',
        protein: '3g',
        vitaminC: '200%',
        vitaminA: '80%',
        iron: '12%',
        potassium: '18%',
      },
      tasteProfile: { sweetness: 3, tartness: 3, earthiness: 4, crispness: 5 },
      colorHex: protocol.program.color,
      accentColor: protocol.program.color,
      badge: `${protocol.program.level}`,
      image: protocol.program.id.includes('green')
        ? 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
        : 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 320,
    };

    addToCart(cleanseProduct, {
      isSubscription: true,
      quantity: 1,
    });
    showToast(`Added ${protocol.scriptTitle} (${selectedDuration}-Day Juice Plan) to your bag!`);
  };

  return (
    <section
      id="plans"
      className="py-16 sm:py-24 bg-[#FAF6EE] text-brand-950 relative overflow-hidden select-none border-t border-brand-950/10"
    >
      <span id="cleanses" className="sr-only" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Warm Linen Parchment Inner Frame with Subtle Botanical Glow */}
        <div className="relative rounded-[38px] sm:rounded-[48px] bg-gradient-to-b from-[#F2EADF] via-[#EAE0D1] to-[#DFD3C0] border-2 sm:border-4 border-brand-950/10 shadow-[0_20px_60px_rgba(12,10,9,0.08)] p-6 sm:p-12 overflow-hidden">
          
          {/* Ambient Warm Botanical Halos */}
          <div className="absolute -top-12 -left-12 w-72 h-72 bg-[#C8741B]/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-[#8A1521]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 left-1/3 w-96 h-96 bg-[#C8741B]/20 rounded-full blur-3xl pointer-events-none" />

          {/* 1. Luxury Editorial Header */}
          <div className="text-center relative z-10 mb-8 sm:mb-12 space-y-4">
            
            <div className="space-y-3">
              <h2 className="font-serif text-3xl sm:text-5xl md:text-6xl font-black text-brand-950 tracking-tight leading-[0.95] uppercase">
                CHOOSE YOUR DAILY JUICE PLAN
              </h2>
            </div>

            <p className="font-mono text-xs sm:text-sm text-brand-800 font-bold uppercase tracking-widest max-w-xl mx-auto pt-1">
              Curated multi-day juice plans to reboot your energy and digestion.
            </p>

            {/* Duration Selector Tabs (3-Day, 5-Day, 7-Day) */}
            <div className="inline-flex rounded-full bg-white p-1.5 border border-brand-950/15 shadow-sm font-mono text-xs font-bold">
              {[3, 5, 7].map((days) => (
                <button
                  key={days}
                  onClick={() => {
                    setSelectedDuration(days as 3 | 5 | 7);
                    playPopSound();
                  }}
                  className={`px-5 py-2 rounded-full transition-all duration-300 ${
                    selectedDuration === days
                      ? 'bg-[#A31D1D] text-white shadow-md scale-105'
                      : 'text-brand-800 hover:text-[#A31D1D]'
                  }`}
                >
                  {days}-DAY JUICE PLAN
                </button>
              ))}
            </div>
          </div>

          {/* 2. The 3 Skeuomorphic "Dispenser Slot & Emerging Receipt Ticket" Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 items-start relative z-10">
            {protocols.map((protocol, idx) => {
              const isActive = activeCardId === protocol.id;
              const totalPrice = protocol.basePrice * selectedDuration;

              return (
                <div
                  key={protocol.id}
                  onMouseEnter={() => {
                    setActiveCardId(protocol.id);
                  }}
                  className="flex flex-col items-center group cursor-pointer"
                >
                  {/* SKEUOMORPHIC 3D DISPENSER OPENING (SLOT BEZEL) */}
                  <div className="w-full max-w-[340px] sm:max-w-[360px] h-8 sm:h-9 bg-[#D9CEBE] rounded-2xl border-2 border-[#C4B7A2] shadow-[inset_0_2px_4px_rgba(0,0,0,0.18),0_4px_8px_rgba(0,0,0,0.06)] flex items-center justify-center p-1 relative z-20">
                    {/* The Dark Printer Slit */}
                    <div className="h-2 sm:h-2.5 bg-brand-950 rounded-full w-[92%] shadow-[inset_0_2px_3px_rgba(0,0,0,0.8)]" />
                  </div>

                  {/* SKEUOMORPHIC WHITE RECEIPT TICKET (SLIDING OUT OF THE DISPENSER) */}
                  <div
                    className={`w-full max-w-[318px] sm:max-w-[338px] bg-white rounded-b-[28px] p-6 sm:p-7 shadow-2xl border-x-2 border-b-2 border-brand-950/10 -mt-2.5 relative z-10 transition-all duration-500 ease-out flex flex-col justify-between min-h-[460px] ${
                      isActive
                        ? 'translate-y-2 shadow-[0_25px_50px_rgba(12,10,9,0.18)]'
                        : 'translate-y-0 opacity-95 group-hover:translate-y-1.5'
                    }`}
                  >
                    {/* Top Paper Shadow Gradient simulating curve emerging from slit */}
                    <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />

                    <div>
                      {/* Ticket Title */}
                      <div className="text-center pt-2 pb-2">
                        <h3
                          className="font-display text-2xl sm:text-3xl text-brand-950 font-black uppercase tracking-tight leading-tight hover:scale-105 transition-transform"
                        >
                          {protocol.scriptTitle}
                        </h3>
                      </div>

                      {/* Timeline / Cadence Pill Badge */}
                      <div className="text-center my-3">
                        <span className="inline-block bg-[#A31D1D] text-white text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-xs">
                          {protocol.timelineBadge}
                        </span>
                      </div>

                      {/* Features List with Golden Square Checkboxes */}
                      <ul className="space-y-3 pt-4 text-xs font-mono text-brand-800">
                        {protocol.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5 leading-snug">
                            {/* Golden Square Bullet */}
                            <span className="w-2.5 h-2.5 rounded-[2px] bg-brand-amber border border-brand-gold shrink-0 mt-0.5 shadow-2xs" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Area: Dashed Tear-Off Line + Action Button */}
                    <div className="pt-6">
                      
                      {/* Dashed Tear Line */}
                      <div className="border-t-2 border-dashed border-brand-950/15 w-full mb-5" />

                      {/* Pricing Tag */}
                      <div className="text-center pb-3">
                        <span className="font-display text-3xl font-black text-brand-950 block leading-none">
                          ₹{totalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] font-mono font-bold text-brand-600 uppercase tracking-wider block mt-1">
                          ₹{protocol.basePrice}/day &bull; ₹{Math.round(totalPrice * 0.85).toLocaleString('en-IN')} sub price
                        </span>
                      </div>

                      {/* Solid Action Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderProtocol(protocol);
                        }}
                        className="w-full py-3.5 px-6 rounded-xl bg-[#A31D1D] hover:bg-[#851616] text-white font-mono font-bold text-xs uppercase tracking-wider shadow-md hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 border border-black/10"
                      >
                        <span>GET STARTED</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>

                      {/* Hourly Schedule Trigger */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowScheduleModal(protocol.program);
                          playPopSound();
                        }}
                        className="w-full text-center text-[10px] font-mono font-bold uppercase tracking-wider text-brand-600 hover:text-brand-950 transition-colors pt-3"
                      >
                        VIEW DAILY DRINK TIMETABLE &rarr;
                      </button>

                      {/* Footnote below button */}
                      <div className="text-center pt-2 border-t border-brand-950/10 mt-2">
                        <span className="text-[9px] font-mono text-brand-500 block uppercase">
                          Cancel, pause or swap flavors anytime with 1-tap
                        </span>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Footnote Banner */}
          <div className="mt-12 pt-6 border-t border-brand-950/15 text-center font-mono text-xs text-brand-800 font-bold flex flex-wrap items-center justify-center gap-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#A31D1D]" />
              <span>₹150 INSTANT UPI CASHBACK PER 6 EMPTY GLASS BOTTLES</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-amber" />
              <span>FREE INSULATED THERMAL COOLER DELIVERY</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-moss" />
              <span>FSSAI COMPLIANT &bull; 0.0&deg;C FRICTION HEAT</span>
            </span>
          </div>

        </div>

      </div>

      {/* Hourly Sip Schedule Modal */}
      {showScheduleModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowScheduleModal(null)}
        >
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-brand-950/10 space-y-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-brand-950/10">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#A31D1D]" />
                <h3 className="font-display font-black text-lg text-brand-950 uppercase tracking-tight">
                  {showScheduleModal.name} Drink Timetable
                </h3>
              </div>
              <button
                onClick={() => setShowScheduleModal(null)}
                className="w-8 h-8 rounded-full bg-brand-parchment flex items-center justify-center text-xs font-bold hover:bg-brand-sand transition"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {showScheduleModal.schedule.map((slot, i) => (
                <div key={i} className="p-3 rounded-xl bg-brand-cream border border-brand-950/10 flex items-start gap-3">
                  <span className="text-xs font-mono font-black text-white shrink-0 bg-[#A31D1D] px-2 py-1 rounded shadow-2xs">
                    {slot.time}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-brand-950 block">{slot.drink}</span>
                    <span className="text-[11px] text-brand-600 block mt-0.5">{slot.benefit}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowScheduleModal(null)}
              className="w-full py-3 rounded-xl bg-brand-950 hover:bg-brand-900 text-white font-mono font-bold text-xs uppercase tracking-wider transition"
            >
              CLOSE TIMETABLE
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
