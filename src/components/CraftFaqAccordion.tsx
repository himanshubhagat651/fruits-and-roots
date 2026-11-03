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
    badge: 'COLD-PRESS METHOD',
    question: 'Why cold-pressed juice instead of regular juicers or blenders?',
    answer: 'Regular home juicers and blenders use fast spinning blades that generate heat, destroying delicate fresh vitamins and natural enzymes. We use a gentle, slow cold-press method that squeezes fresh fruits and vegetables cold—keeping all the rich nutrients, vibrant natural color, and delicious taste 100% intact.',
  },
  {
    id: 'how-hpp-works',
    category: 'craft',
    badge: 'NATURALLY FRESH',
    question: 'How does the juice stay fresh without any preservatives?',
    answer: 'Most store-bought juices are boiled (pasteurised) to sit on supermarket shelves for months, which removes their fresh taste. We keep our juices ice-cold and use clean cold-water pressure to keep them completely safe, keeping all the live vitamins, enzymes, and fresh flavor naturally alive.',
  },
  {
    id: 'glass-bottle-deposit',
    category: 'delivery',
    badge: 'ZERO PLASTIC',
    question: 'How does the ₹25 glass bottle return and cashback work?',
    answer: 'We are 100% plastic-free. All our juices come in reusable, clean glass bottles. Simply rinse your empty bottles and hand them back to our delivery rider, and you will receive ₹25 per bottle back directly to your UPI.',
  },
  {
    id: 'shelf-life-storage',
    category: 'delivery',
    badge: 'CHILLED STORAGE',
    question: 'How long does the juice stay fresh in my refrigerator?',
    answer: 'Unopened bottles stay fresh and full of natural flavor for up to 45 days when kept continuously chilled in your refrigerator. Once opened, we recommend enjoying your juice within 3 days for the crispest taste.',
  },
  {
    id: 'cleanse-schedule-beginners',
    category: 'cleanses',
    badge: 'EASY CLEANSE',
    question: 'I am new to juice cleanses. How does a cleanse plan work?',
    answer: 'Our cleanse plans are simple and refreshing. Each day you receive 6 fresh cold-pressed juices with an easy morning-to-night drinking schedule. It gives your digestive system a gentle rest while providing your body with over 1.5 kg of fresh fruits and greens each day.',
  },
  {
    id: 'subscription-flexibility',
    category: 'delivery',
    badge: 'FLEXIBLE PLANS',
    question: 'Can I swap flavours, pause for travel, or cancel anytime?',
    answer: 'Yes, easily! You can change upcoming flavours with one tap, adjust delivery days (weekly, every 2 weeks, or monthly), pause when you are traveling, or cancel anytime with zero hassle.',
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
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-brand-950 uppercase tracking-tight leading-[0.9]">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-sm sm:text-base text-brand-700 font-normal">
            Everything you need to know about our slow cold-press juicing, bottle cashback, and doorstep delivery across Mumbai.
          </p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 font-mono">
            {[
              { id: 'all', label: 'ALL QUESTIONS' },
              { id: 'craft', label: 'OUR METHOD' },
              { id: 'delivery', label: 'DELIVERY & BOTTLE RETURN' },
              { id: 'cleanses', label: 'CLEANSE PLANS' },
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
