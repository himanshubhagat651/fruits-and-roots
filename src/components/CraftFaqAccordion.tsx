import React, { useState } from 'react';
import { playPopSound } from '../utils/audio';
import { ChevronDown, HelpCircle, ShieldCheck, Sparkles, RefreshCw, Truck } from 'lucide-react';

interface FaqItem {
  id: string;
  category: 'craft' | 'delivery' | 'cleanses';
  question: string;
  answer: string;
  badge: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'why-cold-press',
    category: 'craft',
    badge: 'HYDRAULIC EXTRACTION',
    question: 'Why 15,000 PSI hydraulic cold pressing instead of centrifugal blenders?',
    answer: 'Standard juice bars and home juicers use high-speed spinning blades (up to 14,000 RPM) that whip friction heat into the produce, cooking sensitive enzymes and oxidizing delicate Vitamin C. Fruits & Roots uses static hydraulic pressure—15,000 pounds per square inch of pure crushing force—squeezing whole botanical cells at 2.2°C without generating a single fraction of a degree of heat.',
  },
  {
    id: 'how-hpp-works',
    category: 'craft',
    badge: 'BIOAVAILABILITY',
    question: 'What is Non-Thermal HPP and how do living enzymes and probiotics survive?',
    answer: 'High-Pressure Processing (HPP) submerges cold-sealed glass bottles in pure hyperbaric water pressure (87,000 PSI). This pressure physically disrupts harmful pathogen cell walls without applying thermal heat shock. As a result, 100% of the active digestive enzymes, live flora, chlorophyll, and vitamins remain intact and bioavailable, compliant with FSSAI regulations.',
  },
  {
    id: 'glass-bottle-deposit',
    category: 'delivery',
    badge: 'ZERO-PLASTIC CIRCULARITY',
    question: 'How does the ₹25 glass bottle return and rider pickup program work?',
    answer: 'We never bottle in single-use plastic that leaches petrochemicals or microplastics. Every bottle carries a refundable ₹25 deposit credit. Simply rinse your empty glass bottles and place them back inside your insulated doorstep crate. When your refrigerated rider delivers your next batch, they collect the bottles and your ₹25/bottle credit is automatically deposited to your account balance via instant UPI.',
  },
  {
    id: 'shelf-life-storage',
    category: 'delivery',
    badge: 'COLD-CHAIN AT 2.2°C',
    question: 'How long does unpasteurised juice stay fresh in my refrigerator?',
    answer: 'Because of our clean non-thermal HPP protocol, unopened bottles remain fresh and enzymatically active for up to 45 days when kept continuously chilled under 3.3°C. Once unsealed and exposed to ambient air, we recommend drinking within 72 hours for peak flavour and crisp vitality.',
  },
  {
    id: 'cleanse-schedule-beginners',
    category: 'cleanses',
    badge: 'METABOLIC RESET',
    question: 'I am new to juice cleansing. How does the 3-Day or 5-Day Protocol work?',
    answer: 'Our protocols are designed by holistic functional nutritionists to give your digestive system complete rest while flooding your bloodstream with 1.8+ kilograms of bioavailable produce per day. You receive an hour-by-hour drinking schedule in IST (starting with the Fire Ginger shot at 7:30 AM through Golden Roots, Emerald Canopy, and ending with calming Raw Cacao & Reishi at 7:30 PM). Complete pre-cleanse and post-cleanse guides are included.',
  },
  {
    id: 'subscription-flexibility',
    category: 'delivery',
    badge: 'CLUB FLEXIBILITY',
    question: 'Can I swap flavours, pause for travel, or cancel my subscription anytime?',
    answer: 'Yes, with zero hassle and zero penalty. Our Club Membership gives you a permanent 15% discount across all bottles and cleanses. You can swap upcoming flavours with a single tap, modify your delivery cadence (weekly, bi-weekly, or monthly), pause for vacations, or cancel anytime directly in your customer dashboard.',
  },
];

export const CraftFaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);
  const [activeCategory, setActiveCategory] = useState<'all' | 'craft' | 'delivery' | 'cleanses'>('all');

  const filteredItems = FAQ_ITEMS.filter((item) =>
    activeCategory === 'all' ? true : item.category === activeCategory
  );

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
    playPopSound();
  };

  return (
    <section id="craft-faq" className="py-20 sm:py-32 bg-brand-cream border-t border-brand-950/10 select-none">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 text-brand-cream text-xs font-mono font-bold tracking-widest uppercase">
            <HelpCircle className="w-3.5 h-3.5 text-brand-amber" />
            <span>CRAFT SECRETS &amp; FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-brand-950 uppercase tracking-tight leading-[0.9]">
            Curious about living botany?
          </h2>
          <p className="text-sm sm:text-base text-brand-700 font-normal">
            Everything you need to know about hydraulic cold extraction, non-thermal preservation, and our closed-loop glass bottle circularity across Mumbai, Bengaluru &amp; Delhi.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 font-mono">
            {[
              { id: 'all', label: 'ALL QUESTIONS' },
              { id: 'craft', label: '15,000 PSI CRAFT' },
              { id: 'delivery', label: 'COURIER & GLASS RETURN' },
              { id: 'cleanses', label: 'CLEANSE PROTOCOLS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCategory(tab.id as any);
                  playPopSound();
                }}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  activeCategory === tab.id
                    ? 'bg-brand-950 text-brand-cream border-brand-950 shadow-md scale-102'
                    : 'bg-white text-brand-700 border-brand-950/15 hover:border-brand-950/30'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion Stack */}
        <div className="mt-12 space-y-4">
          {filteredItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-brand-950/10 overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full p-6 sm:p-7 text-left flex items-start justify-between gap-4 transition"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-brand-amber block">
                      {item.badge}
                    </span>
                    <h3 className="font-sans font-bold text-base sm:text-lg text-brand-950 tracking-tight leading-snug">
                      {item.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full bg-brand-parchment flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-amber text-white' : 'text-brand-950'}`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-7 sm:px-7 text-sm text-brand-700 leading-relaxed font-sans border-t border-brand-950/5 pt-4 animate-in fade-in duration-200">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
