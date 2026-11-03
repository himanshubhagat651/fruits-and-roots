import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { playPopSound } from '../utils/audio';
import { Leaf, Sparkles, MapPin, CheckCircle2, Droplet, ArrowRight } from 'lucide-react';

interface IngredientInfo {
  id: string;
  name: string;
  botanicalFamily: string;
  category: 'Roots' | 'Leafy Greens' | 'Superfoods' | 'Adaptogens' | 'Citrus';
  farmOrigin: string;
  keyPhytonutrient: string;
  healthBenefit: string;
  colorHex: string;
  matchingDrinks: string[];
  image: string;
}

const INGREDIENTS: IngredientInfo[] = [
  {
    id: 'turmeric',
    name: 'Lakadong Turmeric Root',
    botanicalFamily: 'Jaintia Hills Golden Turmeric',
    category: 'Roots',
    farmOrigin: 'Jaintia Hills, Meghalaya',
    keyPhytonutrient: 'Rich in natural Curcumin (3x higher than regular turmeric)',
    healthBenefit: 'Naturally calms body aches, eases stiff joints, and helps you feel refreshed and focused.',
    colorHex: '#FFA826',
    matchingDrinks: ['Golden Roots Glow', 'Fire & Root Immunity Shot'],
    image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'kale',
    name: 'Nilgiri Mountain Kale',
    botanicalFamily: 'High-Altitude Fresh Mountain Greens',
    category: 'Leafy Greens',
    farmOrigin: 'Ooty Organic Terraces, Nilgiris',
    keyPhytonutrient: 'Fresh Vitamin A, C & K and natural plant iron',
    healthBenefit: 'Packed with fresh green vitamins that deeply hydrate your body, improve digestion, and boost daily energy.',
    colorHex: '#3D6847',
    matchingDrinks: ['Emerald Canopy'],
    image: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6fa57?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'beet',
    name: 'Ooty Crimson Table Beets',
    botanicalFamily: 'Sweet Nilgiri Mountain Beets',
    category: 'Roots',
    farmOrigin: 'Nilgiri Hills Organic Slopes, Tamil Nadu',
    keyPhytonutrient: 'Natural beet nutrients that support healthy blood flow',
    healthBenefit: 'Naturally boosts stamina, supports heart health, and keeps you active and energised throughout the day.',
    colorHex: '#8F1E42',
    matchingDrinks: ['Ruby Beet Vitality'],
    image: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'spirulina',
    name: 'Madurai Blue Spirulina',
    botanicalFamily: 'Pure Mineral-Rich Blue Superfood',
    category: 'Superfoods',
    farmOrigin: 'Madurai Organic Farms, Tamil Nadu',
    keyPhytonutrient: 'Natural plant antioxidants & clean minerals',
    healthBenefit: 'Fights daily tiredness, sharpens mental focus, and supports overall body vitality.',
    colorHex: '#1981C8',
    matchingDrinks: ['Blue Majik Cloud'],
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'ginger',
    name: 'Wayanad Baby Ginger',
    botanicalFamily: 'Fresh Western Ghats Spiced Root',
    category: 'Roots',
    farmOrigin: 'Wayanad High Ranges, Kerala',
    keyPhytonutrient: 'Natural gingerol that warms and comforts the gut',
    healthBenefit: 'Soothes an upset stomach, eases bloating and heaviness, and promotes smooth, comfortable digestion.',
    colorHex: '#FF7A00',
    matchingDrinks: ['Golden Roots Glow', 'Emerald Canopy', 'Fire & Root Immunity Shot'],
    image: 'https://images.unsplash.com/photo-1615485290176-6953e5e40854?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'charcoal',
    name: 'Pollachi Coconut Charcoal',
    botanicalFamily: 'Pure Food-Grade Coconut Charcoal',
    category: 'Superfoods',
    farmOrigin: 'Organic Coconut Groves, Pollachi, Tamil Nadu',
    keyPhytonutrient: 'Ultra-fine natural charcoal that gently traps impurities',
    healthBenefit: 'Gently relieves gas and tummy bloating, leaving you feeling light, clean, and comfortable after meals.',
    colorHex: '#1F2937',
    matchingDrinks: ['Activated Charcoal Zen'],
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
  },
];

export const IngredientsWheel: React.FC = () => {
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientInfo>(INGREDIENTS[0]);
  const { openProductModal } = useCart();

  return (
    <section id="ingredients" className="py-20 sm:py-32 bg-brand-cream border-t border-brand-950/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-950 text-brand-cream text-xs font-mono font-bold tracking-widest uppercase">
            <Leaf className="w-3.5 h-3.5 text-brand-amber" />
            <span>FARM ORIGIN &amp; NATURAL INGREDIENTS</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl font-black text-brand-950 uppercase tracking-tight leading-[0.9]">
            Real Indian Farm Harvest.
          </h2>
          <p className="text-sm sm:text-base text-brand-700 font-normal">
            We partner directly with certified organic family farms across India. Tap any ingredient to see where it is grown and its simple, natural health benefits.
          </p>
        </div>

        {/* Interactive Selector Pill Bar */}
        <div className="mt-12 flex flex-wrap justify-center gap-2 sm:gap-3 font-mono">
          {INGREDIENTS.map((ing) => (
            <button
              key={ing.id}
              onClick={() => {
                setSelectedIngredient(ing);
                playPopSound();
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-2 border ${
                selectedIngredient.id === ing.id
                  ? 'bg-brand-950 text-brand-cream border-brand-950 shadow-xl scale-105'
                  : 'bg-white text-brand-800 border-brand-950/15 hover:border-brand-950/40'
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ing.colorHex }}
              />
              <span>{ing.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Spotlight Showcase Box */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-12 border border-brand-950/10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Image with Gradient Frame */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-brand-parchment relative group">
              <img
                src={selectedIngredient.image}
                alt={selectedIngredient.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-20 mix-blend-multiply pointer-events-none"
                style={{ backgroundColor: selectedIngredient.colorHex }}
              />
            </div>

            {/* Farm Origin Badge Pill */}
            <div className="mt-4 flex items-center gap-2 text-xs font-mono text-brand-800 bg-brand-parchment px-4 py-2.5 rounded-xl border border-brand-950/10 shadow-xs">
              <MapPin className="w-4 h-4 text-brand-amber shrink-0" />
              <span className="font-semibold">{selectedIngredient.farmOrigin}</span>
            </div>
          </div>

          {/* Right Column: Bio-Details & Matches */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-amber">
                {selectedIngredient.category} • {selectedIngredient.botanicalFamily}
              </span>
              <h3 className="font-display text-3xl sm:text-4xl font-black text-brand-950 mt-1 uppercase tracking-tight leading-[0.92]">
                {selectedIngredient.name}
              </h3>
              <p className="text-sm text-brand-700 mt-3 leading-relaxed">
                {selectedIngredient.healthBenefit}
              </p>
            </div>

            {/* Key Nutrient Breakdown */}
            <div className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-950/10 space-y-1 font-mono">
              <span className="text-[11px] font-bold text-brand-500 uppercase tracking-wider block">
                Key Natural Goodness:
              </span>
              <span className="text-sm font-black text-brand-950 block">
                {selectedIngredient.keyPhytonutrient}
              </span>
            </div>

            {/* Matching Juices */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-brand-950 block">
                Bottled in These Fresh Juices:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedIngredient.matchingDrinks.map((drinkName) => {
                  const match = PRODUCTS.find((p) => p.name === drinkName);
                  return (
                    <button
                      key={drinkName}
                      onClick={() => match && openProductModal(match)}
                      className="px-4 py-2 rounded-xl bg-brand-parchment hover:bg-brand-amber hover:text-white border border-brand-950/10 text-xs font-mono font-bold text-brand-950 transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Droplet className="w-3.5 h-3.5 text-brand-amber" />
                      <span>{drinkName}</span>
                      <ArrowRight className="w-3 h-3 ml-1 opacity-60" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
