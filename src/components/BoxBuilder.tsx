import React from 'react';
import { useCart } from '../context/CartContext';
import { PRODUCTS } from '../data/products';
import { playPopSound, playChimeSound } from '../utils/audio';
import { Plus, Minus, Check, Sparkles, Package, ShieldCheck, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const BoxBuilder: React.FC = () => {
  const {
    boxItems,
    boxTarget,
    setBoxTarget,
    addToBox,
    removeFromBox,
    clearBox,
    addBoxToCart,
    openProductModal,
  } = useCart();

  const isComplete = boxItems.length === boxTarget;
  const progressPercent = Math.min(100, (boxItems.length / boxTarget) * 100);

  const handlePackBox = () => {
    if (isComplete) {
      playChimeSound();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#C8741B', '#DDA74F', '#932839', '#2E4733'],
      });
    }
    addBoxToCart();
  };

  // Group box counts by product
  const countsMap = boxItems.reduce((acc, p) => {
    acc[p.id] = (acc[p.id] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <section id="atelier" className="py-20 sm:py-32 bg-cream-50 border-y border-earth-900/10 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-botanical-deep/10 text-botanical-deep text-xs font-mono font-bold uppercase tracking-widest">
            <Package className="w-3.5 h-3.5" />
            <span>ACT V • THE CRATE ATELIER (CUSTOM CURATION)</span>
          </div>
          <h2 className="font-display text-4xl sm:text-6xl font-black text-earth-950 uppercase tracking-tight">
            Curate Your Daily Juice Box.
          </h2>
          <p className="text-sm sm:text-base text-earth-700 font-normal">
            The tactile ritual of assembling your cold-chain crate. Mix and match fresh cold-pressed tonics, superfood smoothies, and protein elixirs. Enjoy tier savings, free refrigerated courier shipping, and ₹25 circular bottle cashback.
          </p>

          {/* Target Size Switcher: 6-Pack vs 12-Pack */}
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-cream-200 border border-earth-900/15 mt-4 font-mono">
            <button
              onClick={() => {
                setBoxTarget(6);
                playPopSound();
              }}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                boxTarget === 6
                  ? 'bg-earth-950 text-cream-100 shadow-lg scale-102'
                  : 'text-earth-700 hover:text-earth-950'
              }`}
            >
              6-PACK STARTER (15% OFF)
            </button>
            <button
              onClick={() => {
                setBoxTarget(12);
                playPopSound();
              }}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 ${
                boxTarget === 12
                  ? 'bg-earth-950 text-cream-100 shadow-lg scale-102'
                  : 'text-earth-700 hover:text-earth-950'
              }`}
            >
              12-PACK PRO (20% OFF + FREE CHILLED SHIPPING)
            </button>
          </div>
        </div>

        {/* Persistent Sticky Box Progress Dashboard */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-earth-900/10 relative overflow-hidden">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-earth-900/10">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-3xl font-black text-earth-950 uppercase">
                  BOX TELEMETRY
                </span>
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-citrus-amber/15 text-citrus-amber border border-citrus-amber/30">
                  {boxItems.length} OF {boxTarget} BOTTLES FILLED
                </span>
              </div>
              <p className="text-xs font-mono text-earth-600 mt-1">
                {isComplete
                  ? '🎉 BOX COMPLETE! CLICK "ADD BOX TO BAG" TO PACK AND CHILL.'
                  : `Add ${boxTarget - boxItems.length} more bottle${boxTarget - boxItems.length > 1 ? 's' : ''} to unlock your ${boxTarget === 6 ? '15%' : '20%'} bundle savings!`}
              </p>
            </div>

            {/* Price & Add to Bag CTA */}
            <div className="flex items-center gap-4">
              <div className="text-right font-mono">
                <span className="text-3xl font-black text-earth-950">
                  ₹{boxTarget === 6 ? '1,699' : '3,199'}
                </span>
                <span className="text-xs block text-earth-400 line-through">
                  ₹{boxTarget === 6 ? '1,899' : '3,699'}
                </span>
              </div>

              <button
                onClick={handlePackBox}
                disabled={!isComplete}
                className={`px-7 py-4 rounded-full font-mono font-black text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 flex items-center gap-2 shadow-lg ${
                  isComplete
                    ? 'bg-earth-950 hover:bg-earth-900 text-cream-100 hover:scale-105 active:scale-95 shadow-2xl'
                    : 'bg-cream-200 text-earth-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4 text-citrus-glow" />
                <span>{isComplete ? 'PACK BOX INTO BAG' : `ADD ${boxTarget - boxItems.length} MORE`}</span>
              </button>
            </div>
          </div>

          {/* Visual Progress Bar */}
          <div className="mt-6">
            <div className="w-full bg-cream-200 h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-citrus-amber via-citrus-glow to-botanical-mint h-full transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(255,107,0,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Box Bottle Slot Visualizer */}
          <div className="mt-8">
            <div className="grid grid-cols-6 sm:grid-cols-6 md:grid-cols-12 gap-2 sm:gap-3">
              {Array.from({ length: boxTarget }).map((_, idx) => {
                const item = boxItems[idx];
                return (
                  <div
                    key={idx}
                    className={`aspect-[3/5] rounded-2xl border-2 flex flex-col items-center justify-center p-2 relative transition-all duration-300 ${
                      item
                        ? 'border-earth-950 bg-cream-100 shadow-md'
                        : 'border-dashed border-earth-300 bg-cream-50/50 hover:border-earth-400'
                    }`}
                  >
                    {item ? (
                      <>
                        <button
                          onClick={() => {
                            removeFromBox(idx);
                            playPopSound();
                          }}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-berry-ruby text-white flex items-center justify-center shadow-md hover:scale-110 transition"
                          title="Remove from box"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-14 object-cover rounded-md shadow-xs mb-1"
                        />
                        <span className="text-[9px] font-mono font-bold text-earth-950 text-center leading-tight truncate w-full">
                          {item.name.split(' ')[0]}
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-mono font-bold text-earth-400">
                        #{idx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {boxItems.length > 0 && (
              <div className="mt-4 flex justify-between items-center text-xs font-mono text-earth-600">
                <button
                  onClick={() => {
                    clearBox();
                    playPopSound();
                  }}
                  className="text-berry-ruby hover:underline font-bold"
                >
                  CLEAR BOX
                </button>
                <span>
                  {boxItems.length} OF {boxTarget} SELECTED
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Pick Products Grid */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-bold text-earth-950 uppercase">
              SELECT BOTTLES:
            </h3>
            <span className="text-xs font-mono text-earth-600 font-bold">
              CLICK &quot;+ ADD TO BOX&quot;
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS.map((product) => {
              const inBoxCount = countsMap[product.id] || 0;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-5 border border-earth-900/10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div
                      className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 mb-4 cursor-pointer"
                      onClick={() => openProductModal(product)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 bg-earth-950/85 backdrop-blur-md text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                        {product.category}
                      </div>
                      {inBoxCount > 0 && (
                        <div className="absolute top-2 right-2 bg-citrus-amber text-white text-xs font-mono font-black w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse">
                          {inBoxCount}
                        </div>
                      )}
                    </div>

                    <h4 className="font-display text-base font-black text-earth-950 uppercase tracking-tight line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="text-xs text-earth-600 mt-1 line-clamp-2">
                      {product.tagline}
                    </p>

                    <div className="mt-2.5 flex items-center gap-2 font-mono text-[11px]">
                      <span className="font-bold text-earth-500">
                        {product.calories} KCAL
                      </span>
                      <span className="text-earth-300">•</span>
                      <span className="font-bold text-botanical-deep">
                        {product.benefits[0]}
                      </span>
                    </div>
                  </div>

                  {/* Add to Box Button / Quantity Counter */}
                  <div className="mt-4 pt-3 border-t border-earth-900/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        openProductModal(product);
                        playPopSound();
                      }}
                      className="text-xs font-mono font-bold text-earth-700 hover:text-earth-950 hover:underline"
                    >
                      SPECS
                    </button>

                    <button
                      onClick={() => {
                        addToBox(product);
                        playPopSound();
                      }}
                      disabled={isComplete}
                      className={`px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase transition-all duration-200 flex items-center gap-1.5 ${
                        isComplete
                          ? 'bg-cream-200 text-earth-400 cursor-not-allowed'
                          : 'bg-earth-950 hover:bg-earth-900 text-cream-100 hover:scale-105 active:scale-95 shadow-sm'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5 text-citrus-glow" />
                      <span>ADD TO BOX</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
