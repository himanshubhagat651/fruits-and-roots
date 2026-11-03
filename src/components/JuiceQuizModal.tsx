import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { X, Sparkles, ArrowRight, RotateCcw, Droplet } from 'lucide-react';
import confetti from 'canvas-confetti';

export const JuiceQuizModal: React.FC = () => {
  const { isQuizOpen, closeQuiz, addToCart, showToast } = useCart();
  const [step, setStep] = useState(1);
  const [goal, setGoal] = useState<string>('Immunity');
  const [flavor, setFlavor] = useState<string>('Citrus & Spicy');
  const [routine, setRoutine] = useState<string>('Morning ritual');

  if (!isQuizOpen) return null;

  const handleFinish = () => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
    setStep(4); // Results
  };

  const resetQuiz = () => {
    setStep(1);
    setGoal('Immunity');
    setFlavor('Citrus & Spicy');
    setRoutine('Morning ritual');
  };

  // Determine recommendation based on answers
  const recommendedProduct = (() => {
    if (goal === 'Muscle Recovery') return PRODUCTS.find((p) => p.id === 'raw-cacao-reishi-bliss')!;
    if (goal === 'Deep Gut Reset') return PRODUCTS.find((p) => p.id === 'emerald-canopy-detox')!;
    if (goal === 'Radiant Skin Glow') return PRODUCTS.find((p) => p.id === 'pitaya-sunrise-velvet')!;
    if (flavor === 'Earthy Roots') return PRODUCTS.find((p) => p.id === 'ruby-beet-vitality')!;
    return PRODUCTS.find((p) => p.id === 'golden-roots-glow')!;
  })();

  const companionProduct = PRODUCTS.find((p) => p.id === 'fire-ginger-immunity-shot')!;

  const handleAddBundle = () => {
    addToCart(recommendedProduct, { quantity: 2 });
    addToCart(companionProduct, { quantity: 2 });
    showToast(`Added Recommended Bundle to your Bag!`);
    closeQuiz();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-earth-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-cream-50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-3xl border border-white/60 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-earth-900/10">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-citrus-amber" />
            <h3 className="font-display text-xl font-black text-earth-950 uppercase tracking-tight">
              Find Your Perfect Sip
            </h3>
          </div>
          <button
            onClick={closeQuiz}
            className="p-1.5 rounded-full hover:bg-cream-200 text-earth-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {step < 4 && (
          <div className="mt-4 flex items-center justify-between text-xs text-earth-600">
            <span>Step {step} of 3</span>
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-8 h-1.5 rounded-full transition-all duration-300 ${
                    step >= s ? 'bg-citrus-amber' : 'bg-cream-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Step 1: Wellness Goal */}
        {step === 1 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-display text-xl font-black text-earth-950 uppercase tracking-tight">
              What is your primary health aspiration right now?
            </h4>
            <div className="space-y-2.5">
              {[
                { title: 'Immunity & Daily Vitality', desc: 'Shield against bugs and fatigue with concentrated Wayanad ginger & Lakadong turmeric', val: 'Immunity' },
                { title: 'Deep Gut Reset & Bloat Relief', desc: 'Alkalize with raw Nilgiri chlorophyll and mountain greens', val: 'Deep Gut Reset' },
                { title: 'Radiant Skin Glow & Hydration', desc: 'High antioxidant exotic fruits and Pollachi tender coconut water', val: 'Radiant Skin Glow' },
                { title: 'Muscle Recovery & Clean Protein', desc: 'Sprouted plant protein with calming Nagaur ashwagandha & Idukki raw cacao', val: 'Muscle Recovery' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setGoal(opt.val)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition ${
                    goal === opt.val
                      ? 'border-citrus-amber bg-citrus-amber/10 shadow-xs'
                      : 'border-earth-900/10 bg-white hover:border-earth-900/30'
                  }`}
                >
                  <span className="font-bold text-sm text-earth-950 block">{opt.title}</span>
                  <span className="text-xs text-earth-600 block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full mt-4 py-3 rounded-xl bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <span>Next Question</span>
              <ArrowRight className="w-4 h-4 text-citrus-glow" />
            </button>
          </div>
        )}

        {/* Step 2: Flavor Profile */}
        {step === 2 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-display text-xl font-black text-earth-950 uppercase tracking-tight">
              What flavour notes does your palate crave?
            </h4>
            <div className="space-y-2.5">
              {[
                { title: 'Zesty Citrus & Spicy Kick', desc: 'Nagpur orange, Wayanad ginger, Assam kaji nemu', val: 'Citrus & Spicy' },
                { title: 'Crisp, Savory & Earthy Greens', desc: 'Cucumber, Nilgiri kale, celery, fresh pudina', val: 'Crisp Greens' },
                { title: 'Deep Earthy Roots & Berries', desc: 'Ooty red beets, wild Himalayan berries, pomegranate', val: 'Earthy Roots' },
                { title: 'Rich, Creamy & Chocolatey', desc: 'Idukki raw cacao, sprouted oats, almond butter', val: 'Creamy Chocolate' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setFlavor(opt.val)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition ${
                    flavor === opt.val
                      ? 'border-citrus-amber bg-citrus-amber/10 shadow-xs'
                      : 'border-earth-900/10 bg-white hover:border-earth-900/30'
                  }`}
                >
                  <span className="font-bold text-sm text-earth-950 block">{opt.title}</span>
                  <span className="text-xs text-earth-600 block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(1)}
                className="py-3 px-4 rounded-xl border border-earth-900/20 text-xs font-bold text-earth-800"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 py-3 rounded-xl bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm transition flex items-center justify-center gap-2"
              >
                <span>Final Step</span>
                <ArrowRight className="w-4 h-4 text-citrus-glow" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Drinking Cadence */}
        {step === 3 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-display text-xl font-black text-earth-950 uppercase tracking-tight">
              How do you prefer to enjoy your fresh juice?
            </h4>
            <div className="space-y-2.5">
              {[
                { title: 'First thing in the morning', desc: 'On an empty stomach to fire up digestion and metabolism', val: 'Morning ritual' },
                { title: 'Mid-afternoon 3 PM slump', desc: 'Natural raw energy instead of chai or sugary snacks', val: 'Afternoon pick-me-up' },
                { title: 'Post-exercise workout replenishment', desc: 'Restore electrolytes, glycogen, and lean plant protein', val: 'Post-workout' },
                { title: 'A dedicated multi-day reset', desc: 'Give food digestion a total vacation', val: 'Full cleanse' },
              ].map((opt) => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => setRoutine(opt.val)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition ${
                    routine === opt.val
                      ? 'border-citrus-amber bg-citrus-amber/10 shadow-xs'
                      : 'border-earth-900/10 bg-white hover:border-earth-900/30'
                  }`}
                >
                  <span className="font-bold text-sm text-earth-950 block">{opt.title}</span>
                  <span className="text-xs text-earth-600 block mt-0.5">{opt.desc}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(2)}
                className="py-3 px-4 rounded-xl border border-earth-900/20 text-xs font-bold text-earth-800"
              >
                Back
              </button>
              <button
                onClick={handleFinish}
                className="flex-1 py-3 rounded-xl bg-citrus-amber hover:bg-citrus-glow text-earth-950 font-bold text-sm transition shadow-lg flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>See My Diagnostic Sip</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Personalized Recommendation Card */}
        {step === 4 && (
          <div className="mt-6 space-y-5 animate-in zoom-in-95 duration-300">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-botanical-deep uppercase tracking-widest">
                Tailored Botanical Prescription
              </span>
              <h4 className="font-display text-2xl font-black text-earth-950 uppercase tracking-tight leading-tight">
                Your Botanical Match: {recommendedProduct.name}
              </h4>
              <p className="text-xs text-earth-600">
                Crafted to support your target: <strong className="text-earth-900">{goal}</strong> with {flavor.toLowerCase()} notes.
              </p>
            </div>

            {/* Matched Product Preview */}
            <div className="p-4 rounded-2xl bg-white border border-earth-900/10 flex items-center gap-4 shadow-sm">
              <img
                src={recommendedProduct.image}
                alt={recommendedProduct.name}
                className="w-20 h-24 object-cover rounded-xl shadow-xs"
              />
              <div className="flex-1">
                <span className="text-[10px] font-bold uppercase text-citrus-amber">
                  Primary Match
                </span>
                <h5 className="font-display text-lg font-black text-earth-950 uppercase tracking-tight">
                  {recommendedProduct.name}
                </h5>
                <p className="text-xs text-earth-600 line-clamp-1">
                  {recommendedProduct.tagline}
                </p>
                <div className="mt-2 text-xs font-bold text-earth-950">
                  ₹{recommendedProduct.price.toLocaleString('en-IN')}{' '}
                  <span className="text-[11px] font-normal text-botanical-deep font-semibold">
                    (or ₹{recommendedProduct.subscriptionPrice.toLocaleString('en-IN')} sub)
                  </span>
                </div>
              </div>
            </div>

            {/* Paired Companion Shot */}
            <div className="p-3 rounded-xl bg-cream-200/70 border border-earth-900/10 flex items-center gap-3">
              <img
                src={companionProduct.image}
                alt={companionProduct.name}
                className="w-12 h-12 object-cover rounded-lg"
              />
              <div className="flex-1 text-xs">
                <span className="font-bold text-earth-950 block">Recommended Booster Pairing:</span>
                <span className="text-earth-600 block">{companionProduct.name} (2x Immunity Shots)</span>
              </div>
            </div>

            {/* Bundle CTA */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddBundle}
                className="w-full py-3.5 rounded-xl bg-earth-950 hover:bg-earth-900 text-cream-100 font-bold text-sm transition shadow-xl hover:scale-102 active:scale-98 flex items-center justify-center gap-2"
              >
                <Droplet className="w-4 h-4 text-citrus-glow" />
                <span>Add 4-Bottle Diagnostic Starter to Bag</span>
              </button>

              <button
                onClick={resetQuiz}
                className="w-full py-2 text-xs font-semibold text-earth-600 hover:text-earth-950 flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Retake Diagnostic
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
